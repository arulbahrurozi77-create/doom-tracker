"use client"

import { useEffect, useState } from "react"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const COLORS = [
  "#6366f1",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#8b5cf6",
]

export default function AnalyticsPage() {

  const [transactions, setTransactions] = useState<any[]>([])

  // FETCH TRANSACTIONS
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

  // LOAD DATA
  useEffect(() => {

    fetchTransactions()

  }, [])

  // CATEGORY DATA
  const categoryMap: any = {}

  transactions.forEach((transaction) => {

    if (!categoryMap[transaction.category]) {
      categoryMap[transaction.category] = 0
    }

    categoryMap[transaction.category] += transaction.amount

  })

  const spendingData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }))

  // MONTHLY DATA
  const monthlyMap: any = {}

  transactions.forEach((transaction) => {

  if (!transaction.created_at) return

  const month = new Date(
    transaction.created_at.replace(" ", "T")
  ).toLocaleString("default", {
    month: "short",
  })

  if (!monthlyMap[month]) {
    monthlyMap[month] = 0
  }

  monthlyMap[month] += transaction.amount

})

  const monthlyData = Object.keys(monthlyMap).map((key) => ({
    month: key,
    amount: monthlyMap[key],
  }))

  // TOTAL EXPENSE
  const totalExpense = transactions.reduce(
    (acc, item) => acc + item.amount,
    0
  )

  // TOP CATEGORY
  const topCategory =
    spendingData.length > 0
      ? spendingData.reduce((prev, current) =>
          prev.value > current.value ? prev : current
        )
      : { name: "No Data" }

  // AI RECOMMENDATION
  let recommendation = "Your spending looks healthy 🎉"

  if (topCategory.name === "Entertainment") {
    recommendation = "Reduce entertainment spending 💀"
  }

  else if (topCategory.name === "Gaming") {
    recommendation = "Gaming expense too high 🎮"
  }

  else if (topCategory.name === "Food") {
    recommendation = "Try reducing food delivery 🍔"
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white p-6 md:p-10 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-indigo-500 opacity-20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-pink-500 opacity-20 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="relative z-10">

        <h1 className="text-4xl md:text-6xl font-black text-white">
          Analytics Dashboard 📊
        </h1>

        <p className="text-slate-400 mt-4 text-lg md:text-xl">
          AI financial insights & spending analysis
        </p>

      </div>

      {/* STATS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        {/* TOTAL */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-8 rounded-3xl shadow-2xl text-white hover:scale-105 transition-all">

          <p className="text-white/80 text-lg">
            Total Expense
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-4">
            Rp {totalExpense.toLocaleString()}
          </h2>

        </div>

        {/* TOP CATEGORY */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 rounded-3xl shadow-2xl text-white hover:scale-105 transition-all">

          <p className="text-white/80 text-lg">
            Top Category
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-4">
            {topCategory.name}
          </h2>

        </div>

        {/* AI RECOMMENDATION */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-3xl shadow-2xl text-white hover:scale-105 transition-all">

          <p className="text-white/80 text-lg">
            AI Recommendation
          </p>

          <h2 className="text-2xl md:text-3xl font-black mt-4">
            {recommendation}
          </h2>

        </div>

      </div>

      {/* CHARTS */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">

        {/* PIE CHART */}
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800">

          <h2 className="text-3xl font-black mb-8 text-white">
            Spending Categories
          </h2>

          {spendingData.length === 0 ? (

            <p className="text-slate-400">
              No transaction data yet.
            </p>

          ) : (

            <ResponsiveContainer width="100%" height={350}>

              <PieChart>

                <Pie
                  data={spendingData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {spendingData.map((entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          )}

        </div>

        {/* BAR CHART */}
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800">

          <h2 className="text-3xl font-black mb-8 text-white">
            Monthly Spending
          </h2>

          {monthlyData.length === 0 ? (

            <p className="text-slate-400">
              No monthly data yet.
            </p>

          ) : (

            <ResponsiveContainer width="100%" height={350}>

              <BarChart data={monthlyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Bar
                  dataKey="amount"
                  fill="#818cf8"
                  radius={[12, 12, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>

    </div>

  )

}