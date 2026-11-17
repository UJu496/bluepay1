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
  status?: string
  reference?: string
  trackingId?: string
  createdAt?: string
  fee?: number | string
  recipientName?: string
  senderName?: string
  senderAccountNumber?: string
  senderBankName?: string
  paymentMethod?: string
  narration?: string
  channel?: string
  processingAt?: string
  completedAt?: string
  totalAmountDebited?: number | string
  plan?: string
  validity?: string
  receiptName?: string
  receiptSubmittedAt?: string
  email?: string
  userId?: string
  paymentAttemptId?: string
  name?: string
}

const TRANSACTION_UPDATED_EVENT = "bluepay:transactions-updated"

function readArray(key: string): Record<string, unknown>[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]")
    return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : []
  } catch {
    return []
  }
}

function normalizeStoredTransaction(value: Record<string, unknown>): Transaction | null {
  if (value.id === undefined || value.id === null || value.id === "") return null
  if (value.type !== "income" && value.type !== "expense") return null

  const rawAmount = value.amount
  const amountText = typeof rawAmount === "string" ? rawAmount.replace(/[^\d.-]/g, "") : String(rawAmount ?? "")
  if (!amountText.trim()) return null
  const amount = Number(amountText)
  if (!Number.isFinite(amount)) return null

  return {
    ...value,
    id: String(value.id),
    type: value.type,
    amount,
    category: typeof value.category === "string" && value.category ? value.category : "Uncategorized",
    description: typeof value.description === "string" ? value.description : "",
    date: typeof value.date === "string" ? value.date : "",
    timestamp: typeof value.timestamp === "string" ? value.timestamp : typeof value.createdAt === "string" ? value.createdAt : "",
    status: typeof value.status === "string" ? value.status : undefined,
  }
}

function getBpcPurchaseAttempts(): Transaction[] {
  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "null") as { id?: string; email?: string } | null
    } catch {
      return null
    }
  })()
  const attempts = new Map<string, Record<string, unknown>>()

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (!key?.startsWith("bluepayPaymentAttempt:")) continue
    const value = localStorage.getItem(key)
    if (!value) continue
    try {
      const attempt = JSON.parse(value) as Record<string, unknown>
      if (typeof attempt.id === "string") attempts.set(attempt.id, attempt)
    } catch {
      continue
    }
  }

  const latestAttempt = (() => {
    try {
      return JSON.parse(localStorage.getItem("paymentAttempt") || "null") as Record<string, unknown> | null
    } catch {
      return null
    }
  })()
  if (latestAttempt && typeof latestAttempt.id === "string" && !attempts.has(latestAttempt.id)) {
    attempts.set(latestAttempt.id, latestAttempt)
  }

  return Array.from(attempts.values()).flatMap((attempt) => {
    const attemptUserId = typeof attempt.userId === "string" ? attempt.userId : undefined
    if (attemptUserId && (!profile || (attemptUserId !== profile.id && attemptUserId !== profile.email))) return []

    const rawAmount = attempt.amount
    const amountText = typeof rawAmount === "string" ? rawAmount.replace(/[^\d.-]/g, "") : String(rawAmount ?? "")
    const amount = Number(amountText)
    if (!Number.isFinite(amount) || amount <= 0 || typeof attempt.id !== "string") return []

    const createdAt = typeof attempt.createdAt === "string" ? attempt.createdAt : undefined
    return [{
      ...attempt,
      id: attempt.id,
      type: "expense" as const,
      category: "BPC Code",
      description: "BPC code purchase",
      amount,
      date: createdAt?.slice(0, 10) || "",
      timestamp: createdAt || "",
      createdAt,
      status: typeof attempt.status === "string" ? attempt.status : undefined,
      reference: typeof attempt.reference === "string" ? attempt.reference : undefined,
      senderName: typeof attempt.name === "string" ? attempt.name : undefined,
      email: typeof attempt.email === "string" ? attempt.email : undefined,
      receiptName: typeof attempt.receiptName === "string" ? attempt.receiptName : undefined,
      paymentAttemptId: attempt.id,
    }]
  })
}

export function formatTransactionCurrency(value: number) {
  const formatted = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0)
  return `NGN ${formatted}`
}

export function getTransactionTotalAmount(transaction: Transaction) {
  const explicitTotal = parseMoneyValue(transaction.totalAmountDebited)
  if (explicitTotal !== null) return explicitTotal
  const fee = parseMoneyValue(transaction.fee)
  return transaction.type === "expense" && fee !== null ? transaction.amount + fee : transaction.amount
}

function parseMoneyValue(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null
  const normalized = typeof value === "string" ? value.replace(/[^\d.-]/g, "") : value
  if (normalized === "") return null
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : null
}

