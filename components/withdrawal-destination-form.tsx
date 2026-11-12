"use client"

import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronDown, Info, Landmark, Search, UserRound, WalletCards } from "lucide-react"
import { BLUEPAY_BPC_CODE } from "@/lib/bpc"
import { africanCountries, getAccountNumberGuidance, getAccountNumberMaxLength, getBanksForCountry, isValidAccountNumber } from "@/lib/banks"
import type { Bank } from "@/lib/banks"

function BankMark({ bank }: { bank: Bank }) {
  const initials = bank.name.split(/\\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
  return <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-[#0000ff]">{initials || <Landmark size={17} />}</span>
}

function DestinationPicker({
  countryCode,
  onCountryChange,
  selectedBank,
  onBankChange,
  banks,
  banksLoading,
}: {
  countryCode: string
  onCountryChange: (countryCode: string) => void
  selectedBank: Bank | null
  onBankChange: (bank: Bank) => void
  banks: Bank[]
  banksLoading: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selectedCountry = africanCountries.find((country) => country.code === countryCode)
  const filteredBanks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return banks.filter((bank) => `${bank.name} ${bank.category}`.toLowerCase().includes(normalizedSearch))
  }, [banks, search])

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="destination-country" className="text-xs font-semibold text-[#788196]">Destination country</label>
        <select
          id="destination-country"
          value={countryCode}
          onChange={(event) => onCountryChange(event.target.value)}
          className="h-12 w-full rounded-xl border border-[#e7eaf2] bg-white px-3 text-sm outline-none focus:border-[#0000ff]"
        >
          {africanCountries.map((country) => (
            <option key={country.code} value={country.code} disabled={!country.withdrawalFormEnabled}>
              {country.name}{country.withdrawalFormEnabled ? ` · ${country.currency}` : " · Coming soon"}
            </option>
          ))}
        </select>
        <p className="text-[11px] leading-4 text-[#788196]">The form currently supports Nigeria, Ghana, and Cameroon. Other African destinations are listed as coming soon.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#788196]" htmlFor="destination-bank">Choose destination bank or mobile money</label>
        <button
          id="destination-bank"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#e7eaf2] px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff]"
        >
          <span className="flex min-w-0 items-center gap-3">
            {selectedBank ? <BankMark bank={selectedBank} /> : <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0000ff]"><Landmark size={17} /></span>}
            <span className="min-w-0">
              <span className={`block truncate ${selectedBank ? "font-semibold" : "text-[#788196]"}`}>{selectedBank?.name || (banksLoading ? "Loading institutions…" : "Choose a bank or wallet")}</span>
              {selectedBank && <span className="block text-[11px] text-[#788196]">{selectedBank.category}{selectedCountry ? ` · ${selectedCountry.name}` : ""}</span>}
            </span>
          </span>
          <ChevronDown aria-hidden="true" className="shrink-0 text-[#788196]" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[#101a43]/45 p-3 sm:items-center sm:justify-center"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}
          onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false) }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="destination-picker-title" className="mx-auto flex max-h-[86vh] w-full max-w-md flex-col rounded-[26px] bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#788196]">{selectedCountry?.name || "Africa"}</p>
                <h2 id="destination-picker-title" className="mt-1 text-lg font-bold text-[#172033]">Choose a destination institution</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close destination selector" className="rounded-full px-2 text-2xl leading-8 text-[#788196]">×</button>
            </div>
            <label className="flex items-center gap-2 rounded-xl bg-[#f5f7fc] px-3">
              <Search aria-hidden="true" className="shrink-0 text-[#788196]" size={18} />
              <span className="sr-only">Search banks and mobile money providers</span>
              <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search banks and wallets" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
            <div className="mt-3 min-h-0 overflow-y-auto">
              {filteredBanks.length > 0 ? filteredBanks.map((bank) => (
                <button
                  type="button"
                  key={bank.id}
                  onClick={() => { onBankChange(bank); setIsOpen(false); setSearch("") }}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff]"
                >
                  <BankMark bank={bank} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#172033]">{bank.name}</span>
                    <span className="block text-xs text-[#788196]">{bank.category}</span>
                  </span>
                  {selectedBank?.id === bank.id && <Check aria-label="Selected" className="shrink-0 text-[#0000ff]" size={18} />}
                </button>
              )) : (
                <p className="px-3 py-8 text-center text-sm text-[#788196]">No institutions match that search.</p>
              )}
            </div>
            <p className="mt-2 border-t border-slate-100 pt-3 text-[11px] leading-4 text-[#788196]">Names are destination options only; this form does not verify account ownership or support live payouts.</p>
          </section>
        </div>
      )}
    </>
  )
}

