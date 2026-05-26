"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import SpendingChart from "@/components/ui/charts/spending-chart"

export default function HomePage() {

  const router = useRouter()

  const [amount, setAmount] = useState("")
  const [result, setResult] = useState("")
  const [score, setScore] = useState("0")

  const [transactions, setTransactions] = useState<any[]>([])
  const [userName, setUserName] = useState("")
  const [time, setTime] = useState("")

  // CHECK LOGIN
  useEffect(() => {

    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn || isLoggedIn !== "true") {

      setTimeout(() => {
        router.push("/login")
      }, 100)

    }

  }, [router])

  // LOAD USER
  useEffect(() => {

    const savedUser = localStorage.getItem("doomtracker-user")

    if (savedUser) {

      const parsedUser = JSON.parse(savedUser)

      setUserName(parsedUser.name)

    }

  }, [])

  // LIVE CLOCK
  useEffect(() => {

    const updateClock = () => {

      const now = new Date()

      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )

    }

    updateClock()

    const interval = setInterval(updateClock, 1000)

    return () => clearInterval(interval)

  }, [])

  // FETCH TRANSACTIONS FROM BACKEND
  const fetchTransactions = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/transactions"
      )

      const data = await response.json()

      setTransactions(data)

    } catch (error) {

      console.log(error)

    }

  }

  // LOAD TRANSACTIONS
  useEffect(() => {

    fetchTransactions()

  }, [])

  // TOTAL SPENDING
  const totalSpending = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  )

  // SAVINGS
  const savings = 5000000 - totalSpending

  // AUTO SCORE
  const autoScore = Math.min(
    100,
    Math.max(1, Math.floor(totalSpending / 10000))
  )

  // AI NOTIFICATION
  let notification = "🎉 Kondisi keuangan Anda terlihat sehat."

  if (autoScore > 70) {

    notification =
      "💀 Doom spending detected. Kurangi pengeluaran tidak penting."

  }

  else if (autoScore > 40) {

    notification =
      "⚠️ Pengeluaran Anda meningkat cukup cepat."

  }

  if (savings < 1000000) {

    notification =
      "🚨 Tabungan mulai menipis. Hati-hati dalam pengeluaran."

  }

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn")

    router.push("/login")

  }

  // AI PREDICTION
  const predictSpending = async () => {

    try {

      await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          income: 1000,
          expense: Number(amount),
          savings: 100,
          debt: Number(amount) * 0.5,
        }),
      })

      const prediction = Math.min(
        100,
        Math.max(1, Math.floor(Number(amount) / 10))
      )

      setScore(String(prediction))

      if (prediction < 30) {
        setResult("😎 Safe Spending")
      }

      else if (prediction < 70) {
        setResult("⚠️ Warning Spending")
      }

      else {
        setResult("💀 Doom Spending")
      }

    } catch (error) {

      console.log(error)

      setResult("Backend error")

    }

  }

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white overflow-hidden">

      {/* SIDEBAR */}
      <aside className="relative z-10 w-full md:w-72 bg-black/40 backdrop-blur-xl border-r border-slate-800 p-8">

        <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          DoomTracker
        </h1>

        <p className="text-slate-400 mt-3">
          AI Financial Monitor
        </p>

        <div className="mt-12 space-y-5">

          <Link
            href="/"
            className="block p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all font-semibold"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/transactions"
            className="block p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            💳 Transactions
          </Link>

          <Link
            href="/analytics"
            className="block p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            📈 Analytics
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left p-4 rounded-2xl bg-red-500 hover:bg-red-600 transition-all font-bold"
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="relative z-10 flex-1 p-5 md:p-10">

        <h1 className="text-4xl md:text-6xl font-black text-white">
          Selamat datang kembali, {userName} 🚀
        </h1>

        <p className="text-slate-400 mt-4 text-lg md:text-xl">
          Lacak pengeluaran emosional Anda dengan prediksi AI
        </p>

        {/* LIVE STATUS */}
        <div className="mt-8 flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">

          <div>

            <p className="text-slate-400">
              Live Financial Status
            </p>

            <h2 className="text-2xl font-black text-green-400">
              ● System Active
            </h2>

          </div>

          <div className="text-right">

            <p className="text-slate-400">
              Current Time
            </p>

            <h2 className="text-2xl font-black text-indigo-400">
              {time}
            </h2>

          </div>

        </div>

        {/* PROFILE */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-5 shadow-2xl">

          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-2xl font-black">

            {userName.charAt(0)}

          </div>

          <div>

            <h2 className="text-2xl font-black text-white">
              {userName}
            </h2>

            <p className="text-slate-400">
              Pengguna 🚀 Keuangan AI Premium
            </p>

          </div>

        </div>

        {/* AI NOTIFICATION */}
        <div className="mt-10 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-pink-500/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">

          <h2 className="text-2xl font-black text-white">
            🔥 Pemberitahuan AI
          </h2>

          <p className="text-slate-300 mt-4 text-lg">
            {notification}
          </p>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

          <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 p-8 rounded-3xl shadow-2xl">

            <p>Total Pengeluaran</p>

            <h2 className="text-5xl font-black mt-5">
              Rp {totalSpending.toLocaleString()}
            </h2>

          </div>

          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 p-8 rounded-3xl shadow-2xl">

            <p>Skor Doom</p>

            <h2 className="text-5xl font-black mt-5">
              {autoScore}
            </h2>

          </div>

          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 p-8 rounded-3xl shadow-2xl">

            <p>Penghematan</p>

            <h2 className="text-5xl font-black mt-5">
              Rp {savings.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* AI PREDICT */}
        <div className="bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl mt-12 border border-slate-800">

          <h2 className="text-3xl md:text-4xl font-black mb-8">
            🤖 Prediksi Pengeluaran AI
          </h2>

          <input
            type="number"
            placeholder="Jumlah pengeluaran input..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-5 rounded-2xl border border-slate-700 bg-slate-900 text-white"
          />

          <button
            onClick={predictSpending}
            className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl shadow-xl font-bold"
          >
            Predict With AI ✨
          </button>

          {result && (

            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700">

              <p className="text-3xl font-black">
                {result}
              </p>

              <h2 className="text-5xl font-black text-indigo-400 mt-5">
                {score}
              </h2>

            </div>

          )}

        </div>

        {/* CHART */}
        <div className="mt-12 bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800">

          <h2 className="text-3xl font-black mb-6">
            📈 Spending Analytics
          </h2>

          <SpendingChart />

        </div>

      </main>

    </div>

  )

}