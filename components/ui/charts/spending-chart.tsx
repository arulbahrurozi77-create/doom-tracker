"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { month: "Jan", amount: 400 },
  { month: "Feb", amount: 800 },
  { month: "Mar", amount: 300 },
  { month: "Apr", amount: 1000 },
  { month: "May", amount: 700 },
]

export default function SpendingChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">

      <h2 className="text-xl font-bold mb-6">
        Spending Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#000"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}
