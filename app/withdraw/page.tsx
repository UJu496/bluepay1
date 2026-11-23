"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Landmark, ShieldCheck, UserRound, WalletCards } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getCurrentUserBankDetails, type UserBankDetails } from "@/lib/user-bank-details"
import { localBanks, type Bank } from "@/lib/banks"
import { BankPicker } from "@/components/bank-picker"

export default function WithdrawPage() {
  const router = useRouter()
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [amount, setAmount] = useState("")
  const [bpcCode, setBpcCode] = useState("")
  const [error, setError] = useState("")
  const [balance, setBalance] = useState(0)
  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(true)
  const [preferredAccount, setPreferredAccount] = useState<UserBankDetails | null>(null)

  useEffect(() => {
    const loadBalance = () => {
      const stored = localStorage.getItem("userBalance")
      const authoritativeBalance = stored ? Number.parseInt(stored, 10) : 200000
      if (!stored) localStorage.setItem("userBalance", String(authoritativeBalance))
      setBalance(authoritativeBalance)
    }
    loadBalance()
    window.addEventListener("storage", (event) => event.key === "userBalance" && loadBalance())
    document.addEventListener("visibilitychange", loadBalance)
    return () => {
      document.removeEventListener("visibilitychange", loadBalance)
    }
  }, [])

  useEffect(() => {
    const syncPreferredAccount = () => {
      const details = getCurrentUserBankDetails()
      setPreferredAccount(details)
      setAccountNumber(details?.accountNumber || "")
      setAccountName(details?.accountName || "")
      setSelectedBank(banks.find((bank) => bank.name === details?.bankName) || null)
    }
    syncPreferredAccount()
    window.addEventListener("storage", syncPreferredAccount)
    return () => window.removeEventListener("storage", syncPreferredAccount)
  }, [banks])

  useEffect(() => {
    fetch("/api/banks")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load banks")
        setBanks(data.banks)
      })
      .catch(() => setBanks(localBanks))
      .finally(() => setBanksLoading(false))
  }, [])

  const canContinue = Boolean(selectedBank?.name && accountNumber.length === 10 && accountName && Number(amount) > 0 && bpcCode)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const value = Number(amount)
    if (!selectedBank?.name || accountNumber.length !== 10 || !accountName || !value || !bpcCode) return setError("Complete all transfer details to continue.")
    return setError("Secure transfer authorization is unavailable. No transfer was initiated.")
  }

  return <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-lg">
      <button aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft /></button>
      <div><p className="text-[11px] font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Transfer to bank</h1></div>
    </header>
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 pb-8">
      <div className="rounded-2xl bg-[#101a43] p-4 text-white shadow-md"><div className="flex items-center gap-2 text-xs text-blue-100"><WalletCards /> Available balance</div><p className="mt-2 text-2xl font-bold">{formatCurrency(balance)}</p><p className="mt-1 text-[11px] text-blue-100">Bank payout service is not connected</p></div>
      <section aria-labelledby="preferred-account-title" className="rounded-2xl border border-[#e7eaf2] bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0000ff]">YOUR PREFERRED BANK ACCOUNT</p>{preferredAccount?.bankName ? <><h2 id="preferred-account-title" className="mt-1 text-sm font-bold text-[#101a43]">{preferredAccount.bankName}</h2><p className="mt-1 font-mono text-xs text-slate-600">{preferredAccount.accountNumber ? `••••••${preferredAccount.accountNumber.slice(-4)}` : "Account number not added"}</p><p className="mt-1 text-xs text-slate-600">{preferredAccount.accountName || "Account name not added"}</p></> : <p id="preferred-account-title" className="mt-2 text-sm font-medium text-slate-600">No bank account added yet.</p>}</div><Landmark className="mt-1 text-[#0000ff]" size={19} /></div><button type="button" onClick={() => router.push("/bank-details?returnTo=%2Fwithdraw")} className="mt-3 h-10 w-full rounded-xl border border-blue-100 bg-blue-50 text-xs font-bold text-[#0000ff]">{preferredAccount?.bankName ? "CHANGE ACCOUNT DETAILS" : "+ ADD BANK ACCOUNT"}</button></section>
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-[#e7eaf2] bg-white p-4 shadow-sm">
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Select bank</label><BankPicker banks={banks} value={selectedBank?.name || ""} loading={banksLoading} disabled={banksLoading} label="Select bank" onSelect={(bank) => { setSelectedBank(bank); setAccountName("") }} /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Account number</label><input inputMode="numeric" maxLength={10} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} placeholder="10-digit account number" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Account name</label><div className="relative"><UserRound className="absolute left-3 top-3.5 text-[#788196]" /><input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Enter account name" className="h-12 w-full rounded-xl border border-[#e7eaf2] pl-10 pr-3 text-sm outline-none focus:border-[#0000ff]" /></div><p className="mt-1 text-[11px] text-[#788196]">Enter the name yourself. BLUEPAY does not verify account names with a bank.</p></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Amount</label><input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="₦0" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">BPC code</label><input value={bpcCode} onChange={(e) => setBpcCode(e.target.value)} placeholder="Enter your valid BPC code" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /><button type="button" onClick={() => router.push("/buy-bpc")} className="mt-1 text-xs font-semibold text-[#0000ff]">Buy BPC code</button></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[11px] leading-relaxed text-[#101a43]"><ShieldCheck className="mt-0.5 shrink-0 text-[#0000ff]" /> BLUEPAY records this request locally. Live bank payout and account-name verification are not connected.</div>
        <button disabled={!canContinue} className="h-12 rounded-xl bg-[#0000ff] text-sm font-bold text-white shadow-md transition hover:bg-[#0000dd] disabled:cursor-not-allowed disabled:opacity-45">Review transfer</button>
      </form>
    </section>
  </main>
}
