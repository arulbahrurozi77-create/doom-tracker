"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

interface Transaction {
  id: number
  title: string
  category: string
  amount: number
  created_at?: string
}

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transaksi" },
  { href: "/analytics", label: "Analisis AI" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // State Pengaturan Target / Anggaran Bulanan Pengguna
  const [budgetTarget, setBudgetTarget] = useState<number>(5000000)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState("5000000")

  // Quick Prediction AI di Dashboard
  const [simExpense, setSimExpense] = useState("")
  const [simResult, setSimResult] = useState<string | null>(null)
  const [simLoading, setSimLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const storedUser = localStorage.getItem("doomtracker-user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      const savedBudget = localStorage.getItem(`budget_${parsed.email}`)
      if (savedBudget) {
        setBudgetTarget(Number(savedBudget))
        setBudgetInput(savedBudget)
      }
    }

    fetchTransactions()
  }, [router])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/transactions")
      if (res.ok) {
        const data = await res.json()
        setTransactions(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBudget = () => {
    const val = Math.max(0, Number(budgetInput) || 0)
    setBudgetTarget(val)
    if (user?.email) {
      localStorage.setItem(`budget_${user.email}`, String(val))
    }
    setIsEditingBudget(false)
  }

  const handleQuickPredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!simExpense) return
    try {
      setSimLoading(true)
      const res = await apiFetch("/predict", {
        method: "POST",
        body: JSON.stringify({
          income: budgetTarget,
          expense: Number(simExpense),
          savings: Math.max(0, budgetTarget - Number(simExpense)),
          debt: 0,
        }),
      })
      const data = await res.json()
      setSimResult(data.prediction || data.status || data.message || JSON.stringify(data))
    } catch {
      setSimResult("Gagal memproses simulasi AI.")
    } finally {
      setSimLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  const totalExpense = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const remainingSavings = budgetTarget - totalExpense
  const usagePercent = budgetTarget > 0 ? Math.min(100, Math.round((totalExpense / budgetTarget) * 100)) : 100
  const doomScore = budgetTarget > 0 ? Math.min(100, Math.max(1, Math.round((totalExpense / budgetTarget) * 100))) : 100

  const formatIDR = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num)

  const scoreStatus =
    doomScore < 50
      ? { label: "Aman", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", bar: "bg-emerald-500" }
      : doomScore < 80
      ? { label: "Waspada", badge: "bg-amber-50 text-amber-700 ring-amber-600/20", bar: "bg-amber-500" }
      : { label: "Kritis", badge: "bg-rose-50 text-rose-700 ring-rose-600/20", bar: "bg-rose-500" }

  const cardClass = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
  const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/25"

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===== Navbar ===== */}
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
              const active = item.href === "/"
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

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium leading-tight text-white">{user?.name || "Pengguna"}</p>
              <p className="text-xs leading-tight text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`rounded-md border border-white/20 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white ${focusRing}`}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* ===== Sambutan ===== */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Halo, {user?.name || "Pengguna"}
            </h1>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
              {remainingSavings >= 0
                ? "Kondisi keuangan Anda terkendali. Pertahankan rasio pengeluaran di bawah target."
                : "Peringatan: pengeluaran Anda telah melampaui batas anggaran yang ditetapkan."}
            </p>
          </div>
          <Link
            href="/transactions"
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0B2540] px-5 text-sm font-semibold text-white transition hover:bg-[#12365c] ${focusRing}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Catat pengeluaran
          </Link>
        </section>

        {/* ===== KPI ===== */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Total pengeluaran */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total pengeluaran</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {transactions.length} transaksi
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {loading ? "..." : formatIDR(totalExpense)}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-slate-600">
                <span>Terpakai dari anggaran</span>
                <span className="font-medium tabular-nums">{usagePercent}%</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={usagePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Persentase anggaran terpakai"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${
                    usagePercent > 85 ? "bg-rose-500" : "bg-teal-600"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Doom score */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Skor risiko (Doom Score)</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${scoreStatus.badge}`}>
                {scoreStatus.label}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{doomScore}</p>
              <span className="text-sm text-slate-500">/ 100</span>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden>
              <div className={`h-full rounded-full ${scoreStatus.bar}`} style={{ width: `${doomScore}%` }} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Semakin rendah skor, semakin sehat pengeluaran Anda bulan ini.
            </p>
          </div>

          {/* Sisa penghematan */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Sisa penghematan</span>
              <button
                onClick={() => setIsEditingBudget(!isEditingBudget)}
                className={`rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 ${focusRing}`}
              >
                {isEditingBudget ? "Batal" : "Atur target"}
              </button>
            </div>

            {isEditingBudget ? (
              <div className="mt-3 space-y-2.5">
                <label htmlFor="budget" className="block text-xs text-slate-600">
                  Target anggaran bulanan (Rp)
                </label>
                <div className="flex gap-2">
                  <input
                    id="budget"
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="Contoh: 3000000"
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className={`h-10 shrink-0 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 ${focusRing}`}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className={`mt-3 text-3xl font-semibold tracking-tight tabular-nums ${
                    remainingSavings >= 0 ? "text-teal-700" : "text-rose-600"
                  }`}
                >
                  {formatIDR(remainingSavings)}
                </p>
                <p className="mt-5 text-xs text-slate-600">
                  Dari target anggaran{" "}
                  <span className="font-semibold text-slate-900 tabular-nums">{formatIDR(budgetTarget)}</span>
                </p>
              </>
            )}
          </div>
        </section>

        {/* ===== Transaksi & Simulasi ===== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={`${cardClass} lg:col-span-2`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Transaksi terbaru</h2>
              <Link
                href="/transactions"
                className={`rounded-md text-sm font-medium text-teal-700 transition hover:text-teal-800 hover:underline ${focusRing}`}
              >
                Lihat semua
              </Link>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-slate-500">Memuat data transaksi...</p>
            ) : transactions.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-slate-800">Belum ada transaksi</p>
                <p className="mt-1 text-sm text-slate-500">Catat pengeluaran pertama Anda untuk mulai memantau anggaran.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {transactions.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium capitalize text-slate-900">{item.title}</p>
                      <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">
                        {item.category}
                      </span>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums">
                      -{formatIDR(item.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-900">Simulasi pengeluaran AI</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Uji dampak rencana belanja terhadap sisa anggaran Anda.
            </p>

            <form onSubmit={handleQuickPredict} className="mt-5 space-y-3">
              <div>
                <label htmlFor="sim" className="mb-2 block text-sm font-medium text-slate-800">
                  Nominal rencana belanja (Rp)
                </label>
                <input
                  id="sim"
                  type="number"
                  placeholder="Contoh: 500000"
                  value={simExpense}
                  onChange={(e) => setSimExpense(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
                />
              </div>
              <button
                type="submit"
                disabled={simLoading}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0B2540] text-sm font-semibold text-white transition hover:bg-[#12365c] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
              >
                {simLoading && (
                  <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
                {simLoading ? "Menganalisis..." : "Analisis dampak"}
              </button>
            </form>

            {simResult && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-3.5 text-sm leading-relaxed text-teal-900"
              >
                <svg className="mt-0.5 h-4 w-4 flex-none text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
                </svg>
                <span>{simResult}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
