"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Filter,
  Gift,
  Landmark,
  Plus,
  Phone,
  Receipt,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
  Wifi,
  X,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  formatTransactionCurrency,
  getTransactionStatusPresentation,
  getTransactionTotalAmount,
  getTransactionTypeLabel,
  getTransactions,
  saveTransaction,
  type Transaction,
  type TransactionStatusKey,
} from "@/lib/transactions"

type TransactionFilters = {
  query: string
  type: "all" | "income" | "expense"
  status: "all" | TransactionStatusKey
  from: string
  to: string
}

type TransactionType = "income" | "expense"

const defaultFilters: TransactionFilters = { query: "", type: "all", status: "all", from: "", to: "" }
const transactionCategories: Record<TransactionType, string[]> = {
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Earn Money", "Other"],
  expense: ["Airtime", "Data", "Bills", "Shopping", "Food", "Transport", "Entertainment", "Withdrawal", "Savings", "Other"],
}

function transactionDateKey(transaction: Transaction) {
  const value = transaction.date || transaction.timestamp || transaction.createdAt
  if (!value) return ""
  const match = value.match(/^\d{4}-\d{2}-\d{2}/)
  if (match) return match[0]
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10)
}

function formatTransactionDate(transaction: Transaction) {
  const value = transaction.timestamp || transaction.createdAt || transaction.date
  if (!value) return "Date unavailable"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Date unavailable"
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(date)
}

function formatTransactionTime(transaction: Transaction) {
  const value = transaction.timestamp || transaction.createdAt
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-NG", { hour: "2-digit", minute: "2-digit" }).format(date)
}

function getTransactionIcon(transaction: Transaction): LucideIcon {
  const type = getTransactionTypeLabel(transaction).toLowerCase()
  if (type.includes("airtime")) return Phone
  if (type.includes("data")) return Wifi
  if (type.includes("transfer")) return Landmark
  if (type.includes("bpc")) return Zap
  if (type.includes("bill")) return Receipt
  if (type.includes("earn")) return Gift
  if (type.includes("wallet")) return Wallet
  if (type.includes("saving")) return TrendingDown
  return transaction.type === "income" ? ArrowDownRight : ArrowUpRight
}

function statusStyles(key: TransactionStatusKey) {
  switch (key) {
    case "successful":
    case "completed":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" }
    case "pending":
      return { badge: "bg-amber-50 text-amber-800", dot: "bg-amber-500" }
    case "failed":
    case "reversed":
      return { badge: "bg-rose-50 text-rose-700", dot: "bg-rose-500" }
    default:
      return { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" }
  }
}

function buildTransactionUrl(filters: TransactionFilters) {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query)
  if (filters.type !== "all") params.set("type", filters.type)
  if (filters.status !== "all") params.set("status", filters.status)
  if (filters.from) params.set("from", filters.from)
  if (filters.to) params.set("to", filters.to)
  const query = params.toString()
  return query ? `/transactions?${query}` : "/transactions"
}

