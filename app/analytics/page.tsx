"use client"

import SpendingChart from "@/components/ui/charts/spending-chart"

export default function AnalyticsPage() {

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      {/* HEADER */}
      <div>

        <h1 className="text-6xl font-black text-slate-900">
          Analytics 📈
        </h1>

        <p className="text-slate-500 mt-4 text-xl">
          AI spending behavior analysis
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-8 rounded-3xl shadow-2xl text-white">

          <p className="text-white/80 text-lg">
            Highest Expense
          </p>

          <h2 className="text-5xl font-black mt-5">
            Rp 900K
          </h2>

        </div>

        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-8 rounded-3xl shadow-2xl text-white">

          <p className="text-white/80 text-lg">
            AI Risk Level
          </p>

          <h2 className="text-5xl font-black mt-5">
            Medium
          </h2>

        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-3xl shadow-2xl text-white">

          <p className="text-white/80 text-lg">
            Monthly Saving
          </p>

          <h2 className="text-5xl font-black mt-5">
            Rp 1.5M
          </h2>

        </div>

      </div>

      {/* CHART */}
      <div className="mt-12 bg-white p-8 rounded-3xl shadow-2xl">

        <h2 className="text-4xl font-black text-slate-900 mb-8">
          Spending Trend Analysis
        </h2>

        <SpendingChart />

      </div>

      {/* AI ANALYSIS */}
      <div className="mt-12 bg-white p-8 rounded-3xl shadow-2xl">

        <h2 className="text-4xl font-black text-slate-900 mb-8">
          🤖 AI Recommendation
        </h2>

        <div className="space-y-6">

          <div className="p-6 rounded-2xl bg-red-100 border border-red-200">

            <h3 className="text-2xl font-bold text-red-600">
              Entertainment Spending High
            </h3>

            <p className="text-slate-600 mt-2">
              Your entertainment spending increased by 35% this month.
            </p>

          </div>

          <div className="p-6 rounded-2xl bg-yellow-100 border border-yellow-200">

            <h3 className="text-2xl font-bold text-yellow-600">
              Saving Opportunity
            </h3>

            <p className="text-slate-600 mt-2">
              You can save around Rp 500K by reducing gaming purchases.
            </p>

          </div>

          <div className="p-6 rounded-2xl bg-green-100 border border-green-200">

            <h3 className="text-2xl font-bold text-green-600">
              Financial Status Stable
            </h3>

            <p className="text-slate-600 mt-2">
              Your monthly income is still higher than your expenses.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}