export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-10">

      {/* HEADER */}
      <div>

        <h1 className="text-6xl font-black text-slate-900">
          Transactions 💳
        </h1>

        <p className="text-slate-500 mt-4 text-xl">
          Monitor all your spending activity
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-8 rounded-3xl shadow-2xl text-white">

          <p className="text-white/80 text-lg">
            Monthly Expense
          </p>

          <h2 className="text-5xl font-black mt-4">
            Rp 3.200.000
          </h2>

        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 rounded-3xl shadow-2xl text-white">

          <p className="text-white/80 text-lg">
            Entertainment
          </p>

          <h2 className="text-5xl font-black mt-4">
            Rp 900.000
          </h2>

        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-3xl shadow-2xl text-white">

          <p className="text-white/80 text-lg">
            Savings
          </p>

          <h2 className="text-5xl font-black mt-4">
            Rp 1.500.000
          </h2>

        </div>

      </div>

      {/* TABLE */}
      <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">

        <h2 className="text-4xl font-black text-slate-900 mb-8">
          Transaction History
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all">

            <div>
              <h3 className="font-bold text-xl">
                Netflix Subscription
              </h3>

              <p className="text-slate-500">
                Entertainment
              </p>
            </div>

            <p className="text-red-500 font-black text-2xl">
              - Rp 150.000
            </p>

          </div>

          <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all">

            <div>
              <h3 className="font-bold text-xl">
                Spotify Premium
              </h3>

              <p className="text-slate-500">
                Music
              </p>
            </div>

            <p className="text-red-500 font-black text-2xl">
              - Rp 59.000
            </p>

          </div>

          <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all">

            <div>
              <h3 className="font-bold text-xl">
                Monthly Salary
              </h3>

              <p className="text-slate-500">
                Income
              </p>
            </div>

            <p className="text-green-500 font-black text-2xl">
              + Rp 5.000.000
            </p>

          </div>

          <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all">

            <div>
              <h3 className="font-bold text-xl">
                Steam Games
              </h3>

              <p className="text-slate-500">
                Gaming
              </p>
            </div>

            <p className="text-red-500 font-black text-2xl">
              - Rp 450.000
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}