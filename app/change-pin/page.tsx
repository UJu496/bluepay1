"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ShieldCheck } from "lucide-react"
import { getCurrentUserPin, hasUnassignedLegacyPin, saveCurrentUserPin, validateCurrentUserPin } from "@/lib/user-pin"

export default function ChangePinPage() {
  const router = useRouter()
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  function updatePin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (!getCurrentUserPin()) {
      if (hasUnassignedLegacyPin()) return setError("An existing device PIN cannot be securely associated with this customer profile. Secure PIN recovery is not connected, so no PIN was changed.")
      return setError("Your existing BLUEPAY PIN is not available. Sign in again or create a PIN first.")
    }
    if (!validateCurrentUserPin(currentPin)) return setError("Incorrect current BLUEPAY PIN. Please enter your correct 4-digit PIN.")
    if (!/^\d{4}$/.test(newPin)) return setError("Your new BLUEPAY PIN must contain exactly 4 digits.")
    if (newPin !== confirmPin) return setError("Your new PINs do not match.")
    if (!saveCurrentUserPin(newPin)) return setError("We couldn't update your PIN. Please try again.")
    setSaved(true)
  }

  return <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
    <header className="flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
      <button type="button" aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></button>
      <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Change BLUEPAY PIN</h1></div>
    </header>
    <section className="mx-auto w-full max-w-md p-4">
      {saved ? <div role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#0000ff]"><Check size={22} /></div><h2 className="text-base font-bold text-[#101a43]">Your BLUEPAY PIN has been successfully updated.</h2><p className="mt-2 text-xs text-slate-500">Your new PIN is now active for PIN-protected actions on this device.</p><button type="button" onClick={() => router.replace("/verify-pin")} className="mt-5 h-11 w-full rounded-xl bg-[#0000ff] text-sm font-bold text-white">Continue</button></div> : <form onSubmit={updatePin} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-[#344269]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Confirm your current PIN before choosing a new one. PIN recovery is unavailable because no secure recovery service is connected.</p></div>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="current-pin">Current BLUEPAY PIN<input id="current-pin" required inputMode="numeric" autoComplete="current-password" type="password" pattern="[0-9]{4}" maxLength={4} value={currentPin} onChange={(event) => setCurrentPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] text-[#172033] outline-none focus:border-[#0000ff]" /></label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="new-pin">New 4-digit BLUEPAY PIN<input id="new-pin" required inputMode="numeric" autoComplete="new-password" type="password" pattern="[0-9]{4}" maxLength={4} value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] text-[#172033] outline-none focus:border-[#0000ff]" /></label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="confirm-pin">Confirm new PIN<input id="confirm-pin" required inputMode="numeric" autoComplete="new-password" type="password" pattern="[0-9]{4}" maxLength={4} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] text-[#172033] outline-none focus:border-[#0000ff]" /></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
        <button type="submit" className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white hover:bg-blue-700">SAVE NEW PIN</button>
      </form>}
    </section>
  </main>
}