export function WithdrawalDestinationForm() {
  const router = useRouter()
  const [countryCode, setCountryCode] = useState("NG")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [amount, setAmount] = useState("")
  const [bpcCode, setBpcCode] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [balance, setBalance] = useState(0)
  const [banks, setBanks] = useState<Bank[]>(() => getBanksForCountry("NG"))
  const [banksLoading, setBanksLoading] = useState(false)
  const selectedCountry = africanCountries.find((country) => country.code === countryCode)
  const accountGuidance = getAccountNumberGuidance(countryCode, selectedBank)
  const accountMaxLength = getAccountNumberMaxLength(countryCode, selectedBank)
  const accountIsValid = selectedBank ? isValidAccountNumber(countryCode, selectedBank, accountNumber) : false
  const canValidate = Boolean(selectedCountry?.withdrawalFormEnabled && selectedBank && accountName.trim() && accountIsValid && Number(amount) > 0 && bpcCode.trim())

  useEffect(() => {
    const loadBalance = () => {
      const stored = localStorage.getItem("userBalance")
      const parsed = stored ? Number.parseInt(stored, 10) : 0
      setBalance(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0)
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
    let active = true
    const localOptions = getBanksForCountry(countryCode)
    setBanks(localOptions)
    if (countryCode !== "NG") {
      setBanksLoading(false)
      return () => { active = false }
    }

    setBanksLoading(true)
    void fetch("/api/banks").then(async (response) => {
      const payload = await response.json() as { banks?: Bank[] }
      if (!response.ok || !Array.isArray(payload.banks)) throw new Error("Bank list unavailable")
      const combined = [...payload.banks, ...localOptions]
      const seen = new Set<string>()
      const unique = combined.filter((bank) => {
        const key = bank.name.trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      if (active) setBanks(unique)
    }).catch(() => {
      if (active) setBanks(localOptions)
    }).finally(() => {
      if (active) setBanksLoading(false)
    })

    return () => { active = false }
  }, [countryCode])

  function changeCountry(nextCountryCode: string) {
    const nextCountry = africanCountries.find((country) => country.code === nextCountryCode)
    if (!nextCountry?.withdrawalFormEnabled) return
    setCountryCode(nextCountryCode)
    setSelectedBank(null)
    setAccountNumber("")
    setAccountName("")
    setError("")
    setNotice("")
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setNotice("")

    if (!selectedCountry?.withdrawalFormEnabled || !selectedBank) {
      setError("Choose a supported destination country and institution.")
      return
    }
    if (!isValidAccountNumber(countryCode, selectedBank, accountNumber)) {
      setError(countryCode === "NG" && selectedBank.identifier === "bank-account"
        ? "Enter the complete 10-digit Nigerian NUBAN account number."
        : accountGuidance)
      return
    }
    if (!accountName.trim()) {
      setError("Enter the name shown on the destination account or wallet.")
      return
    }
    if (!Number(amount) || Number(amount) <= 0) {
      setError("Enter a positive amount to preview.")
      return
    }
    if (bpcCode.trim() !== BLUEPAY_BPC_CODE) {
      setError("This BPC code is invalid. Buy a valid code from BLUEPAY2026.")
      return
    }

    setNotice("Basic destination formatting passed. The account name is not verified. No withdrawal was submitted and no balance was debited.")
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-lg">
        <button type="button" aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft /></button>
        <div><p className="text-[11px] font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Withdrawal destination</h1></div>
      </header>
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 pb-8">
        <div className="rounded-2xl bg-[#101a43] p-4 text-white shadow-md">
          <div className="flex items-center gap-2 text-xs text-blue-100"><WalletCards aria-hidden="true" /> Local display balance</div>
          <p className="mt-2 text-2xl font-bold">NGN {balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="mt-1 text-[11px] leading-4 text-blue-100">Device-stored preview only. This amount is not checked against a server or available for payout.</p>
        </div>

        <div role="note" className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-950">
          <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#0000ff]" size={18} />
          <p><strong>Set up your preferred destination.</strong> Add your bank or mobile money details as they appear on your account. This form checks formatting only; live withdrawals will be available once BLUEPAY payout processing is enabled. Your details stay on this page and are not saved or sent.</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-[#e7eaf2] bg-white p-4 shadow-sm">
          <DestinationPicker
            countryCode={countryCode}
            onCountryChange={changeCountry}
            selectedBank={selectedBank}
            onBankChange={(bank) => { setSelectedBank(bank); setAccountNumber(""); setAccountName(""); setError(""); setNotice("") }}
            banks={banks}
            banksLoading={banksLoading}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="destination-account" className="text-xs font-semibold text-[#788196]">{selectedBank?.identifier === "mobile-number" ? "Registered wallet phone number" : "Bank account number"}</label>
            <input
              id="destination-account"
              inputMode="numeric"
              autoComplete="off"
              disabled={!selectedBank}
              maxLength={accountMaxLength}
              value={accountNumber}
              onChange={(event) => { setAccountNumber(event.target.value.replace(/\D/g, "")); setError(""); setNotice("") }}
              placeholder={selectedBank?.identifier === "mobile-number" ? "Enter the registered phone number" : countryCode === "NG" ? "10-digit NUBAN" : "Enter the full account number"}
              aria-describedby="account-format-help"
              aria-invalid={Boolean(accountNumber) && !accountIsValid}
              className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff] focus:ring-2 focus:ring-blue-100 aria-[invalid=true]:border-red-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            <p id="account-format-help" className="text-[11px] leading-4 text-[#788196]">{accountGuidance}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="destination-name" className="text-xs font-semibold text-[#788196]">{selectedBank?.identifier === "mobile-number" ? "Wallet holder name" : "Account holder name"}</label>
            <div className="relative">
              <UserRound aria-hidden="true" className="absolute left-3 top-3.5 text-[#788196]" size={18} />
              <input id="destination-name" autoComplete="name" value={accountName} onChange={(event) => { setAccountName(event.target.value); setError(""); setNotice("") }} placeholder="Name shown on the destination account" className="h-12 w-full rounded-xl border border-[#e7eaf2] pl-10 pr-3 text-sm outline-none focus:border-[#0000ff]" />
            </div>
            <p className="text-[11px] leading-4 text-[#788196]">Name is collected as entered and is not verified against the bank or wallet.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="withdrawal-amount" className="text-xs font-semibold text-[#788196]">Amount preview (NGN)</label>
            <input id="withdrawal-amount" inputMode="numeric" value={amount} onChange={(event) => { setAmount(event.target.value.replace(/[^0-9]/g, "")); setError(""); setNotice("") }} placeholder="0" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" />
            <p className="text-[11px] leading-4 text-[#788196]">No currency conversion or payout amount is calculated by this form.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="withdrawal-bpc" className="text-xs font-semibold text-[#788196]">BPC code</label>
            <input id="withdrawal-bpc" value={bpcCode} onChange={(event) => { setBpcCode(event.target.value); setError(""); setNotice("") }} placeholder="Enter your valid BPC code" className="h-12 w-full rounded-xl border border-[#e7eaf2] px-3 text-sm outline-none focus:border-[#0000ff]" />
            <button type="button" onClick={() => router.push("/buy-bpc")} className="self-start text-xs font-semibold text-[#0000ff]">Buy BPC code</button>
          </div>

          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
          {notice && <p role="status" className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-xs leading-5 text-blue-950"><Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#0000ff]" size={16} />{notice}</p>}

          <button type="submit" disabled={!canValidate} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0000ff] text-sm font-bold text-white shadow-md transition hover:bg-[#0000dd] disabled:cursor-not-allowed disabled:opacity-45">
            <Check aria-hidden="true" size={17} /> Validate destination form
          </button>
          <p className="text-center text-[10px] leading-4 text-[#788196]">All 55 African destinations are listed; only Nigeria, Ghana, and Cameroon are currently enabled for this form.</p>
        </form>
      </section>
    </main>
  )
}
