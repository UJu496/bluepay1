"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Info, Mail, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"

const PURCHASE_AMOUNT = 10680

export default function BuyBpcPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ id?: string; fullName: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userData") || "null")
    setProfile(stored ? { id: stored.id, fullName: stored.fullName || "", email: stored.email || "" } : null)
    setLoading(false)
  }, [])

  function createAttempt() {
    if (submitting || !profile) return
    if (!profile.fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError("Complete your name and email in your profile before continuing.")
      return
    }
    setSubmitting(true)
    setError("")
    const id = crypto.randomUUID()
    const attempt = {
      id,
      userId: profile.id || profile.email,
      reference: `BPM-PAY-${id.slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "awaiting_review",
      name: profile.fullName,
      email: profile.email,
      amount: PURCHASE_AMOUNT,
      receiptName: null,
    }
    localStorage.setItem(`bluepayPaymentAttempt:${attempt.id}`, JSON.stringify(attempt))
    localStorage.setItem("paymentAttempt", JSON.stringify(attempt))
    localStorage.setItem("paymentData", JSON.stringify({ userId: attempt.userId, userName: attempt.name, userEmail: attempt.email, amount: attempt.amount, attemptId: attempt.id }))
    router.push(`/payment?attemptId=${attempt.id}`)
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <header className="bg-[#0000ff] px-4 pb-4 pt-9 text-white"><div className="mx-auto flex max-w-lg items-center gap-2"><button onClick={() => router.back()} aria-label="Go back" className="rounded-full p-2"><ArrowLeft size={18} /></button><div><p className="text-[10px] text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Buy BPC Code</h1></div></div></header>
      <section className="mx-auto max-w-lg space-y-3 px-4 py-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500"><span className="text-[#0000ff]">01 Checkout</span><span>02 Payment details</span><span>03 Review</span></div>
        <div className="rounded-2xl bg-[#0000ff] p-4 text-white shadow-md"><p className="text-xs text-blue-100">BPC Code purchase</p><p className="mt-1 text-2xl font-bold">₦{PURCHASE_AMOUNT.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p><p className="mt-1 text-[11px] text-blue-100">Your code is issued only after payment is genuinely verified.</p></div>
        <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-950"><Info size={16} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Use your saved account details to continue to the payment instructions. BLUEPAY records an internal attempt; it does not process real payments here.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="mb-3 text-sm font-semibold">Customer details</p>{loading ? <div className="h-16 animate-pulse rounded-xl bg-slate-100" aria-label="Loading profile" /> : profile ? <div className="space-y-2 text-sm"><div className="flex items-center gap-2"><UserRound size={15} className="text-slate-400" /><span>{profile.fullName || "Name missing"}</span></div><div className="flex items-center gap-2"><Mail size={15} className="text-slate-400" /><span>{profile.email || "Email missing"}</span></div></div> : <p className="text-xs text-red-600">Sign in to continue with your saved customer details.</p>}</div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <button onClick={createAttempt} disabled={loading || !profile || submitting} className="h-11 w-full rounded-xl bg-[#0000ff] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Creating payment attempt..." : "Continue to payment details"}</button>
      </section>
    </main>
  )
}