export function RecentTransactions({ initialFilters }: { initialFilters: Partial<TransactionFilters> }) {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<TransactionFilters>({ ...defaultFilters, ...initialFilters })
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formError, setFormError] = useState("")
  const [newTransaction, setNewTransaction] = useState({
    type: "expense" as TransactionType,
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    const refreshTransactions = () => setTransactions(getTransactions())
    refreshTransactions()
    window.addEventListener("storage", refreshTransactions)
    window.addEventListener("bluepay:transactions-updated", refreshTransactions)

    if (sessionStorage.getItem("bluepay:restore-transaction-list") === "1") {
      sessionStorage.removeItem("bluepay:restore-transaction-list")
      const savedPosition = Number(sessionStorage.getItem("bluepay:transaction-list-scroll") || "0")
      requestAnimationFrame(() => window.scrollTo({ top: savedPosition, behavior: "auto" }))
    }

    return () => {
      window.removeEventListener("storage", refreshTransactions)
      window.removeEventListener("bluepay:transactions-updated", refreshTransactions)
    }
  }, [])

  useEffect(() => {
    if (!showAddModal) return
    const dialog = document.getElementById("add-transaction-dialog")
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])") || [])
    focusable[0]?.focus()

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAddModal(false)
        return
      }
      if (event.key !== "Tab" || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown)
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown)
      previousFocus?.focus()
    }
  }, [showAddModal])

  const updateFilters = (patch: Partial<TransactionFilters>) => {
    const nextFilters = { ...filters, ...patch }
    setFilters(nextFilters)
    router.replace(buildTransactionUrl(nextFilters), { scroll: false })
  }

  const filteredTransactions = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return transactions.filter((transaction) => {
      if (filters.type !== "all" && transaction.type !== filters.type) return false
      const status = getTransactionStatusPresentation(transaction.status)
      if (filters.status !== "all" && status.key !== filters.status) return false
      const dateKey = transactionDateKey(transaction)
      if (filters.from && (!dateKey || dateKey < filters.from)) return false
      if (filters.to && (!dateKey || dateKey > filters.to)) return false
      if (query) {
        const searchable = [
          transaction.description,
          transaction.category,
          transaction.userName,
          transaction.recipientName,
          transaction.senderName,
          transaction.phoneNumber,
          transaction.accountNumber,
          transaction.bankName,
          transaction.reference,
          transaction.trackingId,
        ].filter((value): value is string => typeof value === "string").join(" ").toLowerCase()
        if (!searchable.includes(query)) return false
      }
      return true
    })
  }, [filters, transactions])

  const totals = useMemo(() => {
    const recordedTransactions = filteredTransactions.filter((transaction) => {
      const status = getTransactionStatusPresentation(transaction.status).key
      return status === "successful" || status === "completed" || status === "unrecorded"
    })
    const income = recordedTransactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0)
    const expenses = recordedTransactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + getTransactionTotalAmount(transaction), 0)
    return { income, expenses, net: income - expenses }
  }, [filteredTransactions])

  const exportTransactions = () => {
    const csvCell = (value: unknown) => {
      const text = String(value ?? "")
      const safe = /^[=+@\-]/.test(text) ? `'${text}` : text
      return `"${safe.replaceAll('"', '""')}"`
    }
    const rows = [
      ["Transaction ID", "Date", "Time", "Type", "Category", "Description", "Amount", "Status", "Recipient or sender", "Reference"],
      ...filteredTransactions.map((transaction) => [
        transaction.id,
        transaction.date || "",
        formatTransactionTime(transaction),
        transaction.type,
        transaction.category || "",
        transaction.description || "",
        transaction.amount,
        getTransactionStatusPresentation(transaction.status).label,
        transaction.recipientName || transaction.senderName || (getTransactionTypeLabel(transaction) === "Bank transfer" ? transaction.userName : undefined) || transaction.phoneNumber || "",
        transaction.reference || "",
      ]),
    ]
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `bluepay-transactions-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const addTransaction = () => {
    const amount = Number(newTransaction.amount)
    if (!newTransaction.description.trim() || !newTransaction.category || !Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter a description, category, and amount greater than zero.")
      return
    }

    saveTransaction({
      type: newTransaction.type,
      description: newTransaction.description.trim(),
      amount,
      date: newTransaction.date,
      category: newTransaction.category,
      userName: "Manual Entry",
    })

    const currentBalance = Number(localStorage.getItem("userBalance") || "200000")
    const nextBalance = newTransaction.type === "income" ? currentBalance + amount : currentBalance - amount
    localStorage.setItem("userBalance", String(nextBalance))
    setTransactions(getTransactions())
    setNewTransaction({ type: "expense", description: "", amount: "", category: "", date: new Date().toISOString().slice(0, 10) })
    setFormError("")
    setShowAddModal(false)
  }

  const clearFilters = () => updateFilters({ ...defaultFilters })

  return (
    <main className="min-h-screen bg-[#f4f7fc] pb-8 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 px-4 pb-3 pt-7 shadow-[0_3px_14px_rgba(15,23,42,0.04)] backdrop-blur">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => router.push("/dashboard")} aria-label="Back to dashboard" className="grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100">
              <ArrowLeft size={19} />
            </button>
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0000ff]">BLUEPAY MOBILE</p>
              <h1 className="text-base font-bold tracking-tight">Recent transactions</h1>
            </div>
            <button type="button" onClick={() => { setFormError(""); setShowAddModal(true) }} aria-label="Add transaction" className="grid size-9 place-items-center rounded-full bg-[#0000ff] text-white shadow-sm transition hover:bg-blue-800">
              <Plus size={19} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2" aria-label="Transaction totals for the current filters">
            <SummaryCard label="Income" amount={totals.income} tone="income" icon={TrendingUp} />
            <SummaryCard label="Expenses" amount={totals.expenses} tone="expense" icon={TrendingDown} />
            <SummaryCard label="Net balance" amount={totals.net} tone="net" icon={Wallet} />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-lg px-4 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          <Search aria-hidden="true" className="shrink-0 text-slate-400" size={17} />
          <label className="sr-only" htmlFor="transaction-search">Search transactions</label>
          <input id="transaction-search" type="search" value={filters.query} onChange={(event) => updateFilters({ query: event.target.value })} placeholder="Search name, bank, reference..." className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
          <button type="button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters} aria-controls="transaction-filters" aria-label="Toggle transaction filters" className={`grid size-8 shrink-0 place-items-center rounded-lg transition ${showFilters ? "bg-blue-50 text-[#0000ff]" : "text-slate-500 hover:bg-slate-100"}`}>
            <Filter size={17} />
          </button>
          <button type="button" onClick={exportTransactions} aria-label="Download filtered transactions as CSV" className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#0000ff]">
            <Download size={17} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1 rounded-xl bg-slate-200/70 p-1" role="group" aria-label="Filter by transaction type">
          {(["all", "income", "expense"] as const).map((type) => (
            <button key={type} type="button" aria-pressed={filters.type === type} onClick={() => updateFilters({ type })} className={`min-h-9 flex-1 rounded-lg px-2 text-xs font-semibold capitalize transition ${filters.type === type ? "bg-white text-[#0000ff] shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>
              {type === "all" ? "All transactions" : type === "expense" ? "Expenses" : "Income"}
            </button>
          ))}
        </div>

        {showFilters && (
          <div id="transaction-filters" className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Filter size={15} className="text-[#0000ff]" /> More filters</div>
              <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#0000ff]">Reset all</button>
            </div>
            <label className="mb-1 block text-[11px] font-medium text-slate-500" htmlFor="transaction-status">Status</label>
            <div className="relative">
              <select id="transaction-status" value={filters.status} onChange={(event) => updateFilters({ status: event.target.value as TransactionFilters["status"] })} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="all">All statuses</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending / awaiting review</option>
                <option value="completed">Completed / paid</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
                <option value="unrecorded">Status not recorded</option>
                <option value="other">Other recorded status</option>
              </select>
              <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <DateFilter id="transaction-from" label="From" value={filters.from} onChange={(value) => updateFilters({ from: value })} />
              <DateFilter id="transaction-to" label="To" value={filters.to} onChange={(value) => updateFilters({ to: value })} />
            </div>
          </div>
        )}

        <div className="mb-2 mt-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Your activity</h2>
            <p className="text-[11px] text-slate-500">{filteredTransactions.length} {filteredTransactions.length === 1 ? "transaction" : "transactions"}</p>
          </div>
          {(filters.query || filters.status !== "all" || filters.from || filters.to) && (
            <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-[#0000ff] hover:bg-blue-50">
              Clear filters <X size={12} />
            </button>
          )}
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#0000ff]"><Wallet size={23} /></div>
            <h3 className="mt-3 text-sm font-bold text-slate-900">{transactions.length ? "No matching transactions" : "No transactions yet"}</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">{transactions.length ? "Try another search or adjust your filters." : "Your BLUEPAY activity will appear here when it is recorded."}</p>
            {transactions.length === 0 && <button type="button" onClick={() => setShowAddModal(true)} className="mt-4 rounded-lg bg-[#0000ff] px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800">Add transaction</button>}
          </div>
        ) : (
          <ul className="flex flex-col gap-2 pb-4">
            {filteredTransactions.map((transaction) => {
              const status = getTransactionStatusPresentation(transaction.status)
              const Icon = getTransactionIcon(transaction)
              const typeLabel = getTransactionTypeLabel(transaction)
              const recipient = transaction.recipientName || transaction.senderName || transaction.phoneNumber || (typeLabel === "Bank transfer" ? transaction.userName : undefined)
              const returnTo = buildTransactionUrl(filters)
              const detailsHref = `/transactions/${encodeURIComponent(transaction.id)}?returnTo=${encodeURIComponent(returnTo)}`
              const amountColor = status.key === "pending" ? "text-amber-700" : status.key === "failed" || status.key === "reversed" ? "text-rose-700" : transaction.type === "income" ? "text-emerald-700" : "text-rose-700"
              const amountPrefix = transaction.type === "income" ? "+" : "−"

              return (
                <li key={transaction.id}>
                  <Link href={detailsHref} onClick={() => sessionStorage.setItem("bluepay:transaction-list-scroll", String(window.scrollY))} aria-label={`Open ${typeLabel} transaction ${transaction.description || transaction.category || transaction.id}, ${formatTransactionCurrency(transaction.amount)}, status ${status.label}`} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff]">
                    <span className={`grid size-10 place-items-center rounded-xl ${transaction.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#0000ff]"}`}><Icon size={19} aria-hidden="true" /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold leading-5 text-slate-900">{transaction.description || typeLabel}</span>
                      <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="truncate font-medium text-slate-600">{transaction.category || typeLabel}</span>
                        {recipient && <><span aria-hidden="true" className="text-slate-300">·</span><span className="truncate">{recipient}</span></>}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <CalendarDays size={11} aria-hidden="true" />{formatTransactionDate(transaction)}
                        {formatTransactionTime(transaction) && <><span aria-hidden="true">·</span><Clock3 size={11} aria-hidden="true" />{formatTransactionTime(transaction)}</>}
                      </span>
                    </span>
                    <span className="flex min-w-[92px] flex-col items-end gap-1">
                      <span className={`whitespace-nowrap text-[12px] font-bold tabular-nums ${amountColor}`}>{amountPrefix}{formatTransactionCurrency(Math.abs(transaction.amount))}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusStyles(status.key).badge}`}><span className={`size-1.5 rounded-full ${statusStyles(status.key).dot}`} />{status.label}</span>
                      <ArrowRight size={13} aria-hidden="true" className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0000ff]" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAddModal(false) }}>
          <section id="add-transaction-dialog" role="dialog" aria-modal="true" aria-labelledby="add-transaction-title" className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0000ff]">BLUEPAY ledger</p><h2 id="add-transaction-title" className="mt-0.5 text-base font-bold">Add transaction</h2></div>
              <button type="button" onClick={() => setShowAddModal(false)} aria-label="Close add transaction" className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Transaction type</span>
                <div className="grid grid-cols-2 gap-2">
                  {(["income", "expense"] as const).map((type) => <button key={type} type="button" aria-pressed={newTransaction.type === type} onClick={() => setNewTransaction({ ...newTransaction, type, category: "" })} className={`h-10 rounded-lg text-sm font-semibold capitalize transition ${newTransaction.type === type ? "bg-[#0000ff] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{type}</button>)}
                </div>
              </div>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">Category
                <select value={newTransaction.category} onChange={(event) => setNewTransaction({ ...newTransaction, category: event.target.value })} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select category</option>
                  {transactionCategories[newTransaction.type].map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">Description
                <input value={newTransaction.description} onChange={(event) => setNewTransaction({ ...newTransaction, description: event.target.value })} placeholder="Describe this transaction" className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">Amount (NGN)
                <input type="number" inputMode="decimal" min="0.01" step="0.01" value={newTransaction.amount} onChange={(event) => setNewTransaction({ ...newTransaction, amount: event.target.value })} placeholder="0.00" className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">Date
                <input type="date" value={newTransaction.date} onChange={(event) => setNewTransaction({ ...newTransaction, date: event.target.value })} className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              {formError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</p>}
              <button type="button" onClick={addTransaction} className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0000ff] text-sm font-bold text-white transition hover:bg-blue-800"><Check size={16} />Save transaction</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function SummaryCard({ label, amount, tone, icon: Icon }: { label: string; amount: number; tone: "income" | "expense" | "net"; icon: LucideIcon }) {
  const palette = tone === "income" ? "bg-emerald-50 text-emerald-700" : tone === "expense" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-[#0000ff]"
  const amountColor = tone === "income" ? "text-emerald-800" : tone === "expense" ? "text-rose-800" : amount < 0 ? "text-rose-700" : "text-slate-900"
  return <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white px-2 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.035)]">
    <div className="flex items-center gap-1.5"><span className={`grid size-5 shrink-0 place-items-center rounded-md ${palette}`}><Icon size={12} aria-hidden="true" /></span><span className="truncate text-[9px] font-semibold text-slate-500">{label}</span></div>
    <p className={`mt-1 truncate text-[11px] font-bold tabular-nums ${amountColor}`}>{tone === "net" && amount < 0 ? `−${formatTransactionCurrency(Math.abs(amount))}` : formatTransactionCurrency(amount)}</p>
  </div>
}

function DateFilter({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="flex min-w-0 flex-col gap-1 text-[11px] font-medium text-slate-500">{label}
    <span className="relative flex items-center">
      <CalendarDays aria-hidden="true" size={14} className="pointer-events-none absolute left-2.5 text-slate-400" />
      <input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
    </span>
  </label>
}
