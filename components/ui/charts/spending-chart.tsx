"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", amount: 400000 },
  { month: "Feb", amount: 800000 },
  { month: "Mar", amount: 300000 },
  { month: "Apr", amount: 1000000 },
  { month: "May", amount: 700000 },
]

export default function SpendingChart() {

  return (

    <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-800">

      <h2 className="text-2xl font-black mb-6 text-white">
        Spending Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#818cf8"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )

}