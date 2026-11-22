"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForgotPinPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  function requestRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setPassword("")
      setMessage("Secure account verification is not connected. Your PIN has not been changed.")
    }, 1200)
  }

  return <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
    <header className="flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
      <button type="button" aria-label="Go back" onClick={() => router.back()} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></button>
      <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Forgot BLUEPAY PIN</h1></div>
    </header>
    <section className="mx-auto w-full max-w-md p-4">
      <form onSubmit={requestRecovery} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-[#344269]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Enter your registered details. BLUEPAY will not update your PIN unless secure account verification succeeds.</p></div>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="registered-name">Registered Full Name<input id="registered-name" required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal outline-none focus:border-[#0000ff]" /></label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="registered-email">Registered Email Address<input id="registered-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal outline-none focus:border-[#0000ff]" /></label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#344269]" htmlFor="account-password">Account Password<input id="account-password" required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-[#f0f5ff] px-3 text-sm font-normal outline-none focus:border-[#0000ff]" /></label>
        {loading && <div role="status" className="flex items-center justify-center gap-3 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-[#101a43]"><span className="relative size-8"><span className="absolute inset-0 animate-spin rounded-full border-[3px] border-blue-200 border-t-[#0000ff]" /><span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-blue-400" /></span>Verifying Your Account Details...</div>}
        {message && <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">{message}</p>}
        <button type="submit" disabled={loading} className="h-11 rounded-xl bg-[#0000ff] text-sm font-bold text-white disabled:opacity-60">{loading ? "VERIFYING..." : "RECOVER PIN"}</button>
        <Link href="/verify-pin" className="text-center text-xs font-semibold text-[#0000ff] underline underline-offset-4">Return to PIN entry</Link>
      </form>
    </section>
  </main>
}
