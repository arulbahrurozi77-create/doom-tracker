// lib/dateFilter.ts
export type PeriodType = "today" | "week" | "month" | "all"

export interface TransactionItem {
  id: number
  title: string
  category: string
  amount: number
  created_at?: string
}

export function filterByPeriod(items: TransactionItem[], period: PeriodType): TransactionItem[] {
  if (period === "all") return items
  const now = new Date()

  return items.filter((item) => {
    if (!item.created_at) return true
    const txDate = new Date(item.created_at)
    if (isNaN(txDate.getTime())) return true

    if (period === "today") {
      return (
        txDate.getDate() === now.getDate() &&
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      )
    }

    const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24)
    if (period === "week") return diffDays <= 7
    if (period === "month") return diffDays <= 30
    return true
  })
}

export function getRemainingDaysInPeriod(period: PeriodType): number {
  const now = new Date()
  if (period === "today") return 1
  if (period === "week") {
    const dayOfWeek = now.getDay() // 0 = Minggu
    return dayOfWeek === 0 ? 1 : 8 - dayOfWeek
  }
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return Math.max(1, lastDay - now.getDate() + 1)
}
