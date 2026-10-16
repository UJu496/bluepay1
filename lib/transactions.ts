export interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  timestamp: string
  accountNumber?: string
  bankName?: string
  phoneNumber?: string
  network?: string
  userName?: string
  bpcCode?: string
  status?: "successful" | "pending" | "failed" | "reversed"
  reference?: string
  trackingId?: string
  createdAt?: string
  fee?: number
}

export function saveTransaction(transaction: Omit<Transaction, "id" | "timestamp">) {
  const transactions = getTransactions()
  const createdAt = new Date().toISOString()
  const id = crypto.randomUUID()
  const newTransaction: Transaction = {
    ...transaction,
    id,
    timestamp: createdAt,
    createdAt,
    reference: transaction.reference || `BPM-WD-${createdAt.slice(0, 10).replaceAll("-", "")}-${id.slice(0, 8).toUpperCase()}`,
    trackingId: transaction.trackingId || `BPM-TRACK-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}`,
  }
  transactions.unshift(newTransaction)
  localStorage.setItem("userTransactions", JSON.stringify(transactions))
  if (newTransaction.status !== "pending" && newTransaction.status !== "failed" && newTransaction.status !== "reversed") {
    const unread = JSON.parse(localStorage.getItem("bluepayUnreadTransactions") || "[]") as string[]
    localStorage.setItem("bluepayUnreadTransactions", JSON.stringify([...new Set([newTransaction.id, ...unread])]))
  }
  return newTransaction
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("userTransactions")
  if (stored) return JSON.parse(stored)
  
  // Return empty array until user performs a transaction
  return []
}

export function getRecentTransactions(limit = 5): Transaction[] {
  return getTransactions().slice(0, limit)
}

export function getUnreadTransactionNotificationCount(): number {
  if (typeof window === "undefined") return 0
  const readAt = Number(localStorage.getItem("transactionNotificationsReadAt") || 0)
  return getTransactions().filter((transaction) => transaction.type === "income" && new Date(transaction.timestamp).getTime() > readAt).length
}

export function markTransactionNotificationsRead() {
  if (typeof window === "undefined") return
  localStorage.setItem("transactionNotificationsReadAt", Date.now().toString())
}

export function getSpendingByCategory() {
  const transactions = getTransactions()
  const categoryTotals: Record<string, number> = {}

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"]

  return Object.entries(categoryTotals)
    .map(([category, amount], index) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.amount - a.amount)
}
