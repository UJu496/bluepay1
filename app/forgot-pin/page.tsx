"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Eye, EyeOff, ShieldCheck } from "lucide-react"

type RecoveryStep = "verify" | "reset" | "success"

export default function ForgotPinPage() {
  const router = useRouter()
  const [step, setStep] = useState<RecoveryStep>("verify")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [recoveryToken, setRecoveryToken] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [recoveredPin, setRecoveredPin] = useState("")
  const [isPinVisible, setIsPinVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [copyMessage, setCopyMessage] = useState("")

  const verifyAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/pin-recovery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || "We couldn't verify those details. Check them and try again.")
      setRecoveryToken(result.recoveryToken)
      setPassword("")
      setStep("reset")
      router.refresh()
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "We couldn't verify those details. Check them and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const saveNewPin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    if (!/^\d{4}$/.test(newPin) || newPin !== confirmPin) {
      setMessage("Enter matching 4-digit PINs.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/pin-recovery/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryToken, pin: newPin, confirmPin }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || "We couldn't save your new PIN. Please verify your account again.")
      setRecoveredPin(newPin)
      setStep("success")
      setRecoveryToken("")
      setNewPin("")
      setConfirmPin("")
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "We couldn't save your new PIN. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyPin = async () => {
    try {
      await navigator.clipboard.writeText(recoveredPin)
      setCopyMessage("PIN copied")
    } catch {
      setCopyMessage("Copy isn't available in this browser. Reveal your PIN to view it.")
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
      <header className="flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
        <Link href={step === "verify" ? "/login" : "/verify-pin"} aria-label="Back" className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></Link>
        <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">{step === "success" ? "PIN updated" : "Forgot BLUEPAY PIN"}</h1></div>
      </header>

      <section className="mx-auto w-full max-w-md p-4">
        {step === "verify" && <form onSubmit={verifyAccount} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-[#344269]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Enter your registered full name, email, and account password. All three are checked against the same secure account. No email code is used.</p></div>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="registered-name">Registered Full Name<input id="registered-name" required autoComplete="name" maxLength={160} value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal outline-none focus:border-[#0000ff]" /></label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="registered-email">Registered Email Address<input id="registered-email" required type="email" autoComplete="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal outline-none focus:border-[#0000ff]" /></label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="account-password">Account Password<input id="account-password" required type="password" autoComplete="current-password" minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal outline-none focus:border-[#0000ff]" /></label>
          {isLoading && <div role="status" className="flex items-center justify-center gap-3 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-[#101a43]"><span className="size-7 animate-spin rounded-full border-[3px] border-blue-200 border-t-[#0000ff]" />Verifying Your Account Details...</div>}
          {message && <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">{message}</p>}
          <button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white disabled:opacity-60">{isLoading ? "VERIFYING..." : "VERIFY ACCOUNT"}</button>
        </form>}

        {step === "reset" && <form onSubmit={saveNewPin} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-[#344269]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Account verified. Choose a new 4-digit PIN. It will be stored as a salted hash, never as plain text.</p></div>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="new-pin">New 4-digit BLUEPAY PIN<input id="new-pin" required inputMode="numeric" autoComplete="new-password" type="password" pattern="[0-9]{4}" maxLength={4} value={newPin} onChange={(event) => setNewPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] outline-none focus:border-[#0000ff]" /></label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="confirm-pin">Confirm new PIN<input id="confirm-pin" required inputMode="numeric" autoComplete="new-password" type="password" pattern="[0-9]{4}" maxLength={4} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 4))} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm tracking-[0.3em] outline-none focus:border-[#0000ff]" /></label>
          {isLoading && <div role="status" className="flex items-center justify-center gap-3 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-[#101a43]"><span className="size-7 animate-spin rounded-full border-[3px] border-blue-200 border-t-[#0000ff]" />Saving your new PIN...</div>}
          {message && <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">{message}</p>}
          <button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white disabled:opacity-60">{isLoading ? "SAVING..." : "SAVE NEW PIN"}</button>
        </form>}

        {step === "success" && <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck size={23} /></div>
          <div className="text-center"><h2 className="text-lg font-bold text-[#101a43]">Your PIN has been reset</h2><p className="mt-1 text-xs leading-relaxed text-slate-600">This PIN is shown only on this screen. Reveal or copy it now if you need to, then continue to PIN entry.</p></div>
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-[#f0f5ff] p-3">
            <output aria-label="Your new PIN" className="flex-1 text-center font-mono text-xl font-bold tracking-[0.35em]">{isPinVisible ? recoveredPin : "••••"}</output>
            <button type="button" onClick={() => setIsPinVisible((visible) => !visible)} aria-label={isPinVisible ? "Hide new PIN" : "Reveal new PIN"} className="rounded-lg p-2 text-[#0000ff] hover:bg-blue-100">{isPinVisible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            <button type="button" onClick={() => void copyPin()} aria-label="Copy new PIN" className="rounded-lg p-2 text-[#0000ff] hover:bg-blue-100"><Copy size={18} /></button>
          </div>
          {copyMessage && <p role="status" className="text-center text-xs text-slate-600">{copyMessage}</p>}
          <button type="button" onClick={() => router.replace("/verify-pin")} className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white">CONTINUE TO ENTER PIN</button>
        </div>}

        {step !== "success" && <Link href="/login" className="mt-4 block text-center text-xs font-semibold text-[#0000ff] underline underline-offset-4">Return to login</Link>}
      </section>
    </main>
  )
}
