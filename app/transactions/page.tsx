"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

interface Transaction {
  id: number
  title: string
  category: string
  amount: number
}

export default function TransactionsPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setError(null)
      const response = await apiFetch("/transactions")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("FETCH ERROR:", error)
      setError("Gagal memuat transaksi.")
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const resetForm = () => {
    setTitle("")
    setCategory("")
    setAmount("")
    setEditingId(null)
  }

  const addTransaction = async () => {
    if (!title.trim() || !category.trim() || !amount) {
      alert("Isi semua field")
      return
    }
    const parsedAmount = Number(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Amount harus berupa angka positif")
      return
    }
    try {
      setLoading(true)
      const response = await apiFetch("/transactions", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          amount: parsedAmount,
        }),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      await fetchTransactions()
      resetForm()
      alert("Transaction added 🚀")
    } catch (error) {
      console.error("POST ERROR:", error)
      alert("Gagal menambah transaksi")
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async () => {
    if (!editingId) return
    if (!title.trim() || !category.trim() || !amount) {
      alert("Isi semua field")
      return
    }
    const parsedAmount = Number(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Amount harus berupa angka positif")
      return
    }
    try {
      setLoading(true)
      const response = await apiFetch(`/transactions/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          amount: parsedAmount,
        }),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      await fetchTransactions()
      resetForm()
      alert("Transaction updated 🚀")
    } catch (error) {
      console.error("UPDATE ERROR:", error)
      alert("Gagal mengupdate transaksi")
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (id: number) => {
    if (!confirm("Yakin mau hapus transaksi ini?")) return
    try {
      const response = await apiFetch(`/transactions/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      await fetchTransactions()
    } catch (error) {
      console.error("DELETE ERROR:", error)
      alert("Gagal menghapus transaksi")
    }
  }

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value)

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-black mb-10">Transactions</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900 text-red-200 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-5 max-w-xl">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          min={1}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        />
        <div className="flex gap-3">
          <button
            onClick={editingId ? updateTransaction : addTransaction}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-8 py-4 rounded-xl"
          >
            {loading ? "Loading..." : editingId ? "Update Transaction" : "Add Transaction"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="bg-slate-600 hover:bg-slate-700 px-8 py-4 rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-5">
        {transactions.length === 0 && !error && (
          <p className="text-slate-500">Belum ada transaksi.</p>
        )}
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-slate-900 p-5 rounded-xl">
            <h2 className="text-2xl font-bold">{transaction.title}</h2>
            <p className="text-slate-400">{transaction.category}</p>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-red-400">Rp {formatRupiah(transaction.amount)}</p>
              <button
                onClick={() => {
                  setEditingId(transaction.id)
                  setTitle(transaction.title)
                  setCategory(transaction.category)
                  setAmount(String(transaction.amount))
                }}
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-white"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}