"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Clock3, LayoutDashboard, LifeBuoy, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

type Attempt = { id: string; reference?: string; createdAt?: string; status?: string; name?: string; email?: string; amount?: number | string; receiptName?: string | null; userId?: string }

export default function PaymentConfirmationPage() {
  const router = useRouter()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [message, setMessage] = useState("")
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("attemptId")
    const stored = id ? localStorage.getItem(`bluepayPaymentAttempt:${id}`) : localStorage.getItem("paymentAttempt")
    const value = stored ? JSON.parse(stored) : null
    const currentUser = JSON.parse(localStorage.getItem("userData") || "null")
    if (value && currentUser && (!value.userId || value.userId === currentUser.id || value.userId === currentUser.email)) setAttempt(value)
  }, [])
  if (!attempt) return <main className="grid min-h-screen place-items-center bg-[#f6f8fc] p-5 text-center text-sm text-slate-500">No saved payment review was found for this account.</main>
  const date = attempt.createdAt ? new Date(attempt.createdAt).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "Not recorded"
  const amount = formatCurrency(Number(String(attempt.amount).replace(/[^0-9.]/g, "")) || 0)
  function recheck() { setMessage("Automatic bank payment verification is unavailable. This attempt remains awaiting review.") }
  return <main className="min-h-screen bg-[#f6f8fc] text-slate-950"><header className="bg-[#0000ff] px-3 pb-3 pt-7 text-white"><div className="mx-auto flex max-w-lg items-center gap-2"><button onClick={() => router.back()} aria-label="Go back" className="rounded-full p-1.5"><ArrowLeft size={17} /></button><div><p className="text-[10px] text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Payment review</h1></div></div></header><section className="mx-auto max-w-lg space-y-2.5 px-3 py-3"><div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="flex items-center gap-2.5"><div className="rounded-lg bg-white p-2 text-amber-600"><Clock3 size={17} /></div><div><p className="text-xs font-semibold text-amber-950">Payment not confirmed</p><p className="text-[11px] text-amber-900">Your submission was recorded for review.</p></div></div></div><div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] text-slate-500">Amount</p><p className="text-xl font-bold">{amount}</p></div><span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">Awaiting review</span></div><div className="mt-3 space-y-2 border-t border-slate-100 pt-2 text-[11px]"><Row label="Name" value={attempt.name || "Not provided"} /><Row label="Email" value={attempt.email || "Not provided"} wrap /><Row label="Recorded" value={date} /><Row label="Reference" value={attempt.reference || "Unavailable"} wrap /><Row label="Receipt" value={attempt.receiptName ? "Attached locally" : "Not attached"} /></div></div><p className="rounded-lg bg-blue-50 px-3 py-2.5 text-[10px] leading-4 text-blue-950">BLUEPAY MOBILE has no automatic bank-payment verification. Keep your receipt and contact support for review. No BPC code is issued while payment remains unconfirmed.</p>{message && <p role="status" className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] text-slate-700">{message}</p>}<div className="grid grid-cols-3 gap-2"><button onClick={recheck} className="flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-[10px] font-semibold"><RefreshCw size={13} /> Recheck</button><button onClick={() => router.push("/support")} className="flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white text-[10px] font-semibold"><LifeBuoy size={13} /> Support</button><button onClick={() => router.push("/dashboard")} className="flex h-9 items-center justify-center gap-1 rounded-lg bg-[#0000ff] text-[10px] font-semibold text-white"><LayoutDashboard size={13} /> Dashboard</button></div></section></main>
}

function Row({ label, value, wrap = false }: { label: string; value: string; wrap?: boolean }) { return <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3"><span className="text-slate-500">{label}</span><span className={`min-w-0 text-right font-medium ${wrap ? "break-words [overflow-wrap:anywhere]" : ""}`}>{value}</span></div> }
