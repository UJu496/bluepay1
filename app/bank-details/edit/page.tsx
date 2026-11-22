"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronDown, Landmark, ShieldAlert } from "lucide-react"
import { localBanks } from "@/lib/banks"
import { getCurrentUserBankDetails, getCurrentUserProfile, saveCurrentUserBankDetails, type UserBankDetails } from "@/lib/user-bank-details"

type Step = "edit" | "review" | "saved"

export default function EditBankDetailsPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("edit")
  const [details, setDetails] = useState<UserBankDetails>({ bankName: "", accountNumber: "", accountName: "" })
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setDetails(getCurrentUserBankDetails() || { bankName: "", accountNumber: "", accountName: "" })
  }, [])

  function reviewChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (!getCurrentUserProfile()) return setError("Your profile is not available. Please sign in again.")
    if (!details.bankName || details.accountNumber.length !== 10 || !details.accountName.trim()) {
      return setError("Choose a bank and enter a 10-digit account number and account name.")
    }
    setStep("review")
  }

  function saveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const storedPin = localStorage.getItem("userPin")
    if (!storedPin) return setError("Set up your BLUEPAY PIN before changing bank details.")
    if (!/^\d{4}$/.test(pin) || pin !== storedPin) return setError("The PIN you entered is incorrect.")
    const saved = saveCurrentUserBankDetails({ ...details, accountName: details.accountName.trim() })
    if (!saved) return setError("We couldn't save these changes. Please try again.")
    setStep("saved")
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
        <button type="button" aria-label="Go back" onClick={() => step === "review" ? setStep("edit") : router.push("/bank-details")} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></button>
        <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">{step === "review" ? "Confirm bank details" : step === "saved" ? "Update complete" : "Edit bank details"}</h1></div>
      </header>
      <section className="mx-auto w-full max-w-md p-4">
        {step === "edit" && <form onSubmit={reviewChanges} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-1"><h2 className="text-sm font-bold text-[#101a43]">Linked account</h2><p className="mt-1 text-xs text-slate-500">Enter the bank details you want to use for transfers.</p></div>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="bank-name">Nigerian bank
            <span className="relative"><select id="bank-name" required value={details.bankName} onChange={(event) => setDetails((current) => ({ ...current, bankName: event.target.value }))} className="h-11 w-full appearance-none rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 pr-10 text-sm font-normal text-[#172033] outline-none focus:border-[#0000ff]"><option value="" disabled>Select a bank</option>{localBanks.map((bank) => <option key={bank.id} value={bank.name}>{bank.name}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} /></span>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="account-number">Account number
            <input id="account-number" required inputMode="numeric" autoComplete="off" pattern="[0-9]{10}" maxLength={10} value={details.accountNumber} onChange={(event) => setDetails((current) => ({ ...current, accountNumber: event.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit account number" className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal text-[#172033] outline-none placeholder:text-slate-400 focus:border-[#0000ff]" />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="account-name">Account name
            <input id="account-name" required autoComplete="name" value={details.accountName} onChange={(event) => setDetails((current) => ({ ...current, accountName: event.target.value }))} placeholder="Enter account name" className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal text-[#172033] outline-none placeholder:text-slate-400 focus:border-[#0000ff]" />
          </label>
          <p className="rounded-xl bg-blue-50 px-3 py-2.5 text-[11px] leading-relaxed text-[#344269]">Account names are entered by you. There is no bank verification service connected.</p>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
          <button type="submit" className="mt-1 h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white hover:bg-blue-700">Review changes</button>
        </form>}

        {step === "review" && <form onSubmit={saveChanges} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><h2 className="text-sm font-bold text-[#101a43]">Review new bank details</h2><p className="mt-1 text-xs text-slate-500">Check the information carefully before confirming.</p></div>
          <div className="rounded-xl bg-[#f0f5ff] p-3.5"><dl className="flex flex-col gap-3"><div><dt className="text-[11px] text-slate-500">Bank name</dt><dd className="mt-0.5 flex items-center gap-2 text-sm font-semibold"><Landmark size={15} className="text-[#0000ff]" />{details.bankName}</dd></div><div><dt className="text-[11px] text-slate-500">Account number</dt><dd className="mt-0.5 font-mono text-sm font-semibold">{details.accountNumber}</dd></div><div><dt className="text-[11px] text-slate-500">Account name</dt><dd className="mt-0.5 text-sm font-semibold">{details.accountName.trim()}</dd></div></dl></div>
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900"><ShieldAlert size={16} className="mt-0.5 shrink-0" />These details have not been verified with a bank. Confirm they are correct before saving.</div>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="pin">Your existing 4-digit BLUEPAY PIN<input id="pin" required inputMode="numeric" autoComplete="off" type="password" pattern="[0-9]{4}" maxLength={4} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Enter PIN" className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal tracking-[0.3em] text-[#172033] outline-none focus:border-[#0000ff]" /></label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
          <button type="submit" className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white hover:bg-blue-700">Confirm and save</button>
          <button type="button" onClick={() => { setError(""); setStep("edit") }} className="h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">Edit details</button>
        </form>}

        {step === "saved" && <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#0000ff]"><Check size={22} /></div><h2 className="text-base font-bold text-[#101a43]">Bank details updated</h2><p className="mt-1 text-xs text-slate-500">Your current device profile has been updated.</p><button type="button" onClick={() => router.replace("/bank-details")} className="mt-4 h-11 w-full rounded-xl bg-[#0000ff] text-sm font-bold text-white">View bank details</button></div>}
      </section>
    </main>
  )
}
