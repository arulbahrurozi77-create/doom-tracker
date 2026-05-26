"use client"

import { useEffect, useState } from "react"

export default function TransactionsPage() {

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")

  const [transactions, setTransactions] = useState<any[]>([])

  // GET TRANSACTIONS
  const fetchTransactions = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/transactions"
      )

      const data = await response.json()

      console.log("FETCH:", data)

      setTransactions(data)

    } catch (error) {

      console.log("FETCH ERROR:", error)

    }

  }

  // LOAD
  useEffect(() => {

    fetchTransactions()

  }, [])

  // ADD
  const addTransaction = async () => {

    if (!title || !category || !amount) {
      alert("Isi semua field")
      return
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            category,
            amount: Number(amount),
          }),
        }
      )

      const data = await response.json()

      console.log("POST:", data)

      // RELOAD DATA
      await fetchTransactions()

      // RESET
      setTitle("")
      setCategory("")
      setAmount("")

      alert("Transaction added 🚀")

    } catch (error) {

      console.log("POST ERROR:", error)

    }

  }

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-black mb-10">
        Transactions
      </h1>

      {/* FORM */}
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
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        />

        <button
          onClick={addTransaction}
          className="bg-indigo-500 px-8 py-4 rounded-xl"
        >
          Add Transaction
        </button>

      </div>

      {/* LIST */}
      <div className="mt-10 space-y-5">

        {transactions.map((transaction) => (

          <div
            key={transaction.id}
            className="bg-slate-900 p-5 rounded-xl"
          >

            <h2 className="text-2xl font-bold">
              {transaction.title}
            </h2>

            <p>
              {transaction.category}
            </p>

            <p className="text-red-400">
              Rp {transaction.amount}
            </p>

          </div>

        ))}

      </div>

    </div>

  )

}