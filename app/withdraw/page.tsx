"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Landmark, UserRound, WalletCards } from "lucide-react"
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
      const authoritativeBalance = stored ? Number.parseInt(stored, 10) : 151
      if (!stored) localStorage.setItem("userBalance", String(authoritativeBalance))
      setBalance(authoritativeBalance)
    }
    loadBalance()
    window.addEventListener("storage", loadBalance)
    document.addEventListener("visibilitychange", loadBalance)
    return () => {
      window.removeEventListener("storage", loadBalance)
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

  const canContinue = Boolean(selectedBank?.name && accountNumber.length === 10 && accountName.trim() && Number(amount) > 0 && bpcCode.trim())

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const value = Number(amount)
    if (!selectedBank?.name || accountNumber.length !== 10 || !accountName.trim() || !value || !bpcCode.trim()) {
      setError("Complete all transfer details to continue.")
      return
    }
    setError("Secure transfer authorization is unavailable. No transfer was initiated.")
  }

  return (
    <main className="min-h-dvh bg-white text-[#101a43]">
      <header className="flex h-[54px] items-center gap-2.5 bg-[#0000ff] px-3 text-white">
        <button type="button" aria-label="Go back" onClick={() => router.back()} className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <ArrowLeft size={19} />
        </button>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-blue-100">BLUEPAY MOBILE</p>
          <h1 className="mt-0.5 text-[15px] font-bold">Transfer to bank</h1>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-2 px-3 pb-3 pt-2.5 sm:px-4">
        <section aria-label="Available balance" className="flex min-h-[56px] items-center justify-between rounded-xl bg-[#0000ff] px-3.5 py-2 text-white">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-blue-100">Available balance</p>
            <p className="mt-0.5 flex items-baseline gap-0.5 text-[19px] font-bold leading-none"><span className="font-[Arial,sans-serif]">₦</span>{new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(balance) ? balance : 0)}</p>
          </div>
          <WalletCards size={20} aria-hidden="true" className="text-blue-100" />
        </section>

        <p role="status" className="flex min-h-6 items-center gap-1.5 rounded-md bg-blue-50 px-2.5 text-[10px] font-medium text-[#34436f]">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#0000ff]" />
          Bank payout service is not connected.
        </p>

        <section aria-labelledby="preferred-account-heading" className="flex min-h-[66px] items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <div className="min-w-0">
            <h2 id="preferred-account-heading" className="text-[8px] font-bold uppercase tracking-[0.07em] text-[#0000ff]">Your preferred bank account</h2>
            {preferredAccount?.bankName ? (
              <p className="mt-1 truncate text-[12px] font-semibold text-[#101a43]">
                {preferredAccount.bankName}<span className="ml-2 font-mono text-[11px] font-medium text-slate-500">{preferredAccount.accountNumber ? `••••${preferredAccount.accountNumber.slice(-4)}` : "Number not added"}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-600">No bank account added yet.</p>
            )}
          </div>
          <button type="button" onClick={() => router.push("/bank-details?returnTo=%2Fwithdraw")} className="min-h-9 shrink-0 rounded-lg bg-blue-50 px-2.5 text-[10px] font-bold text-[#0000ff] hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0000ff]">
            {preferredAccount?.bankName ? "EDIT ACCOUNT" : "+ ADD BANK ACCOUNT"}
          </button>
        </section>

        <form onSubmit={submit} className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          <div className="col-span-2 min-w-0">
            <label htmlFor="destination-bank" className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">Select bank</label>
            <div id="destination-bank"><BankPicker compact banks={banks} value={selectedBank?.name || ""} loading={banksLoading} disabled={banksLoading} label="Choose destination bank" placeholder="Choose destination bank" onSelect={(bank) => { setSelectedBank(bank); setAccountName("") }} /></div>
          </div>

          <div className="min-w-0">
            <label htmlFor="account-number" className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">Account number</label>
            <input id="account-number" inputMode="numeric" autoComplete="off" maxLength={10} value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, ""))} placeholder="10-digit account number" className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] outline-none placeholder:text-[10px] placeholder:text-slate-400 focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff]" />
          </div>

          <div className="min-w-0">
            <label htmlFor="account-name" className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">Account name</label>
            <div className="relative">
              <UserRound aria-hidden="true" size={14} className="absolute left-2.5 top-3 text-slate-400" />
              <input id="account-name" autoComplete="off" value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Enter account name" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-[12px] outline-none placeholder:text-[10px] placeholder:text-slate-400 focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff]" />
            </div>
            <p className="mt-0.5 text-[9px] leading-tight text-slate-500">Enter the name yourself. BLUEPAY does not verify account names with a bank.</p>
          </div>

          <div className="min-w-0">
            <label htmlFor="transfer-amount" className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">Amount</label>
            <div className="flex h-10 items-center rounded-lg border border-slate-200 focus-within:border-[#0000ff] focus-within:ring-1 focus-within:ring-[#0000ff]">
              <span className="pl-2.5 font-[Arial,sans-serif] text-[12px] font-semibold text-slate-500">₦</span>
              <input id="transfer-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ""))} placeholder="0" className="h-full w-full min-w-0 rounded-r-lg bg-transparent px-1.5 text-[12px] outline-none placeholder:text-slate-400" />
            </div>
          </div>

          <div className="min-w-0">
            <label htmlFor="bpc-code" className="mb-0.5 block text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">BPC code</label>
            <div className="flex h-10 min-w-0 items-center rounded-lg border border-slate-200 focus-within:border-[#0000ff] focus-within:ring-1 focus-within:ring-[#0000ff]">
              <input id="bpc-code" value={bpcCode} onChange={(event) => setBpcCode(event.target.value)} placeholder="Enter your valid BPC code" className="h-full min-w-0 flex-1 rounded-l-lg bg-transparent px-2.5 text-[11px] outline-none placeholder:text-[9px] placeholder:text-slate-400" />
              <button type="button" onClick={() => router.push("/buy-bpc")} className="h-full shrink-0 border-l border-slate-200 px-1.5 text-[8px] font-bold text-[#0000ff] hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0000ff]">BUY BPC CODE</button>
            </div>
          </div>

          {error && <p role="alert" className="col-span-2 rounded-md bg-red-50 px-2.5 py-1.5 text-[10px] font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={!canContinue} className="col-span-2 h-11 rounded-lg bg-[#0000ff] text-[12px] font-bold tracking-[0.04em] text-white shadow-sm transition hover:bg-[#0000dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0000ff] disabled:cursor-not-allowed">REVIEW TRANSFER</button>
        </form>

        <p className="border-t border-slate-100 pt-1.5 text-[9px] leading-[1.35] text-slate-500">
          BLUEPAY records this request locally. Live bank payout and account-name verification are not connected.
        </p>
      </div>

    </main>
  )
}
