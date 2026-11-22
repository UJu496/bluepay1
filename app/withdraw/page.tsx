"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, UserRound, WalletCards } from "lucide-react"
import { getCurrentUserBankDetails, type UserBankDetails } from "@/lib/user-bank-details"
import { localBanks, type Bank } from "@/lib/banks"
import { BankPicker } from "@/components/bank-picker"

function NairaSymbol({ className }: { className: string }) {
  return (
    <svg aria-label="Nigerian naira" role="img" viewBox="0 0 16 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 19V1L13 19V1M1 8H15M1 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
    <main className="min-h-dvh bg-[#f5f7fc] text-[#172033]">
      <header className="transfer-header flex h-14 items-center gap-3 bg-[#0000ff] px-3.5 text-white shadow-sm">
        <button type="button" aria-label="Go back" onClick={() => router.back()} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <ArrowLeft size={21} />
        </button>
        <div className="leading-tight">
          <p className="text-[11px] font-medium tracking-[0.05em] text-blue-100">BLUEPAY MOBILE</p>
          <h1 className="mt-0.5 text-[16px] font-bold">Transfer to bank</h1>
        </div>
      </header>

      <section className="transfer-content mx-auto flex w-full max-w-md flex-col gap-2.5 px-3 pb-4 pt-3 sm:px-4">
        <section aria-label="Available balance" className="transfer-balance rounded-2xl bg-[#101a43] px-4 py-3 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-100">Available balance</p>
              <p className="mt-1 flex items-center gap-1 text-[22px] font-bold leading-none"><NairaSymbol className="h-[22px] w-[17px] shrink-0" />{new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(balance) ? balance : 0)}</p>
            </div>
            <WalletCards size={24} aria-hidden="true" className="text-blue-100" />
          </div>
          <p className="transfer-payout-note mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-[11px] leading-tight text-blue-50">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-blue-300" />
            Bank payout service is not connected.
          </p>
        </section>

        <section aria-labelledby="preferred-account-heading" className="transfer-preferred flex items-center justify-between gap-2 rounded-2xl border border-[#e2e7ef] bg-white p-3 shadow-sm">
          <div className="min-w-0">
            <h2 id="preferred-account-heading" className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0000ff]">Preferred bank account</h2>
            {preferredAccount?.bankName ? (
              <>
                <p className="mt-1 truncate text-[13px] font-semibold text-[#101a43]">{preferredAccount.bankName}</p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                  {preferredAccount.accountNumber ? `••••••${preferredAccount.accountNumber.slice(-4)}` : "Account number not added"}
                  {preferredAccount.accountName ? ` · ${preferredAccount.accountName}` : ""}
                </p>
              </>
            ) : (
              <p className="mt-1 text-[12px] text-slate-600">No bank account added yet.</p>
            )}
          </div>
          <button type="button" onClick={() => router.push("/bank-details?returnTo=%2Fwithdraw")} className="transfer-preferred-action min-h-10 w-[132px] shrink-0 rounded-xl border border-blue-100 bg-blue-50 px-2 text-[10px] font-bold text-[#0000ff] hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0000ff]">
            {preferredAccount?.bankName ? "EDIT ACCOUNT" : "+ ADD BANK ACCOUNT"}
          </button>
        </section>

        <form onSubmit={submit} className="transfer-form grid grid-cols-2 gap-x-2.5 gap-y-2 rounded-2xl border border-[#e2e7ef] bg-white p-3 shadow-sm">
          <div className="col-span-2 min-w-0">
            <label htmlFor="destination-bank" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#788196]">Select bank</label>
            <div id="destination-bank"><BankPicker compact banks={banks} value={selectedBank?.name || ""} loading={banksLoading} disabled={banksLoading} label="Select bank" placeholder="Choose destination bank" onSelect={(bank) => { setSelectedBank(bank); setAccountName("") }} /></div>
          </div>

          <div className="min-w-0">
            <label htmlFor="account-number" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#788196]">Account number</label>
            <input id="account-number" inputMode="numeric" autoComplete="off" maxLength={10} value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, ""))} placeholder="10-digit account number" className="h-11 w-full rounded-xl border border-[#e2e7ef] bg-white px-2.5 text-[12px] outline-none placeholder:text-[11px] placeholder:text-slate-400 focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff]" />
          </div>

          <div className="min-w-0">
            <label htmlFor="account-name" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#788196]">Account name</label>
            <div className="relative">
              <UserRound aria-hidden="true" size={16} className="absolute left-2.5 top-3 text-[#788196]" />
              <input id="account-name" autoComplete="off" value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Enter account name" className="h-11 w-full rounded-xl border border-[#e2e7ef] bg-white pl-8 pr-2 text-[12px] outline-none placeholder:text-[11px] placeholder:text-slate-400 focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff]" />
            </div>
            <p className="mt-1 text-[10px] leading-tight text-[#788196]">Account names are not verified by BLUEPAY.</p>
          </div>

          <div className="min-w-0">
            <label htmlFor="transfer-amount" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#788196]">Amount</label>
            <div className="flex h-11 items-center rounded-xl border border-[#e2e7ef] focus-within:border-[#0000ff] focus-within:ring-1 focus-within:ring-[#0000ff]">
              <span className="pl-2.5"><NairaSymbol className="h-4 w-3.5 text-[#788196]" /></span>
              <input id="transfer-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ""))} placeholder="0" className="h-full w-full min-w-0 rounded-r-xl bg-transparent px-1.5 text-[13px] outline-none placeholder:text-slate-400" />
            </div>
          </div>

          <div className="min-w-0">
            <label htmlFor="bpc-code" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#788196]">BPC code</label>
            <div className="flex h-11 min-w-0 items-center rounded-xl border border-[#e2e7ef] focus-within:border-[#0000ff] focus-within:ring-1 focus-within:ring-[#0000ff]">
              <input id="bpc-code" value={bpcCode} onChange={(event) => setBpcCode(event.target.value)} placeholder="Enter your valid BPC code" className="h-full min-w-0 flex-1 rounded-l-xl bg-transparent px-2 text-[11px] outline-none placeholder:text-[9px] placeholder:text-slate-400" />
              <button type="button" onClick={() => router.push("/buy-bpc")} className="h-full shrink-0 rounded-r-xl border-l border-[#e2e7ef] px-1.5 text-[9px] font-bold text-[#0000ff] hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#0000ff]">BUY BPC CODE</button>
            </div>
          </div>

          {error && <p role="alert" className="col-span-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={!canContinue} className="transfer-review col-span-2 h-11 rounded-xl bg-[#0000ff] text-[13px] font-bold tracking-[0.03em] text-white shadow-sm transition hover:bg-[#0000dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0000ff] disabled:cursor-not-allowed disabled:opacity-100">REVIEW TRANSFER</button>

          <p className="transfer-disclosure col-span-2 flex items-start gap-2 text-[10px] leading-relaxed text-[#788196]">
            <ShieldCheck size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-[#0000ff]" />
            BLUEPAY records this request locally. Live bank payout and account-name verification are not connected.
          </p>
        </form>
      </section>
    </main>
  )
}
