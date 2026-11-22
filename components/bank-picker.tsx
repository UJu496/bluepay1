"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown, Landmark, Search, X } from "lucide-react"
import type { Bank } from "@/lib/banks"

type BankPickerProps = {
  banks: Bank[]
  value: string
  onSelect: (bank: Bank | null) => void
  loading?: boolean
  label?: string
  placeholder?: string
  disabled?: boolean
  compact?: boolean
}

const bankLogoDomains: Record<string, string> = {
  "Access Bank": "accessbankplc.com",
  "First Bank of Nigeria": "firstbanknigeria.com",
  "United Bank for Africa (UBA)": "ubagroup.com",
  "Guaranty Trust Bank (GTBank)": "gtbank.com",
  "Zenith Bank": "zenithbank.com",
  "First City Monument Bank (FCMB)": "fcmb.com",
  "Fidelity Bank": "fidelitybank.ng",
  "Wema Bank": "wemabank.com",
  "Polaris Bank": "polarisbanklimited.com",
  "Stanbic IBTC Bank": "stanbicibtcbank.com",
  "Sterling Bank": "sterling.ng",
  "Union Bank of Nigeria": "unionbankng.com",
  "Ecobank Nigeria": "ecobank.com",
  OPay: "opayweb.com",
  PalmPay: "palmpay.com",
  "Kuda Microfinance Bank": "kuda.com",
  "Moniepoint MFB": "moniepoint.com",
  "VFD Microfinance Bank": "vbank.ng",
}

function BankLogo({ bank }: { bank: Bank }) {
  const initials = bank.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
  const logoUrl = bank.logo || (bankLogoDomains[bank.name] ? `https://logo.clearbit.com/${bankLogoDomains[bank.name]}` : null)

  return <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-[10px] font-bold text-[#0000ff]">
    <span aria-hidden="true">{initials}</span>
    {logoUrl && <img src={logoUrl} alt="" className="absolute inset-0 size-full bg-white object-contain p-1.5" onError={(event) => { event.currentTarget.style.display = "none" }} />}
  </span>
}

export function BankPicker({ banks, value, onSelect, loading = false, label = "Choose destination bank", placeholder = "Choose destination bank", disabled = false, compact = false }: BankPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selectedBank = banks.find((bank) => bank.name === value)
  const filteredBanks = useMemo(() => banks.filter((bank) => bank.name.toLowerCase().includes(search.trim().toLowerCase())), [banks, search])

  function close() {
    setOpen(false)
    setSearch("")
  }

  return <>
    <button type="button" aria-label={label} aria-haspopup="dialog" aria-expanded={open} disabled={disabled} onClick={() => setOpen(true)} className={`flex w-full items-center justify-between border border-[#e7eaf2] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0000ff] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "h-11 rounded-xl px-3 text-[13px]" : "h-12 rounded-xl px-3 text-sm"}`}>
      <span className="flex min-w-0 items-center gap-2">{selectedBank ? <BankLogo bank={selectedBank} /> : <span className={`flex shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0000ff] ${compact ? "size-8" : "size-9"}`}><Landmark size={compact ? 15 : 16} /></span>}<span className={selectedBank || value ? "truncate font-semibold" : "truncate text-[#788196]"}>{selectedBank?.name || value || (loading ? "Loading bank directory…" : placeholder)}</span></span><ChevronDown aria-hidden="true" size={compact ? 15 : 18} />
    </button>
    {open && <div className="fixed inset-0 z-50 flex items-end bg-[#101a43]/35 p-3" role="dialog" aria-modal="true" aria-label="Select destination bank" onClick={close}>
      <section className="mx-auto flex max-h-[85vh] w-full max-w-md flex-col rounded-[28px] bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <header className="mb-3 flex items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#788196]">Bank directory</p><h2 className="text-lg font-bold text-[#172033]">Select a bank</h2></div><button type="button" aria-label="Close bank selector" onClick={close} className="rounded-full p-2 text-[#788196] hover:bg-slate-100"><X size={18} /></button></header>
        <label htmlFor="bank-search" className="sr-only">Search banks and fintechs</label>
        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#f5f7fc] px-3"><Search aria-hidden="true" className="text-[#788196]" size={18} /><input id="bank-search" autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search banks and fintechs" className="h-11 w-full bg-transparent text-sm outline-none" /></div>
        <div className="mt-2 flex shrink-0 items-center justify-between"><p className="text-[10px] text-slate-500">{loading ? "Updating directory…" : `${filteredBanks.length} destinations`}</p>{value && <button type="button" onClick={() => { onSelect(null); close() }} className="rounded-md px-2 py-1 text-xs font-semibold text-[#0000ff]">Clear selection</button>}</div>
        <div className="mt-2 min-h-0 overflow-y-auto overscroll-contain scroll-smooth" aria-label="Bank results">{filteredBanks.length ? filteredBanks.map((bank) => <button type="button" key={bank.id} aria-pressed={selectedBank?.id === bank.id} onClick={() => { onSelect(bank); close() }} className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left text-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0000ff]"><span className="flex min-w-0 items-center gap-3"><BankLogo bank={bank} /><span className="flex min-w-0 flex-col"><span className="truncate font-medium text-[#172033]">{bank.name}</span><span className="text-[10px] text-slate-500">{bank.category}{bank.providerSupported ? " · provider directory" : " · directory entry"}</span></span></span>{selectedBank?.id === bank.id && <Check aria-label="Selected" className="shrink-0 text-[#0000ff]" size={18} />}</button>) : <p className="px-2 py-6 text-center text-sm text-slate-500">No matching banks found.</p>}</div>
        <p className="mt-2 shrink-0 text-[10px] leading-relaxed text-slate-500">Directory entries may not be supported for live transfers. BLUEPAY&apos;s live bank payout service is not connected.</p>
      </section>
    </div>}
  </>
}
