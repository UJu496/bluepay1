"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, Check, Copy, FileText, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const ACCOUNT_NUMBER = "6711230988"
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"]

type Attempt = { id: string; userId?: string; reference: string; createdAt: string; status: string; name: string; email: string; amount: number | string; receiptName?: string | null }

export default function PaymentPage() {
  const router = useRouter()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("attemptId")
    const data = JSON.parse(localStorage.getItem("paymentData") || "null")
    const saved = id || data?.attemptId ? localStorage.getItem(`bluepayPaymentAttempt:${id || data.attemptId}`) : null
    const value = saved ? JSON.parse(saved) : null
    const profile = JSON.parse(localStorage.getItem("userData") || "null")
    if (value && profile && (!value.userId || value.userId === profile.id || value.userId === profile.email)) setAttempt(value)
  }, [])

  function chooseReceipt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) return setError("Choose a PNG, JPG, JPEG, or PDF receipt.")
    if (file.size > 8 * 1024 * 1024) return setError("Receipt must be smaller than 8 MB.")
    setError("")
    setReceipt(file)
  }

  async function copyAccount() {
    await navigator.clipboard?.writeText(ACCOUNT_NUMBER)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function submitPayment() {
    if (!attempt || submitting) return
    setSubmitting(true)
    const savedAttempt = { ...attempt, receiptName: receipt?.name || attempt.receiptName || null }
    localStorage.setItem(`bluepayPaymentAttempt:${attempt.id}`, JSON.stringify(savedAttempt))
    localStorage.setItem("paymentAttempt", JSON.stringify(savedAttempt))
    router.push(`/payment-confirmation?attemptId=${attempt.id}`)
  }

  if (!attempt) return <main className="grid min-h-screen place-items-center bg-[#f6f8fc] p-5 text-center text-sm text-slate-500">Payment attempt unavailable. Return to Buy BPC Code and try again.</main>
  const amount = Number(String(attempt.amount).replace(/[^0-9.]/g, "")) || 0
  return <main className="min-h-screen bg-[#f6f8fc] text-slate-950"><header className="bg-[#0000ff] px-4 pb-3 pt-7 text-white"><div className="mx-auto flex max-w-lg items-center gap-2"><button onClick={() => router.back()} aria-label="Go back" className="rounded-full p-1.5"><ArrowLeft size={17} /></button><div><p className="text-[10px] text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Payment details</h1></div></div></header><section className="mx-auto max-w-lg space-y-2.5 px-3 py-3"><div className="flex items-center justify-between text-[10px] font-semibold text-slate-500"><span className="text-[#0000ff]">01 Details</span><span>02 Review</span><span>03 Status</span></div>{!acknowledged ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="flex gap-2.5"><Image src="/images/opay-logo.png" alt="OPay" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1" /><div className="min-w-0"><div className="flex items-center gap-1.5 text-xs font-bold text-amber-950"><AlertTriangle size={15} /> OPay &amp; PalmPay</div><p className="mt-1 text-[10px] font-bold uppercase text-amber-950">Important payment notice</p><p className="mt-1.5 text-[11px] leading-4 text-amber-900">We are <strong>NOT accepting payments from OPay or PalmPay accounts.</strong> Use another supported traditional bank account. These payments cannot be verified through the current process.</p><p className="mt-1 text-[11px] leading-4 text-amber-900"><strong>Tip:</strong> Use your usual withdrawal bank account where appropriate and keep your receipt.</p></div></div><button onClick={() => setAcknowledged(true)} className="mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0000ff] text-xs font-semibold text-white">{"I WON'T USE OPAY"}<Check size={14} /></button></div> : <><div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-[10px] text-slate-500">Account details</p><p className="text-xs font-semibold">MONIEPOINT MFB</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-[#0000ff]">Manual review</span></div><div className="mt-2 space-y-1.5 border-t border-slate-100 pt-2 text-[11px]"><div className="flex justify-between gap-3"><span className="text-slate-500">Account number</span><span className="flex items-center gap-1 font-bold tracking-wide">{ACCOUNT_NUMBER}<button onClick={copyAccount} aria-label="Copy account number" className="text-[#0000ff]"><Copy size={13} /></button></span></div><div className="flex justify-between gap-3"><span className="text-slate-500">Account name</span><span className="max-w-[62%] text-right font-semibold">MOD... CH... AGB (BLUEPAY2026 Agent)</span></div></div>{copied && <p className="mt-1 text-[10px] text-emerald-600">Account number copied.</p>}</div><div className="rounded-xl border border-dashed border-slate-300 bg-white p-3"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold">Payment receipt</p><p className="text-[10px] text-slate-500">Optional · PNG, JPG, JPEG, or PDF</p></div><FileText size={16} className="text-[#0000ff]" /></div>{receipt ? <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2 text-[11px]"><span className="min-w-0 truncate">{receipt.name}</span><button onClick={() => setReceipt(null)} aria-label="Remove receipt" className="ml-2 text-slate-500"><X size={14} /></button></div> : <label className="mt-2 flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-50 text-[11px] font-semibold text-[#0000ff]"><Upload size={14} /> Click to upload receipt<input type="file" accept=".png,.jpg,.jpeg,.pdf" className="sr-only" onChange={chooseReceipt} /></label>}</div><div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] leading-4 text-blue-950">Payment attempt <strong>{attempt.reference}</strong> is recorded for review. Uploading a receipt or tapping the button does not confirm payment.</div>{error && <p role="alert" className="rounded-lg bg-red-50 px-2.5 py-2 text-[11px] text-red-700">{error}</p>}<button onClick={submitPayment} disabled={submitting} className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0000ff] text-xs font-semibold text-white disabled:opacity-50">{submitting ? "Saving payment attempt..." : "I'VE MADE PAYMENT"}</button></>}</section></main>
}

export const formatAmount = (value: string | number) => `₦${(Number(String(value).replace(/[^0-9.]/g, "")) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
