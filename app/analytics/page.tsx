"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts"

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#8b5cf6"]

const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

interface Transaction {
  id: number
  title: string
  category: string
  amount: number
  created_at?: string
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch("/transactions")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("FETCH ERROR:", error)
      setError("Gagal memuat data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const categoryMap: Record<string, number> = {}
  transactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
  })
  const spendingData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  const monthlyMap: Record<string, number> = {}
  transactions.forEach((t) => {
    if (!t.created_at) return
    const date = new Date(t.created_at.replace(" ", "T"))
    if (isNaN(date.getTime())) return
    const month = date.toLocaleString("default", { month: "short" })
    monthlyMap[month] = (monthlyMap[month] || 0) + t.amount
  })
  const monthlyData = Object.entries(monthlyMap)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month))

  const totalExpense = transactions.reduce((acc, t) => acc + (t.amount ?? 0), 0)
  const topCategory = spendingData.length > 0
    ? spendingData.reduce((prev, cur) => prev.value > cur.value ? prev : cur)
    : null

  const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID").format(value)
  const tooltipFormatter = (value: number) => [`Rp ${formatRupiah(value)}`, "Amount"]

  const getRecommendation = (): string => {
    if (!topCategory) return "Belum ada data transaksi 📭"
    const map: Record<string, string> = {
      Entertainment: "Kurangi pengeluaran hiburan 💀",
      Gaming: "Pengeluaran gaming terlalu tinggi 🎮",
      Food: "Coba kurangi food delivery 🍔",
      Shopping: "Perhatikan pengeluaran belanja 🛍️",
      Transport: "Pertimbangkan transportasi umum 🚌",
    }
    return map[topCategory.name] ?? "Pengeluaran kamu terlihat sehat 🎉"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400 text-xl animate-pulse">Memuat data analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white p-6 md:p-10 overflow-hidden">
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-indigo-500 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-pink-500 opacity-20 blur-[120px] rounded-full" />

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white">Analytics Dashboard 📊</h1>
        <p className="text-slate-400 mt-4 text-lg md:text-xl">AI financial insights & spending analysis</p>
      </div>

      {error && (
        <div className="relative z-10 mt-6 p-4 bg-red-900/60 border border-red-700 text-red-200 rounded-2xl">
          ⚠️ {error}
          <button onClick={fetchTransactions} className="ml-4 underline text-red-300 hover:text-white">
            Coba lagi
          </button>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all">
          <p className="text-white/80 text-lg">Total Expense</p>
          <h2 className="text-4xl md:text-5xl font-black mt-4">Rp {formatRupiah(totalExpense)}</h2>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all">
          <p className="text-white/80 text-lg">Top Category</p>
          <h2 className="text-3xl md:text-4xl font-black mt-4">{topCategory ? topCategory.name : "—"}</h2>
          {topCategory && <p className="text-white/70 mt-1">Rp {formatRupiah(topCategory.value)}</p>}
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all">
          <p className="text-white/80 text-lg">AI Recommendation</p>
          <h2 className="text-2xl md:text-3xl font-black mt-4">{getRecommendation()}</h2>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800">
          <h2 className="text-3xl font-black mb-8 text-white">Spending Categories</h2>
          {spendingData.length === 0 ? (
            <p className="text-slate-400">Belum ada data transaksi.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={spendingData} dataKey="value" nameKey="name" outerRadius={120}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {spendingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800">
          <h2 className="text-3xl font-black mb-8 text-white">Monthly Spending</h2>
          {monthlyData.length === 0 ? (
            <p className="text-slate-400">Belum ada data bulanan.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={tooltipFormatter} />
                <Bar dataKey="amount" fill="#818cf8" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}