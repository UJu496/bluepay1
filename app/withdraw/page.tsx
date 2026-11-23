"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronDown, Landmark, Search, ShieldCheck, UserRound, WalletCards } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"
import { formatCurrency } from "@/lib/utils"
import { isValidBpcCode } from "@/lib/bpc"
import type { Bank } from "@/lib/banks"

const bankLogoDomains: Record<string, string> = {
  "Access Bank": "accessbankplc.com",
  "First Bank": "firstbanknigeria.com",
  UBA: "ubagroup.com",
  GTBank: "gtbank.com",
  "Zenith Bank": "zenithbank.com",
  FCMB: "fcmb.com",
  "Fidelity Bank": "fidelitybank.ng",
  "Wema Bank": "wemabank.com",
  "Polaris Bank": "polarisbanklimited.com",
  "Stanbic IBTC": "stanbicibtcbank.com",
  "Sterling Bank": "sterling.ng",
  "Union Bank": "unionbankng.com",
  Ecobank: "ecobank.com",
  "OPay": "opayweb.com",
  PalmPay: "palmpay.com",
  "Kuda MFB": "kuda.com",
  "Moniepoint MFB": "moniepoint.com",
  "VFD MFB": "vbank.ng",
  FirstMonie: "firstbanknigeria.com",
}

function BankLogo({ bank, size = "md" }: { bank: Bank; size?: "sm" | "md" }) {
  const initials = bank.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
  const logoUrl = bank.logo || (bankLogoDomains[bank.name] ? `https://logo.clearbit.com/${bankLogoDomains[bank.name]}` : null)
  const dimensions = size === "sm" ? "h-9 w-9 text-[10px]" : "h-14 w-14 text-xs"

  return <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white font-bold text-[#0000ff] shadow-sm ${dimensions}`}>
    <span aria-hidden="true">{initials}</span>
    {logoUrl && <img src={logoUrl} alt={`${bank.name} logo`} className="absolute inset-0 h-full w-full bg-white object-contain p-1.5" onError={(event) => { event.currentTarget.style.display = "none" }} />}
    <span className="sr-only">{bank.name}</span>
  </span>
}

export default function WithdrawPage() {
  const router = useRouter()
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
    fetch("/api/banks")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load banks")
        setBanks(data.banks)
      })
      .catch(() => setError("Bank list is temporarily unavailable. Please try again."))
      .finally(() => setBanksLoading(false))
  }, [])

  const filteredBanks = useMemo(() => banks.filter((bank) => bank.name.toLowerCase().includes(search.toLowerCase())), [banks, search])
  const canContinue = Boolean(selectedBank?.name && accountNumber.length === 10 && accountName && Number(amount) > 0 && bpcCode)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const value = Number(amount)
    if (!selectedBank?.name || accountNumber.length !== 10 || !accountName || !value || !bpcCode) return setError("Complete all transfer details to continue.")
    if (value > balance) return setError("Insufficient available balance.")
    if (!isValidBpcCode(bpcCode)) return setError("This BPC code is invalid. Buy a valid code from BLUEPAY2026.")
    const transaction = saveTransaction({ type: "expense", category: "Withdrawal", description: `Transfer to ${selectedBank.name}`, amount: value, date: new Date().toISOString().split("T")[0], accountNumber, bankName: selectedBank.name, userName: accountName, status: "pending" })
    localStorage.setItem("withdrawalData", JSON.stringify({ accountName, accountNumber, selectedBank: selectedBank.name, bankCode: selectedBank.code, amount: value, balance, transactionId: transaction.id, reference: transaction.reference, trackingId: transaction.trackingId, createdAt: transaction.createdAt, status: "initiated" }))
    router.push("/withdrawal-confirmation")
  }

  return <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-lg">
      <button aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft /></button>
      <div><p className="text-[11px] font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Transfer to bank</h1></div>
    </header>
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 pb-8">
      <div className="rounded-2xl bg-[#101a43] p-4 text-white shadow-md"><div className="flex items-center gap-2 text-xs text-blue-100"><WalletCards /> Available balance</div><p className="mt-2 text-2xl font-bold">{formatCurrency(balance)}</p><p className="mt-1 text-[11px] text-blue-100">Secure bank transfer</p></div>
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-[#e7eaf2] bg-white p-4 shadow-sm">
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Select bank</label><button type="button" onClick={() => setOpenBanks(!openBanks)} className="flex h-12 w-full items-center justify-between rounded-xl border border-[#e7eaf2] px-3 text-left text-sm"><span className="flex min-w-0 items-center gap-2">{selectedBank ? <BankLogo bank={selectedBank} size="sm" /> : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0000ff]"><Landmark size={16} /></span>}<span className={selectedBank ? "truncate font-semibold" : "text-[#788196]"}>{selectedBank?.name || (banksLoading ? "Loading supported banks..." : "Choose destination bank")}</span></span><ChevronDown /></button></div>
        {openBanks && <div className="fixed inset-0 z-50 flex items-end bg-[#101a43]/35 p-3" role="dialog" aria-modal="true" aria-label="Select destination bank" onClick={() => setOpenBanks(false)}><div className="mx-auto w-full max-w-md rounded-[28px] bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#788196]">Transfer to bank</p><h2 className="text-lg font-bold text-[#172033]">Select destination</h2></div><button type="button" aria-label="Close bank selector" onClick={() => setOpenBanks(false)} className="rounded-full px-3 py-1 text-xl text-[#788196]">×</button></div><div className="flex items-center gap-2 rounded-xl bg-[#f5f7fc] px-3"><Search className="text-[#788196]" size={18} /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search banks and fintechs" className="h-11 w-full bg-transparent text-sm outline-none" /></div><div className="mt-3 max-h-[52vh] overflow-y-auto">{filteredBanks.map((bank) => <button type="button" key={bank.id} onClick={() => { setSelectedBank(bank); setAccountName(""); setOpenBanks(false); setSearch("") }} className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left text-sm hover:bg-blue-50"><span className="flex items-center gap-3"><BankLogo bank={bank} size="sm" /><span className="font-medium">{bank.name}</span></span>{selectedBank?.id === bank.id && <Check className="text-[#0000ff]" size={18} />}</button>)}</div></div></div>}
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Account number</label><input inputMode="numeric" maxLength={10} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} placeholder="10-digit account number" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Account name</label><div className="relative"><UserRound className="absolute left-3 top-3.5 text-[#788196]" /><input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Verified recipient name" className="h-12 w-full rounded-xl border border-[#e7eaf2] pl-10 pr-3 text-sm outline-none focus:border-[#0000ff]" /></div><p className="mt-1 text-[11px] text-[#788196]">Enter the name returned by your provider&apos;s account enquiry.</p></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Amount</label><input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="₦0" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">BPC code</label><input value={bpcCode} onChange={(e) => setBpcCode(e.target.value)} placeholder="Enter your valid BPC code" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /><button type="button" onClick={() => router.push("/buy-bpc")} className="mt-1 text-xs font-semibold text-[#0000ff]">Buy BPC code</button></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[11px] text-[#101a43]"><ShieldCheck className="text-[#0000ff]" /> Your transfer is protected by BLUEPAY security checks.</div>
        <button disabled={!canContinue} className="h-12 rounded-xl bg-[#0000ff] text-sm font-bold text-white shadow-md transition hover:bg-[#0000dd] disabled:cursor-not-allowed disabled:opacity-45">Review transfer</button>
      </form>
    </section>
  </main>
}
