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
}

export function saveTransaction(transaction: Omit<Transaction, "id" | "timestamp">) {
  const transactions = getTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }
  transactions.unshift(newTransaction)
  localStorage.setItem("userTransactions", JSON.stringify(transactions))
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
