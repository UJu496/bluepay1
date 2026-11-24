"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Check, ChevronDown, CreditCard, KeyRound, Landmark, Plane, Search, ShieldCheck, ShoppingCart, UserRound, WalletCards } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"
import { formatCurrency } from "@/lib/utils"
import { BLUEPAY_BPC_PURCHASE_AMOUNT, isValidBpcCode } from "@/lib/bpc"
import type { Bank } from "@/lib/banks"

const MIN_TRANSFER_AMOUNT = 100
const TRANSFER_FEE = 0
const QUICK_AMOUNTS = [5000, 10000, 25000, 50000]
const POPULAR_BANKS = ["PalmPay", "OPay", "Moniepoint", "Kuda", "GTBank", "Access Bank"]

function normalizeBankName(value: string) {
  return value.toLowerCase().replace(/\s+(mfb|microfinance bank)$/i, "").replace(/[^a-z0-9]/g, "")
}

export default function WithdrawPage() {
  const router = useRouter()
  const submitLock = useRef(false)
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [amount, setAmount] = useState("")
  const [bpcCode, setBpcCode] = useState("")
  const [search, setSearch] = useState("")
  const [openBanks, setOpenBanks] = useState(false)
  const [error, setError] = useState("")
  const [balance, setBalance] = useState(0)
  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const numericAmount = Number(amount) || 0
  const balanceAfter = Math.max(0, balance - numericAmount - TRANSFER_FEE)

  useEffect(() => {
    const loadBalance = () => {
      const stored = localStorage.getItem("userBalance")
      const parsed = stored === null ? 0 : Number(stored)
      setBalance(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0)
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "userBalance") loadBalance()
    }
    loadBalance()
    window.addEventListener("storage", handleStorage)
    window.addEventListener("focus", loadBalance)
    document.addEventListener("visibilitychange", loadBalance)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("focus", loadBalance)
      document.removeEventListener("visibilitychange", loadBalance)
    }
  }, [])

  useEffect(() => {
    let active = true
    fetch("/api/banks")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load banks")
        if (active) setBanks(Array.isArray(data.banks) ? data.banks : [])
      })
      .catch(() => {
        if (active) setError("Bank list is temporarily unavailable. Please try again.")
      })
      .finally(() => {
        if (active) setBanksLoading(false)
      })
    return () => { active = false }
  }, [])

  const filteredBanks = useMemo(() => banks.filter((bank) => bank.name.toLowerCase().includes(search.toLowerCase())), [banks, search])
  const popularBanks = useMemo(() => POPULAR_BANKS.map((name) => banks.find((bank) => normalizeBankName(bank.name) === normalizeBankName(name))).filter((bank): bank is Bank => Boolean(bank)), [banks])

  function chooseBank(bank: Bank) {
    setSelectedBank(bank)
    setOpenBanks(false)
    setSearch("")
    setError("")
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current) return
    setError("")
    const value = Number(amount)
    if (!selectedBank?.name) return setError("Choose a destination bank to continue.")
    if (!/^\d{10}$/.test(accountNumber)) return setError("Enter a valid 10-digit account number.")
    if (!accountName.trim()) return setError("Enter the recipient account name.")
    if (!Number.isInteger(value) || value < MIN_TRANSFER_AMOUNT) return setError(`Enter a whole-number amount of at least ${formatCurrency(MIN_TRANSFER_AMOUNT)}.`)
    if (value + TRANSFER_FEE > balance) return setError("Insufficient available balance for this transfer.")
    if (!bpcCode.trim()) return setError("Enter your BPC authorization code.")
    if (!isValidBpcCode(bpcCode)) return setError("This BPC code is invalid. Get a valid code from BLUEPAY.")

    submitLock.current = true
    setProcessing(true)
    try {
      const transaction = saveTransaction({
        type: "expense",
        category: "Withdrawal",
        description: `Transfer to ${selectedBank.name}`,
        amount: value,
        fee: TRANSFER_FEE,
        totalAmountDebited: value + TRANSFER_FEE,
        date: new Date().toISOString().split("T")[0],
        accountNumber,
        bankName: selectedBank.name,
        userName: accountName.trim(),
        bpcCode,
        status: "pending",
      })
      localStorage.setItem("withdrawalData", JSON.stringify({
        accountName: accountName.trim(),
        accountNumber,
        selectedBank: selectedBank.name,
        bankCode: selectedBank.code,
        amount: value,
        fee: TRANSFER_FEE,
        balance,
        transactionId: transaction.id,
        reference: transaction.reference,
        trackingId: transaction.trackingId,
        createdAt: transaction.createdAt,
        status: "initiated",
      }))
      router.push("/withdrawal-confirmation")
    } catch {
      submitLock.current = false
      setProcessing(false)
      setError("We couldn’t start your transfer. Please try again.")
    }
  }

  const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0000ff] focus:ring-2 focus:ring-blue-100"
  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700"

  return <main className="min-h-screen overflow-x-hidden bg-[#f4f6fb] text-[#172033]">
    <header className="bg-[#0000ff] px-4 pb-5 pt-5 text-white shadow-md">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <button type="button" aria-label="Go back" onClick={() => router.back()} className="flex size-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/15"><ArrowLeft size={19} /></button>
        <div className="min-w-0 flex-1"><h1 className="text-base font-semibold">Transfer To Bank</h1><p className="mt-0.5 text-xs text-blue-100">Instant Bank Transfer</p></div>
        <button type="button" aria-label="Open inbox" onClick={() => router.push("/notifications")} className="relative flex size-9 shrink-0 items-center justify-center rounded-full transition hover:bg-white/15"><Bell size={19} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-emerald-300" /></button>
      </div>
    </header>

    <section className="mx-auto flex w-full max-w-lg flex-col gap-3.5 px-3.5 py-4 pb-8 sm:px-4">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0000ff] via-[#2525dc] to-[#111b59] p-4 text-white shadow-lg shadow-blue-200/60">
        <div className="flex items-start justify-between gap-3">
          <div><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-blue-100"><WalletCards size={15} /> Source wallet balance</div><p className="mt-2 text-[26px] font-bold leading-none tracking-tight">{formatCurrency(balance)}</p></div>
          <div className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-blue-50">Standard tier</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/20 pt-3 text-[10px]">
          <div><p className="text-blue-100">Transfer fee</p><p className="mt-1 font-semibold">{formatCurrency(TRANSFER_FEE)}</p></div>
          <div><p className="text-blue-100">Minimum</p><p className="mt-1 font-semibold">{formatCurrency(MIN_TRANSFER_AMOUNT)}</p></div>
          <div><p className="text-blue-100">Daily tier</p><p className="mt-1 font-semibold">Standard</p></div>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3.5" noValidate>
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm" aria-labelledby="recipient-title">
          <div className="mb-3 flex items-center justify-between"><div><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#0000ff]">1</span><h2 id="recipient-title" className="text-sm font-bold">Recipient bank account</h2></div><p className="ml-8 mt-0.5 text-[10px] text-slate-500">Step 1 of 3 · Nigeria</p></div><Landmark size={18} className="text-[#0000ff]" /></div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Popular banks</p>
          <div className="mb-3 grid grid-cols-3 gap-2">
            {POPULAR_BANKS.map((name) => {
              const bank = popularBanks.find((item) => normalizeBankName(item.name) === normalizeBankName(name))
              const active = Boolean(bank && selectedBank?.id === bank.id)
              return <button key={name} type="button" disabled={!bank} onClick={() => bank && chooseBank(bank)} className={`min-h-10 rounded-xl border px-1.5 text-[11px] font-semibold transition ${active ? "border-[#0000ff] bg-blue-50 text-[#0000ff]" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"}`} aria-pressed={active}>{name}</button>
            })}
          </div>
          <div className="mb-3">
            <label className={labelClass} htmlFor="destination-bank">Destination bank</label>
            <button id="destination-bank" type="button" aria-haspopup="dialog" aria-expanded={openBanks} onClick={() => setOpenBanks(true)} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-left text-sm outline-none transition hover:border-blue-300 focus:ring-2 focus:ring-blue-100"><span className={selectedBank ? "truncate font-medium text-slate-900" : "text-slate-400"}>{selectedBank?.name || (banksLoading ? "Loading supported banks…" : "Choose destination bank")}</span><ChevronDown size={17} className="shrink-0 text-slate-500" /></button>
          </div>
          <div className="mb-3"><label className={labelClass} htmlFor="account-number">Account number</label><input id="account-number" inputMode="numeric" autoComplete="off" maxLength={10} value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter 10-digit account number" className={inputClass} /></div>
          <div><label className={labelClass} htmlFor="account-name">Recipient account name</label><div className="relative"><UserRound size={16} className="absolute left-3 top-3 text-slate-400" /><input id="account-name" autoComplete="name" value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Enter recipient name" className={`${inputClass} pl-9`} /></div><p className="mt-1.5 text-[10px] leading-4 text-slate-500">Enter the recipient name manually. Verify the details with your recipient.</p></div>
          <div className="mt-3"><label className={labelClass} htmlFor="bpc-code-recipient">BPC code</label><input id="bpc-code-recipient" autoComplete="off" value={bpcCode} onChange={(event) => setBpcCode(event.target.value)} placeholder="Enter your BPC code" className={inputClass} /><button type="button" onClick={() => router.push("/buy-bpc")} className="mt-1.5 text-[10px] font-semibold text-[#0000ff] underline-offset-2 hover:underline">Buy BPC Code ({formatCurrency(BLUEPAY_BPC_PURCHASE_AMOUNT)})</button></div>
        </section>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm" aria-labelledby="amount-title">
          <div className="mb-3 flex items-center justify-between"><div><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#0000ff]">2</span><h2 id="amount-title" className="text-sm font-bold">Transfer amount</h2></div><p className="ml-8 mt-0.5 text-[10px] text-slate-500">Step 2 of 3</p></div><CreditCard size={18} className="text-[#0000ff]" /></div>
          <label className={labelClass} htmlFor="transfer-amount">Amount to send</label>
          <div className="flex h-12 items-center rounded-xl border border-slate-200 focus-within:border-[#0000ff] focus-within:ring-2 focus-within:ring-blue-100"><span className="pl-3 text-sm font-semibold text-slate-500">₦</span><input id="transfer-amount" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} placeholder="0.00" className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-2 text-base font-semibold outline-none placeholder:text-slate-300" /><button type="button" onClick={() => setAmount(String(Math.floor(Math.max(0, balance - TRANSFER_FEE))))} className="mr-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-[#0000ff] transition hover:bg-blue-100">MAX</button></div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5">{QUICK_AMOUNTS.map((quickAmount) => <button key={quickAmount} type="button" onClick={() => setAmount(String(quickAmount))} className="rounded-lg border border-slate-200 py-2 text-[10px] font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">₦{quickAmount.toLocaleString("en-NG")}</button>)}</div>
          <p className="mt-2 text-[10px] text-slate-500">Minimum {formatCurrency(MIN_TRANSFER_AMOUNT)} · Available {formatCurrency(balance)}</p>
        </section>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm" aria-labelledby="authorization-title">
          <div className="mb-3 flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#0000ff]">3</span><div className="flex-1"><h2 id="authorization-title" className="text-sm font-bold">BPC authorization</h2><p className="mt-0.5 text-[10px] text-slate-500">Step 3 of 3 · Required to authorize external bank transfer</p></div><KeyRound size={18} className="text-[#0000ff]" /></div>
          <label className={labelClass} htmlFor="bpc-code">BPC authorization code</label><input id="bpc-code" autoComplete="off" value={bpcCode} onChange={(event) => setBpcCode(event.target.value)} placeholder="Enter your BPC code" className={inputClass} />
          <div className="mt-2 flex items-center justify-between gap-2"><button type="button" onClick={() => router.push("/notifications")} className="text-left text-[10px] font-semibold text-[#0000ff] underline-offset-2 hover:underline">Check Inbox for Approved Code</button><button type="button" onClick={() => router.push("/buy-bpc")} className="shrink-0 text-[10px] font-semibold text-[#0000ff] underline-offset-2 hover:underline">Buy BPC Code ({formatCurrency(BLUEPAY_BPC_PURCHASE_AMOUNT)})</button></div>
        </section>

        <section className="rounded-2xl bg-[#111a3b] p-3.5 text-white shadow-sm" aria-labelledby="summary-title">
          <h2 id="summary-title" className="mb-3 text-xs font-bold">Transfer summary</h2>
          <div className="flex flex-col gap-2 text-[11px]"><div className="flex items-start justify-between gap-3"><span className="text-slate-300">Transfer to</span><span className="max-w-[65%] text-right font-medium">{accountName.trim() && selectedBank ? `${accountName.trim()} · ${selectedBank.name}` : "Complete bank details above"}</span></div><div className="flex justify-between"><span className="text-slate-300">Transfer fee</span><span className="font-medium">{formatCurrency(TRANSFER_FEE)}</span></div><div className="flex justify-between border-t border-white/15 pt-2"><span className="text-slate-300">Balance after transfer</span><span className="font-semibold">{formatCurrency(balanceAfter)}</span></div></div>
        </section>

        {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">{error}</p>}
        <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-3 py-2.5 text-[10px] leading-4 text-[#172033]"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>BLUEPAY BPC authorization is required. Confirm the recipient details before sending.</p></div>
        <button type="submit" disabled={processing || banksLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0000ff] text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-[#0000dd] disabled:cursor-not-allowed disabled:opacity-60"><Plane size={17} />{processing ? "Processing transfer…" : "Send Money to Bank"}</button>
        <button type="button" onClick={() => router.push("/buy-bpc")} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700"><ShoppingCart size={17} />Buy BPC Code – {formatCurrency(BLUEPAY_BPC_PURCHASE_AMOUNT)}</button>
        <p className="text-center text-[10px] text-slate-500">Bank transfer processing is subject to supported payout services.</p>
      </form>
    </section>

    {openBanks && <div className="fixed inset-0 z-50 flex items-end bg-[#101a43]/40 p-3 sm:items-center" role="presentation" onClick={() => setOpenBanks(false)}><div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-4 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="bank-picker-title" onClick={(event) => event.stopPropagation()}><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Destination bank</p><h2 id="bank-picker-title" className="text-base font-bold">Choose a bank</h2></div><button type="button" aria-label="Close bank selector" onClick={() => setOpenBanks(false)} className="flex size-9 items-center justify-center rounded-full text-xl text-slate-500 hover:bg-slate-100">×</button></div><div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3"><Search size={16} className="text-slate-500" /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Nigerian banks and fintechs" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" /></div><div className="mt-3 max-h-[48vh] overflow-y-auto">{filteredBanks.map((bank) => <button type="button" key={bank.id} onClick={() => chooseBank(bank)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition hover:bg-blue-50"><span className="flex min-w-0 items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-[#0000ff]">{bank.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span><span className="truncate font-medium">{bank.name}</span></span>{selectedBank?.id === bank.id && <Check size={17} className="shrink-0 text-[#0000ff]" />}</button>)}{!banksLoading && filteredBanks.length === 0 && <p className="px-3 py-8 text-center text-sm text-slate-500">No matching banks found.</p>}</div></div></div>}
  </main>
}
