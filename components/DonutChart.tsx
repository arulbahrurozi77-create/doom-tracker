"use client"

import { useState } from "react"

const COLORS = ["#0d9488", "#0284c7", "#4f46e5", "#d97706", "#e11d48", "#7c3aed"]

export default function DonutChart({ categories }: { categories: [string, number][] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const totalAll = categories.reduce((sum, [, val]) => sum + val, 0)

  const size = 200
  const stroke = 26
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  let cumulative = 0

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

  const active = hovered ? categories.find(([c]) => c === hovered) : null

  return (
    <div className="my-6 flex flex-col items-center justify-center gap-8 sm:flex-row">
      <div className="relative flex shrink-0 items-center justify-center">
        <svg width={size} height={size} className="-rotate-90 transform">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth={stroke} />
          {categories.map(([cat, val], idx) => {
            const pct = totalAll > 0 ? val / totalAll : 0
            const dash = `${pct * circumference} ${circumference}`
            const offset = -cumulative * circumference
            cumulative += pct
            return (
              <circle
                key={cat}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={hovered === cat ? stroke + 4 : stroke}
                strokeDasharray={dash}
                strokeDashoffset={offset}
                onMouseEnter={() => setHovered(cat)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-all duration-300"
              />
            )
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <span className="max-w-[110px] truncate text-[11px] font-medium capitalize text-slate-500">
            {active ? active[0] : "Total Keluar"}
          </span>
          <span className="mt-0.5 text-sm font-bold text-slate-900 tabular-nums">
            {formatIDR(active ? active[1] : totalAll)}
          </span>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        {categories.map(([cat, val], idx) => {
          const pct = totalAll > 0 ? Math.round((val / totalAll) * 100) : 0
          return (
            <div
              key={cat}
              onMouseEnter={() => setHovered(cat)}
              onMouseLeave={() => setHovered(null)}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition ${
                hovered === cat ? "border-teal-300 bg-teal-50/50" : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate text-xs font-medium capitalize text-slate-800">{cat}</span>
              </div>
              <span className="ml-2 text-xs font-semibold text-slate-900 tabular-nums">{formatIDR(val)} ({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
