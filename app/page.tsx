"use client"

import { useState } from "react"
import Link from "next/link"
import SpendingChart from "@/components/ui/charts/spending-chart"

export default function HomePage() {

  const [amount, setAmount] = useState("")
  const [result, setResult] = useState("")
  const [score, setScore] = useState("0")

  const predictSpending = async () => {

    try {

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          income: 1000,
          expense: Number(amount),
          savings: 100,
          debt: Number(amount) * 0.5,
        })
      })

      await response.json()

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
    <div className="flex flex-col md:flex-row min-h-screen ...">

      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-slate-950 to-slate-900 text-white p-8 shadow-2xl">

        <h1 className="text-5xl font-black text-indigo-400">
          DoomTracker
        </h1>

        <p className="text-slate-400 mt-3">
          AI Financial Monitor
        </p>

        {/* NAVIGATION */}
        <div className="mt-12 space-y-5">

          <Link
            href="/"
            className="block w-full text-left p-4 rounded-2xl bg-indigo-500 hover:scale-105 transition-all font-semibold shadow-lg"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/transactions"
            className="block w-full text-left p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all"
          >
            💳 Transactions
          </Link>

          <Link
            href="/analytics"
            className="block w-full text-left p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all"
          >
            📈 Analytics
          </Link>

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <div>

          <h1 className="text-6xl font-black text-slate-900">
            Financial AI Dashboard 🚀
          </h1>

          <p className="text-slate-500 mt-4 text-xl">
            Track your emotional spending with AI prediction
          </p>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

          {/* TOTAL */}
          <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 p-8 rounded-[30px] shadow-2xl text-white hover:scale-105 transition-all duration-300">

            <p className="text-white/80 text-lg">
              Total Spending
            </p>

            <h2 className="text-5xl font-black mt-5">
              Rp 2.500.000
            </h2>

          </div>

          {/* SCORE */}
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 p-8 rounded-[30px] shadow-2xl text-white hover:scale-105 transition-all duration-300">

            <p className="text-white/80 text-lg">
              Doom Score
            </p>

            <h2 className="text-5xl font-black mt-5">
              {score}
            </h2>

          </div>

          {/* SAVINGS */}
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 p-8 rounded-[30px] shadow-2xl text-white hover:scale-105 transition-all duration-300">

            <p className="text-white/80 text-lg">
              Savings
            </p>

            <h2 className="text-5xl font-black mt-5">
              Rp 1.200.000
            </h2>

          </div>

        </div>

        {/* AI PREDICTION */}
        <div className="bg-white p-10 rounded-[30px] shadow-2xl mt-12 border border-slate-200">

          <h2 className="text-4xl font-black mb-8 text-slate-900">
            🤖 AI Spending Prediction
          </h2>

          <input
            type="number"
            placeholder="Input spending amount..."
            className="w-full p-5 rounded-2xl border border-slate-300 bg-slate-50 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={predictSpending}
            className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl shadow-xl font-bold text-lg hover:scale-105 transition-all duration-300"
          >
            Predict With AI ✨
          </button>

          {result && (
            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200">

              <p className="text-3xl font-black text-slate-900">
                {result}
              </p>

              <div className="mt-5">

                <p className="text-slate-500 text-lg">
                  AI Score
                </p>

                <h2 className="text-5xl font-black text-indigo-600 mt-2">
                  {score}
                </h2>

              </div>

            </div>
          )}

        </div>

        {/* CHART */}
        <div className="mt-12 bg-white p-8 rounded-[30px] shadow-2xl">

          <h2 className="text-3xl font-black mb-6 text-slate-900">
            📈 Spending Analytics
          </h2>

          <SpendingChart />

        </div>

      </main>

    </div>
  )
}