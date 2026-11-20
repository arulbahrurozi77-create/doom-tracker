"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import {
  filterByPeriod,
  getRemainingDaysInPeriod,
  PeriodType,
  TransactionItem,
} from "@/lib/dateFilter"

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transaksi" },
  { href: "/analytics", label: "Analisis AI" },
]

const PERIODS: { key: PeriodType; label: string }[] = [
  { key: "today", label: "Hari Ini" },
  { key: "week", label: "7 Hari" },
  { key: "month", label: "30 Hari" },
  { key: "all", label: "Semua" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [period, setPeriod] = useState<PeriodType>("month")
  const [loading, setLoading] = useState(true)

  const [budgetTarget, setBudgetTarget] = useState<number>(5000000)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState("5000000")

  const [simExpense, setSimExpense] = useState("")
  const [simResult, setSimResult] = useState<{ score: number; result: string } | null>(null)
  const [simLoading, setSimLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
      return
    }
    const stored = localStorage.getItem("doomtracker-user")
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      const savedBudget = localStorage.getItem(`budget_${parsed.email}`)
      if (savedBudget) {
        setBudgetTarget(Number(savedBudget))
        setBudgetInput(savedBudget)
      }
    }
    apiFetch("/transactions")
      .then(async (res) => {
        if (res.ok) setTransactions(await res.json())
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleSaveBudget = () => {
    const val = Math.max(0, Number(budgetInput) || 0)
    setBudgetTarget(val)
    if (user?.email) localStorage.setItem(`budget_${user.email}`, String(val))
    setIsEditingBudget(false)
  }

  const handleQuickPredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!simExpense) return
    setSimLoading(true)
    try {
      const res = await apiFetch("/predict", {
        method: "POST",
        body: JSON.stringify({
          income: budgetTarget,
          expense: Number(simExpense),
          savings: Math.max(0, budgetTarget - Number(simExpense)),
          debt: 0,
        }),
      })
      if (res.ok) setSimResult(await res.json())
    } finally {
      setSimLoading(false)
    }
  }

  const filteredTx = filterByPeriod(transactions, period)
  const totalExpense = filteredTx.reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const remainingSavings = budgetTarget - totalExpense
  const remainingDays = getRemainingDaysInPeriod(period)
  const safeDailySpend = remainingSavings > 0 ? Math.floor(remainingSavings / remainingDays) : 0
  const usagePercent = budgetTarget > 0 ? Math.min(100, Math.round((totalExpense / budgetTarget) * 100)) : 100
  const doomScore = budgetTarget > 0 ? Math.min(100, Math.max(1, Math.round((totalExpense / budgetTarget) * 100))) : 100

  const formatIDR = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num)

  const cleanSimLabel = simResult?.result
    ? simResult.result.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F]/gu, "").trim()
    : ""

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B2540]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400 text-sm font-extrabold text-[#0B2540]">
              DT
            </div>
            <span className="hidden text-base font-semibold text-white sm:inline">DoomTracker</span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                  item.href === "/" ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => {
              localStorage.clear()
              router.push("/login")
            }}
            className="rounded-md border border-white/20 px-3.5 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Ringkasan Arus Kas</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Halo, {user?.name || "Pengguna"}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {remainingSavings >= 0
                ? `Batas aman belanja harian Anda: ${formatIDR(safeDailySpend)}/hari untuk ${remainingDays} hari ke depan.`
                : "Pengeluaran pada periode ini sudah melebihi batas target anggaran Anda."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    period === p.key ? "bg-[#0B2540] text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Link
              href="/transactions"
              className="rounded-lg bg-[#0B2540] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12365c]"
            >
              + Catat
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total Pengeluaran</span>
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {filteredTx.length} Transaksi
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums sm:text-3xl">
              {loading ? "..." : formatIDR(totalExpense)}
            </p>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>Terpakai dari target</span>
                <span>{usagePercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${usagePercent > 85 ? "bg-rose-600" : "bg-teal-600"}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Skor Risiko</span>
              <span
                className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                  doomScore < 50
                    ? "bg-teal-50 text-teal-700"
                    : doomScore < 80
                    ? "bg-amber-50 text-amber-800"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {doomScore < 50 ? "Aman" : doomScore < 80 ? "Waspada" : "Kritis"}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{doomScore}</p>
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Rasio perbandingan total pengeluaran terhadap anggaran periode aktif.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Sisa Penghematan</span>
              <button
                onClick={() => setIsEditingBudget(!isEditingBudget)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
              >
                {isEditingBudget ? "Batal" : "Atur Target"}
              </button>
            </div>
            {isEditingBudget ? (
              <div className="mt-3 space-y-2">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
                  placeholder="Target anggaran (Rp)"
                />
                <button
                  onClick={handleSaveBudget}
                  className="h-9 w-full rounded-lg bg-[#0B2540] text-xs font-semibold text-white hover:bg-[#12365c]"
                >
                  Simpan Target
                </button>
              </div>
            ) : (
              <>
                <p
                  className={`mt-3 text-2xl font-bold tabular-nums sm:text-3xl ${
                    remainingSavings >= 0 ? "text-teal-700" : "text-rose-600"
                  }`}
                >
                  {formatIDR(remainingSavings)}
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  Dari target <span className="font-semibold text-slate-800">{formatIDR(budgetTarget)}</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Transaksi pada Periode Ini</h2>
              <Link href="/transactions" className="text-xs font-semibold text-teal-700 hover:underline">
                Lihat Semua →
              </Link>
            </div>
            {filteredTx.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">Belum ada transaksi pada periode ini.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTx.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium capitalize text-slate-900">{item.title}</p>
                      <span className="mt-0.5 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">{formatIDR(item.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Simulasi Rencana Belanja</h2>
            <p className="mt-1 text-xs text-slate-600">Cek status risiko jika Anda melakukan pengeluaran baru.</p>
            <form onSubmit={handleQuickPredict} className="mt-4 space-y-3">
              <input
                type="number"
                placeholder="Nominal rencana belanja (Rp)"
                value={simExpense}
                onChange={(e) => setSimExpense(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={simLoading}
                className="h-11 w-full rounded-lg bg-[#0B2540] text-sm font-semibold text-white hover:bg-[#12365c] disabled:opacity-60"
              >
                {simLoading ? "Menganalisis..." : "Cek Dampak Anggaran"}
              </button>
            </form>
            {simResult && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs">
                <p className="font-semibold text-slate-900">
                  Hasil: {cleanSimLabel} (Skor {simResult.score}/100)
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