function transactionTime(transaction: Transaction) {
  const value = transaction.timestamp || transaction.createdAt || transaction.date
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

export function saveTransaction(transaction: Omit<Transaction, "id" | "timestamp" | "createdAt" | "reference" | "trackingId"> & Partial<Pick<Transaction, "createdAt" | "reference" | "trackingId">>) {
  if (typeof window === "undefined") throw new Error("Transactions can only be saved in the browser")

  const storedTransactions = readArray("userTransactions")
  const createdAt = transaction.createdAt || new Date().toISOString()
  const id = crypto.randomUUID()
  const needsWithdrawalReference = transaction.category?.toLowerCase() === "withdrawal"
  const newTransaction: Transaction = {
    ...transaction,
    id,
    timestamp: createdAt,
    createdAt,
    reference: transaction.reference || (needsWithdrawalReference ? `BPM-WD-${createdAt.slice(0, 10).replaceAll("-", "")}-${id.slice(0, 8).toUpperCase()}` : undefined),
    trackingId: transaction.trackingId || (needsWithdrawalReference ? `BPM-TRACK-${id.replaceAll("-", "").slice(0, 12).toUpperCase()}` : undefined),
  }

  localStorage.setItem("userTransactions", JSON.stringify([newTransaction, ...storedTransactions]))
  if (newTransaction.status !== "pending" && newTransaction.status !== "pending_verification" && newTransaction.status !== "failed" && newTransaction.status !== "reversed") {
    let unread: string[] = []
    try {
      const savedUnread = JSON.parse(localStorage.getItem("bluepayUnreadTransactions") || "[]")
      if (Array.isArray(savedUnread)) unread = savedUnread.filter((item): item is string => typeof item === "string")
    } catch {
      unread = []
    }
    localStorage.setItem("bluepayUnreadTransactions", JSON.stringify([...new Set([newTransaction.id, ...unread])]))
  }
  window.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT))
  return newTransaction
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []

  const merged = new Map<string, Transaction>()
  for (const stored of readArray("userTransactions")) {
    const transaction = normalizeStoredTransaction(stored)
    if (transaction) merged.set(transaction.id, transaction)
  }
  for (const stored of readArray("allTransactions")) {
    const transaction = normalizeStoredTransaction(stored)
    if (transaction && !merged.has(transaction.id)) merged.set(transaction.id, transaction)
  }
  for (const transaction of getBpcPurchaseAttempts()) {
    if (!merged.has(transaction.id)) merged.set(transaction.id, transaction)
  }

  return Array.from(merged.values()).sort((a, b) => transactionTime(b) - transactionTime(a))
}

export function getTransactionById(id: string): Transaction | undefined {
  return getTransactions().find((transaction) => transaction.id === id)
}

export function getRecentTransactions(limit = 5): Transaction[] {
  return getTransactions().slice(0, limit)
}

export type TransactionStatusKey = "successful" | "pending" | "failed" | "reversed" | "completed" | "unrecorded" | "other"

export function getTransactionStatusPresentation(status?: string) {
  const normalized = status?.trim().toLowerCase()
  if (!normalized) return { key: "unrecorded" as const, label: "Status not recorded" }
  if (normalized === "successful" || normalized === "success") return { key: "successful" as const, label: "Successful" }
  if (["pending", "pending_verification", "initiated", "awaiting_review", "processing"].includes(normalized)) {
    return { key: "pending" as const, label: normalized.includes("verification") || normalized.includes("review") ? "Awaiting review" : "Pending" }
  }
  if (normalized === "failed") return { key: "failed" as const, label: "Failed" }
  if (normalized === "reversed") return { key: "reversed" as const, label: "Reversed" }
  if (normalized === "completed") return { key: "completed" as const, label: "Completed" }
  if (normalized === "paid") return { key: "completed" as const, label: "Paid" }
  return { key: "other" as const, label: normalized.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) }
}

export function getTransactionTypeLabel(transaction: Transaction) {
  const category = (transaction.category || "").toLowerCase()
  const description = (transaction.description || "").toLowerCase()
  const searchable = `${category} ${description}`

  if (searchable.includes("bpc")) return "BPC code purchase"
  if (/withdraw|transfer|bank/.test(searchable)) return "Bank transfer"
  if (/airtime|top.?up/.test(searchable)) return "Airtime purchase"
  if (/\bdata\b|internet bundle/.test(searchable)) return "Data purchase"
  if (/bill|electric|utility|water|tv subscription/.test(searchable)) return "Bill payment"
  if (/earn|reward|cashback/.test(searchable)) return "Earn reward"
  if (/wallet funding|fund wallet|deposit/.test(searchable)) return "Wallet funding"
  if (/saving|goal|contribution/.test(searchable)) return "Savings contribution"
  if (category) return category.replace(/\b\w/g, (letter) => letter.toUpperCase())
  return transaction.type === "income" ? "Income" : "Expense"
}

export function getSpendingByCategory() {
  const transactions = getTransactions()
  const categoryTotals: Record<string, number> = {}

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const category = transaction.category || "Uncategorized"
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount
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
