"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Delete } from "lucide-react"
import { validateCurrentUserPin } from "@/lib/user-pin"

export default function VerifyPinPage() {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [success, setSuccess] = useState(false)

  function enterDigit(digit: string) {
    if (pin.length >= 4 || success) return
    const nextPin = `${pin}${digit}`
    setPin(nextPin)
    setError("")
    if (nextPin.length === 4) {
      if (validateCurrentUserPin(nextPin)) {
        setSuccess(true)
        window.setTimeout(() => router.push("/dashboard"), 700)
      } else {
        const nextAttempts = attempts + 1
        setAttempts(nextAttempts)
        setPin("")
        setError(nextAttempts >= 3 ? "Too many incorrect attempts. Please sign in again." : "Wrong PIN. Please try again.")
        if (nextAttempts >= 3) window.setTimeout(() => router.push("/login"), 1800)
      }
    }
  }

  return <main className="flex min-h-screen flex-col bg-[#0000ff] text-white">
    <header className="flex h-16 items-center gap-3 px-4 pt-2">
      <button type="button" aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={20} /></button>
      <h1 className="text-base font-semibold">Enter PIN</h1>
    </header>
    <section className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 pb-8">
      {success ? <div role="status" className="text-center"><div className="mx-auto mb-4 size-12 animate-spin rounded-full border-2 border-white/30 border-t-white" /><p className="text-base font-semibold">PIN verified</p></div> : <>
        <div className="mb-8 text-center"><h2 className="text-xl font-bold">Enter your BLUEPAY PIN</h2><p className="mt-1 text-sm text-white/80">Enter your existing 4-digit PIN to continue.</p></div>
        <div className="mb-5 flex justify-center gap-4" aria-label={`${pin.length} of 4 PIN digits entered`}>
          {Array.from({ length: 4 }, (_, index) => <span key={index} className="flex size-12 items-center justify-center rounded-full border-2 border-white/55" aria-hidden="true">{index < pin.length && <span className="size-2.5 rounded-full bg-white" />}</span>)}
        </div>
        {error && <p role="alert" className="mb-4 rounded-lg border border-white/20 bg-red-500/25 px-3 py-2 text-center text-sm">{error}</p>}
        <div className="mx-auto grid w-full max-w-[280px] grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => <button key={digit} type="button" onClick={() => enterDigit(String(digit))} aria-label={`Enter ${digit}`} className="flex size-16 items-center justify-center rounded-full text-xl font-semibold transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{digit}</button>)}
          <span aria-hidden="true" />
          <button type="button" onClick={() => enterDigit("0")} aria-label="Enter 0" className="flex size-16 items-center justify-center rounded-full text-xl font-semibold transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">0</button>
          <button type="button" onClick={() => { setPin((value) => value.slice(0, -1)); setError("") }} aria-label="Delete last digit" className="flex size-16 items-center justify-center rounded-full text-xl transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><Delete size={20} /></button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3"><Link href="/forgot-pin" className="rounded-md px-3 py-2 text-center text-sm font-bold underline underline-offset-4 hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">FORGOT PIN?</Link><Link href="/change-pin" className="rounded-md px-3 py-2 text-center text-xs font-semibold underline underline-offset-4 hover:text-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">CHANGE BLUEPAY PIN</Link></div>
      </>}
    </section>
  </main>
}
