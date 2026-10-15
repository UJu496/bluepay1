"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Search, WalletCards } from "lucide-react"
import { getTransactions, markTransactionNotificationsRead, type Transaction } from "@/lib/transactions"

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`

export default function RecentActivitiesPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    setTransactions(getTransactions().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    markTransactionNotificationsRead()
  }, [])

  const visibleTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type === filter
    const haystack = `${transaction.description} ${transaction.category} ${transaction.id} ${transaction.bankName ?? ""}`.toLowerCase()
    return matchesFilter && haystack.includes(query.toLowerCase())
  }), [filter, query, transactions])

  return (
    <main className="min-h-screen bg-[#f5f7fc] pb-8 text-[#172033]">
      <header className="sticky top-0 z-20 border-b border-[#e7eaf2] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-[#f5f7fc]"><ArrowLeft size={19} /></button>
          <div><p className="text-[10px] font-semibold tracking-[0.16em] text-[#788196]">BLUEPAY MOBILE</p><h1 className="text-lg font-bold">Recent Activities</h1></div>
        </div>
      </header>
      <section className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#e7eaf2] bg-white px-3 py-2.5 shadow-sm"><Search size={17} className="text-[#788196]" /><input aria-label="Search activities" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search description or reference" className="w-full bg-transparent text-sm outline-none" /></div>
        <div className="flex gap-2 overflow-x-auto pb-1">{["all", "income", "expense"].map((option) => <button key={option} onClick={() => setFilter(option)} className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${filter === option ? "bg-[#0000ff] text-white" : "bg-white text-[#788196]"}`}>{option === "all" ? "All activity" : option === "income" ? "Credits" : "Debits"}</button>)}</div>
        <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-[#788196]">Transaction history</p><WalletCards size={18} className="text-[#0000ff]" /></div>
        {visibleTransactions.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d9deea] bg-white px-6 py-14 text-center"><p className="font-semibold">No matching activity</p><p className="mt-1 text-sm text-[#788196]">Completed transactions will appear here.</p></div> : <div className="flex flex-col gap-2">{visibleTransactions.map((transaction) => { const credit = transaction.type === "income"; return <article key={transaction.id} className="flex items-center gap-3 rounded-2xl border border-[#e7eaf2] bg-white p-3 shadow-sm"><div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${credit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{credit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="truncate text-[11px] text-[#788196]">{transaction.bankName ? `${transaction.bankName} • ${transaction.accountNumber ?? ""}` : transaction.category}</p><p className="text-[10px] text-[#9aa3b5]">{new Date(transaction.timestamp).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })} · Ref {transaction.id}</p></div><p className={`text-sm font-bold ${credit ? "text-emerald-600" : "text-[#172033]"}`}>{credit ? "+" : "-"}{formatNaira(transaction.amount)}</p></article> })}</div>}
      </section>
    </main>
  )
}
