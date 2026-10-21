"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Check, Info, Mail, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { BLUEPAY_BPC_PURCHASE_AMOUNT } from "@/lib/bpc"

const PURCHASE_AMOUNT = BLUEPAY_BPC_PURCHASE_AMOUNT

export default function BuyBpcPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<{ id?: string; fullName: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"intro" | "details">("intro")

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userData") || "null")
    setProfile(stored ? { id: stored.id, fullName: stored.fullName || stored.name || "", email: stored.email || "" } : null)
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
    const attempt = { id, userId: profile.id || profile.email, reference: `BPM-PAY-${id.slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(), status: "pending_verification", name: profile.fullName, email: profile.email, amount: PURCHASE_AMOUNT, receiptName: null }
    localStorage.setItem(`bluepayPaymentAttempt:${id}`, JSON.stringify(attempt))
    localStorage.setItem("paymentAttempt", JSON.stringify(attempt))
    localStorage.setItem("paymentData", JSON.stringify({ userId: attempt.userId, userName: attempt.name, userEmail: attempt.email, amount: PURCHASE_AMOUNT, attemptId: id }))
    router.push(`/payment?attemptId=${id}`)
  }

  const firstName = profile?.fullName.trim().split(/\s+/)[0]
  return <main className="min-h-screen bg-[#f5f7f4] text-[#17201b]"><header className="bg-[#0000ff] px-4 pb-4 pt-8 text-white"><div className="mx-auto flex max-w-lg items-center gap-2"><button onClick={() => step === "intro" ? router.back() : setStep("intro")} aria-label="Go back" className="rounded-full p-2"><ArrowLeft size={18} /></button><div><p className="text-[10px] uppercase tracking-wider text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Buy BPC</h1></div></div></header><section className="mx-auto max-w-lg space-y-3 px-4 py-4"><div className="flex gap-1.5" aria-label={`Step ${step === "intro" ? 1 : 2} of 2`}>{[1,2].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item === 1 || step === "details" ? "bg-emerald-500" : "bg-slate-200"}`} />)}</div>{step === "intro" ? <><div className="pt-2"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your purchase journey</p><h2 className="mt-1 text-2xl font-bold tracking-tight">{firstName ? `Welcome, ${firstName}` : "Welcome"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Follow three simple steps to complete your BPC purchase securely.</p></div><div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{["Review your BPC purchase details.","Transfer the payment to the BLUEPAY bank account.","Upload your receipt and wait for verification."].map((text, index) => <div key={text} className="flex items-start gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{index + 1}</span><p className="pt-1 text-sm text-slate-700">{text}</p></div>)}</div><button onClick={() => setStep("details")} className="h-11 w-full rounded-xl bg-[#18201b] text-sm font-bold text-white">Next</button></> : <><div className="rounded-2xl bg-[#0000ff] p-4 text-white shadow-lg"><p className="text-xs text-blue-100">BPC Code purchase</p><p className="mt-1 text-3xl font-bold">₦{PURCHASE_AMOUNT.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p><p className="mt-1 text-xs text-blue-100">Fixed amount • NGN</p></div><div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-950"><Info size={16} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Payment remains pending until the submitted receipt is reviewed. BPC is not credited from a button tap alone.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="mb-3 text-sm font-bold">Customer details</p>{loading ? <div className="h-14 animate-pulse rounded-xl bg-slate-100" /> : profile ? <div className="space-y-2 text-sm"><div className="flex min-w-0 items-center gap-2"><UserRound size={15} className="shrink-0 text-slate-400" /><span className="break-words">{profile.fullName}</span><Check size={15} className="ml-auto shrink-0 text-emerald-600" /></div><div className="flex min-w-0 items-center gap-2"><Mail size={15} className="shrink-0 text-slate-400" /><span className="break-all">{profile.email}</span></div></div> : <p className="text-xs text-red-600">Sign in to continue with your saved customer details.</p>}</div>{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button onClick={createAttempt} disabled={loading || !profile || submitting} className="h-11 w-full rounded-xl bg-[#18201b] text-sm font-bold text-white disabled:opacity-50">{submitting ? "Creating order..." : "Continue"}</button></>}</section></main>
}
