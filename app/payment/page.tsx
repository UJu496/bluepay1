"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, Building2, Check, Copy, FileText, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BLUEPAY_BPC_PURCHASE_AMOUNT } from "@/lib/bpc"

const ACCOUNT_NUMBER = "0150934472"
const ACCOUNT_NAME = "CH.. MA.."
const BANK_NAME = "Sterling Bank"
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"]
type Attempt = { id: string; userId?: string; reference: string; createdAt: string; status: string; name: string; email: string; amount: number | string; receiptName?: string | null }

export default function PaymentPage() {
  const router = useRouter()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [copied, setCopied] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("attemptId")
      const data = JSON.parse(localStorage.getItem("paymentData") || "null")
      const attemptId = id || data?.attemptId
      const saved = attemptId ? localStorage.getItem(`bluepayPaymentAttempt:${attemptId}`) : null
      const value = saved ? JSON.parse(saved) : null
      const profile = JSON.parse(localStorage.getItem("userData") || "null")
      if (value && profile && (!value.userId || value.userId === profile.id || value.userId === profile.email)) setAttempt(value)
    } catch {
      setError("Your saved payment attempt could not be loaded. Return to Buy BPC and try again.")
    }
  }, [])
  function chooseReceipt(event: React.ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; if (!ALLOWED_TYPES.includes(file.type)) return setError("Choose a PNG, JPG, JPEG, or PDF receipt."); if (file.size > 8 * 1024 * 1024) return setError("Receipt must be smaller than 8 MB."); setError(""); setReceipt(file) }
  async function copy(label: string, value: string) { await navigator.clipboard?.writeText(value); setCopied(label); window.setTimeout(() => setCopied(""), 1500) }
  function submitPayment() { if (!attempt || submitting) return; setSubmitting(true); const savedAttempt = { ...attempt, receiptName: receipt?.name || attempt.receiptName || null, receiptSubmittedAt: receipt ? new Date().toISOString() : null }; localStorage.setItem(`bluepayPaymentAttempt:${attempt.id}`, JSON.stringify(savedAttempt)); localStorage.setItem("paymentAttempt", JSON.stringify(savedAttempt)); router.push(`/payment-confirmation?attemptId=${attempt.id}`) }
  if (!attempt) return <main className="grid min-h-screen place-items-center bg-[#f5f7f4] p-5 text-center text-sm text-slate-500">Payment attempt unavailable. Return to Buy BPC and try again.</main>
  return <main className="min-h-screen bg-[#f5f7f4] text-[#17201b]"><header className="bg-[#0000ff] px-4 pb-3 pt-7 text-white"><div className="mx-auto flex max-w-lg items-center gap-2"><button onClick={() => router.back()} aria-label="Go back" className="rounded-full p-1.5"><ArrowLeft size={17} /></button><div><p className="text-[10px] uppercase tracking-wider text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Bank transfer</h1></div></div></header><section className="mx-auto max-w-lg space-y-3 px-3 py-3"><div className="flex gap-1.5"><span className="h-1.5 flex-1 rounded-full bg-emerald-500"/><span className="h-1.5 flex-1 rounded-full bg-emerald-500"/><span className="h-1.5 flex-1 rounded-full bg-slate-200"/></div>{!acknowledged && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3"><div className="flex gap-2.5"><Image src="/images/opay-logo.png" alt="OPay" width={38} height={38} className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1"/><div className="min-w-0"><div className="flex items-center gap-1.5 text-xs font-bold text-amber-950"><AlertTriangle size={15}/> OPay &amp; PalmPay</div><p className="mt-1 text-[10px] font-bold uppercase text-amber-950">Important payment notice</p><p className="mt-1.5 text-[11px] leading-4 text-amber-900">We are not accepting payments from OPay or PalmPay accounts. Use another supported traditional bank account.</p></div></div><button onClick={() => setAcknowledged(true)} className="mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#18201b] text-xs font-bold text-white">{"I WON'T USE OPAY"}<Check size={14}/></button></div>}<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800"><Building2 size={18}/></span><div><h2 className="text-sm font-bold">Bank Transfer Details</h2><p className="text-[10px] text-slate-500">Transfer exactly this amount</p></div></div><div className="space-y-2 text-xs"><Row label="Bank" value={BANK_NAME}/><Row label="Account name" value={ACCOUNT_NAME} copy={() => copy("name", ACCOUNT_NAME)}/><Row label="Account number" value={ACCOUNT_NUMBER} copy={() => copy("number", ACCOUNT_NUMBER)}/><Row label="Amount" value="₦10,750.00 NGN" copy={() => copy("amount", "₦10,750.00")}/></div>{copied && <p className="mt-2 text-[11px] font-semibold text-emerald-700">{copied === "number" ? "Account number" : copied === "name" ? "Account name" : "Amount"} copied</p>}</div><div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-xs leading-5 text-slate-600">Please transfer exactly <strong>₦10,750.00</strong> to the account details above. After completing the transfer, upload your payment receipt so BLUEPAY can verify your payment.</p><p className="mt-2 text-[11px] leading-4 text-amber-800"><strong>Important:</strong> A receipt does not automatically confirm payment or credit your BPC.</p><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3"><Upload size={17} className="text-[#0000ff]"/><span className="min-w-0 flex-1 text-xs font-semibold">{receipt?.name || "Upload receipt (optional)"}</span><input type="file" accept=".png,.jpg,.jpeg,.pdf" className="sr-only" onChange={chooseReceipt}/>{receipt && <button type="button" onClick={(event) => { event.preventDefault(); setReceipt(null) }} aria-label="Remove receipt"><X size={16}/></button>}</label>{error && <p role="alert" className="mt-2 text-[11px] text-red-600">{error}</p>}</div><button onClick={submitPayment} disabled={!acknowledged || submitting} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#18201b] text-sm font-bold text-white disabled:opacity-40">{submitting ? "Saving receipt..." : "I've made the transfer"}<FileText size={16}/></button></section></main>
}
function Row({ label, value, copy }: { label: string; value: string; copy?: () => void }) { return <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0"><span className="text-slate-500">{label}</span><span className="flex min-w-0 items-start gap-1 text-right font-semibold"><span className="break-words">{value}</span>{copy && <button type="button" onClick={copy} aria-label={`Copy ${label}`} className="shrink-0 text-[#0000ff]"><Copy size={14}/></button>}</span></div>}
