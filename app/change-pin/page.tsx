"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { getCurrentUserPin, hasUnassignedLegacyPin } from "@/lib/user-pin"

export default function ChangePinPage() {
  const router = useRouter()
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")

  function updatePin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (!/^\d{4}$/.test(newPin) || !/^\d{4}$/.test(confirmPin)) return setError("Both new PIN fields must contain exactly 4 digits.")
    if (newPin !== confirmPin) return setError("Your new PINs do not match.")
    if (!getCurrentUserPin() && hasUnassignedLegacyPin()) return setError("Your existing PIN needs secure account verification before it can be replaced.")
    return setError("Secure account verification is not connected. Your PIN has not been changed.")
  }

  return <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
    <header className="flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
      <button type="button" aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></button>
      <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Change BLUEPAY PIN</h1></div>
    </header>
    <section className="mx-auto w-full max-w-md p-4">
      <form onSubmit={updatePin} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-[#344269]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>To protect your account, PIN changes require secure account recovery verification. Your current PIN is not requested here.</p></div>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="new-pin">New 4-digit BLUEPAY PIN<input id="new-pin" required inputMode="numeric" autoComplete="new-password" type="password" pattern="[0-9]{4}" maxLength={4} value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] text-[#172033] outline-none focus:border-[#0000ff]" /></label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="confirm-pin">Confirm new PIN<input id="confirm-pin" required inputMode="numeric" autoComplete="new-password" type="password" pattern="[0-9]{4}" maxLength={4} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] text-[#172033] outline-none focus:border-[#0000ff]" /></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
        <button type="submit" className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white hover:bg-blue-700">SAVE PIN</button>
      </form>
    </section>
  </main>
}
