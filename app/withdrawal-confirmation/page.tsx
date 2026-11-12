"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Check, Landmark, LockKeyhole, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

type WithdrawalData = { accountName: string; accountNumber: string; selectedBank: string; amount: number; balance: number; transactionId?: string; balanceDebited?: boolean; status?: string }

export default function WithdrawalConfirmationPage() {
  const router = useRouter()
  const [data, setData] = useState<WithdrawalData | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("withdrawalData")
    if (stored) setData(JSON.parse(stored))
    else router.replace("/withdraw")
  }, [router])

  const confirm = () => {
    if (!data || processing) return
    setProcessing(true)

    const currentBalance = Number.parseInt(localStorage.getItem("userBalance") || String(data.balance), 10)
    const shouldDebit = !data.balanceDebited && currentBalance >= data.amount
    const nextBalance = shouldDebit ? currentBalance - data.amount : currentBalance
    localStorage.setItem("userBalance", String(nextBalance))

    const updatedData = { ...data, balance: nextBalance, balanceDebited: true, status: "successful" }
    localStorage.setItem("withdrawalData", JSON.stringify(updatedData))

    if (data.transactionId) {
      const transactions = JSON.parse(localStorage.getItem("userTransactions") || "[]")
      localStorage.setItem("userTransactions", JSON.stringify(transactions.map((transaction: { id: string }) => transaction.id === data.transactionId ? { ...transaction, status: "successful" } : transaction)))
    }

    router.push("/withdrawal-success")
  }

  if (!data) return <main className="min-h-screen bg-[#f6f8fc]" />
  const masked = `${data.accountNumber.slice(0, 3)} **** ${data.accountNumber.slice(-2)}`

  return <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
    <header className="bg-[#0000ff] px-4 pb-5 pt-12 text-white"><div className="mx-auto flex max-w-lg items-center gap-3"><button onClick={() => router.back()} aria-label="Go back" className="rounded-full p-2 hover:bg-white/10"><ArrowLeft size={19} /></button><div><p className="text-xs font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-lg font-semibold">Confirm Withdrawal</h1></div></div></header>
    <section className="mx-auto max-w-lg space-y-4 px-4 py-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0000ff]">Review before sending</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Confirm your details</h2><p className="mt-1 text-sm text-slate-500">Make sure the recipient information is correct.</p></div>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"><div className="flex items-center gap-3 border-b border-slate-100 pb-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0000ff]"><Landmark size={21}/></div><div className="min-w-0"><p className="truncate font-semibold">{data.accountName}</p><p className="text-sm text-slate-500">{data.selectedBank} · {masked}</p></div><div className="ml-auto rounded-full bg-emerald-50 p-2 text-emerald-600"><Check size={15}/></div></div><div className="flex items-end justify-between pt-4"><div><p className="text-xs text-slate-500">Withdrawal amount</p><p className="mt-1 text-3xl font-bold tracking-tight">₦{data.amount.toLocaleString()}</p></div><p className="text-xs text-slate-500">Debit</p></div></div>
      <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-950"><ShieldCheck className="mt-0.5 shrink-0 text-[#0000ff]" size={18}/><p>Confirm only if the account name, bank, and amount match your intended recipient.</p></div>
      <button onClick={confirm} disabled={processing} className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0000ff] py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{processing ? "Opening secure processing..." : "YES, I CONFIRM"}<LockKeyhole size={16}/></button><button onClick={() => router.back()} disabled={processing} className="w-full py-3 text-sm font-semibold text-slate-500">Cancel and go back</button>
    </section>
  </main>
}
