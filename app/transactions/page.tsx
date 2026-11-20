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

const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Tagihan & Utilitas",
  "Belanja & Hiburan",
  "Pendidikan & Kuliah",
  "Lainnya",
]

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Makanan & Minuman")
  const [amount, setAmount] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Search & Filter
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
      return
    }
    loadTransactions()
  }, [router])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/transactions")
      if (res.ok) {
        setTransactions(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !category || !amount) return

    try {
      setSubmitting(true)
      if (editingId !== null) {
        await apiFetch(`/transactions/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ title, category, amount: Number(amount) }),
        })
      } else {
        await apiFetch("/transactions", {
          method: "POST",
          body: JSON.stringify({ title, category, amount: Number(amount) }),
        })
      }

      setTitle("")
      setCategory("Makanan & Minuman")
      setAmount("")
      setEditingId(null)
      await loadTransactions()
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: Transaction) => {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category)
    setAmount(String(item.amount))
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus transaksi ini?")) return
    await apiFetch(`/transactions/${id}`, { method: "DELETE" })
    await loadTransactions()
  }

  const filtered = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  )

  const filteredTotal = filtered.reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const formatIDR = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num)

  const cardClass = "rounded-xl border border-slate-200 bg-white shadow-sm"
  const focusRing = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/25"
  const fieldClass =
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"

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
              const active = item.href === "/transactions"
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Manajemen transaksi</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">
            Catat, ubah, dan telusuri semua pengeluaran Anda di satu tempat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ===== Form tambah / edit ===== */}
          <section className={`${cardClass} h-fit p-6`} aria-labelledby="form-title">
            <h2 id="form-title" className="text-base font-semibold text-slate-900">
              {editingId ? "Edit transaksi" : "Tambah transaksi baru"}
            </h2>
            {editingId && (
              <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-600/20">
                Anda sedang mengubah transaksi yang sudah tersimpan.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-800">
                  Nama pengeluaran
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Contoh: Makan siang, bensin"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-800">
                  Kategori
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={fieldClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-slate-800">
                  Nominal (Rp)
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Contoh: 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className={fieldClass}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0B2540] text-sm font-semibold text-white transition hover:bg-[#12365c] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
                >
                  {submitting && (
                    <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {submitting ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Simpan transaksi"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setTitle("")
                      setAmount("")
                    }}
                    className={`h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${focusRing}`}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ===== Riwayat ===== */}
          <section className={`${cardClass} p-6 lg:col-span-2`} aria-labelledby="list-title">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 id="list-title" className="text-base font-semibold text-slate-900">
                  Riwayat transaksi
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {filtered.length} transaksi, total{" "}
                  <span className="font-semibold text-slate-900 tabular-nums">{formatIDR(filteredTotal)}</span>
                </p>
              </div>
              <div className="relative sm:w-64">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  aria-label="Cari transaksi atau kategori"
                  placeholder="Cari transaksi atau kategori"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
                />
              </div>
            </div>

            {loading ? (
              <p className="py-12 text-center text-sm text-slate-500">Memuat riwayat transaksi...</p>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-slate-800">
                  {search ? "Tidak ada transaksi yang sesuai" : "Belum ada transaksi"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {search ? "Coba kata kunci lain." : "Tambahkan pengeluaran pertama Anda lewat formulir."}
                </p>
              </div>
            ) : (
              <div className="-mx-2 overflow-x-auto px-2">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-600">
                      <th scope="col" className="py-3 pr-4 font-medium">Keterangan</th>
                      <th scope="col" className="py-3 pr-4 font-medium">Kategori</th>
                      <th scope="col" className="py-3 pr-4 text-right font-medium">Nominal</th>
                      <th scope="col" className="py-3 text-right font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition hover:bg-slate-50 ${editingId === item.id ? "bg-amber-50/60" : ""}`}
                      >
                        <td className="py-3.5 pr-4 font-medium capitalize text-slate-900">{item.title}</td>
                        <td className="py-3.5 pr-4">
                          <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right font-semibold text-slate-900 tabular-nums">
                          {formatIDR(item.amount)}
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(item)}
                              aria-label={`Edit ${item.title}`}
                              className={`rounded-md px-2.5 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50 ${focusRing}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Hapus ${item.title}`}
                              className={`rounded-md px-2.5 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 ${focusRing}`}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
