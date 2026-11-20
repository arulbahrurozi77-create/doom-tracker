"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import DonutChart from "@/components/DonutChart"

interface Transaction {
  id: number
  title: string
  category: string
  amount: number
}

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transaksi" },
  { href: "/analytics", label: "Analisis AI" },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [income, setIncome] = useState("5000000")
  const [expense, setExpense] = useState("")
  const [savings, setSavings] = useState("1500000")
  const [debt, setDebt] = useState("0")
  const [pred, setPred] = useState<{ score: number; result: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
      return
    }
    apiFetch("/transactions").then(async (res) => {
      if (!res.ok) return
      const data: Transaction[] = await res.json()
      setTransactions(data)
      const total = data.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      setExpense(String(total))
      const u = localStorage.getItem("doomtracker-user")
      if (u) {
        const saved = localStorage.getItem(`budget_${JSON.parse(u).email}`)
        if (saved) {
          setIncome(saved)
          setSavings(String(Math.max(0, Number(saved) - total)))
        }
      }
    })
  }, [router])

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiFetch("/predict", {
        method: "POST",
        body: JSON.stringify({
          income: Number(income) || 0,
          expense: Number(expense) || 0,
          savings: Number(savings) || 0,
          debt: Number(debt) || 0,
        }),
      })
      setPred(await res.json())
    } finally {
      setLoading(false)
    }
  }

  const catTotals = transactions.reduce<Record<string, number>>((acc, t) => {
    const k = t.category || "Lainnya"
    acc[k] = (acc[k] || 0) + Number(t.amount || 0)
    return acc
  }, {})
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1])

  const cleanLabel = pred?.result ? pred.result.replace(/[^\p{L}\p{N}\s-]/gu, "").trim() : ""
  const score = pred?.score ?? 0
  const advice =
    score >= 75
      ? "Rasio pengeluaran terlalu tinggi dibanding pemasukan. Kurangi belanja non-esensial."
      : score >= 40
      ? "Pengeluaran mulai mendekati batas aman, tetap pantau anggaran bulanan."
      : "Alokasi pemasukan, pengeluaran, dan tabungan berada di zona aman."

  const badgeStyle =
    score >= 75
      ? "bg-rose-50 text-rose-700 ring-rose-600/20"
      : score >= 40
      ? "bg-amber-50 text-amber-800 ring-amber-600/20"
      : "bg-teal-50 text-teal-800 ring-teal-600/20"

  const cardClass = "rounded-xl border border-slate-200 bg-white shadow-sm"
  const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/25"
  const fieldClass =
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 transition focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B2540]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400 text-sm font-extrabold text-[#0B2540]">
              DT
            </div>
            <span className="hidden text-base font-semibold tracking-tight text-white sm:inline">DoomTracker</span>
          </div>

          <nav aria-label="Navigasi utama" className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.href === "/analytics"
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${focusRing} ${
                    active ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <Link
            href="/"
            className={`hidden rounded-md border border-white/20 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white sm:inline-block ${focusRing}`}
          >
            Kembali
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Analisis & prediksi AI</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">
            Pantau proporsi pengeluaran per kategori dan evaluasi skor kesehatan finansial Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className={`${cardClass} flex flex-col justify-between p-6`}>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Proporsi pengeluaran</h2>
              <p className="mt-1 text-sm text-slate-600">Arahkan kursor ke lingkaran untuk melihat detail kategori.</p>
            </div>
            {sortedCats.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-500">Belum ada data transaksi.</p>
            ) : (
              <DonutChart categories={sortedCats} />
            )}
            <div className="flex justify-between border-t border-slate-200 pt-4 text-xs text-slate-600">
              <span>Kategori aktif</span>
              <span className="font-semibold text-slate-900">{sortedCats.length} Kategori</span>
            </div>
          </section>

          <section className={`${cardClass} p-6`}>
            <h2 className="text-base font-semibold text-slate-900">Model prediksi kesehatan finansial</h2>
            <p className="mt-1 mb-5 text-sm text-slate-600">Evaluasi kondisi pengeluaran terhadap target anggaran Anda.</p>

            <form onSubmit={handlePredict} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">Pemasukan / Target (Rp)</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">Total Pengeluaran (Rp)</label>
                <input type="number" value={expense} onChange={(e) => setExpense(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">Tabungan Saat Ini (Rp)</label>
                <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800">Cicilan / Hutang (Rp)</label>
                <input type="number" value={debt} onChange={(e) => setDebt(e.target.value)} className={fieldClass} />
              </div>
              <div className="pt-1 sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`h-11 w-full rounded-lg bg-[#0B2540] text-sm font-semibold text-white transition hover:bg-[#12365c] disabled:opacity-60 ${focusRing}`}
                >
                  {loading ? "Menjalankan Model AI..." : "Jalankan Analisis Prediksi"}
                </button>
              </div>
            </form>

            {pred && (
              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Status Kesehatan Finansial</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{cleanLabel}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{advice}</p>
                </div>
                <div className={`shrink-0 rounded-xl px-4 py-3 text-center ring-1 ring-inset ${badgeStyle}`}>
                  <span className="block text-[11px] font-medium">Skor</span>
                  <span className="text-2xl font-extrabold tabular-nums">{score}</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
