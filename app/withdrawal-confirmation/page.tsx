"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, Landmark } from "lucide-react"
import { useRouter } from "next/navigation"

type WithdrawalPreview = {
  accountName: string
  accountNumber: string
  selectedBank: string
  amount: number
}

export default function WithdrawalConfirmationPage() {
  const router = useRouter()
  const [preview, setPreview] = useState<WithdrawalPreview | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("withdrawalData")
      if (stored) setPreview(JSON.parse(stored) as WithdrawalPreview)
    } catch {
      setPreview(null)
    }
  }, [])

  const maskedAccount = preview ? `${preview.accountNumber.slice(0, 3)} •••• ${preview.accountNumber.slice(-2)}` : ""

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <header className="bg-[#0000ff] px-4 pb-5 pt-12 text-white">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button type="button" onClick={() => router.push("/withdraw")} aria-label="Back to destination form" className="rounded-full p-2 hover:bg-white/10"><ArrowLeft size={19} /></button>
          <div><p className="text-xs font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-lg font-semibold">Withdrawal review</h1></div>
        </div>
      </header>
      <section className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0000ff]">No payout submitted</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Transfers are disabled</h2>
          <p className="mt-1 text-sm text-slate-500">This screen cannot send money or debit a balance.</p>
        </div>
        {preview && (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0000ff]"><Landmark size={21} /></div>
              <div className="min-w-0"><p className="truncate font-semibold">{preview.accountName}</p><p className="truncate text-sm text-slate-500">{preview.selectedBank} · {maskedAccount}</p></div>
            </div>
            <p className="mt-4 text-sm text-slate-600">Amount preview: NGN {Number(preview.amount || 0).toLocaleString("en-NG")}</p>
          </div>
        )}
        <div role="alert" className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-950">
          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" size={18} />
          <p>BLUEPAY has no live payout connection on this flow. This is not a bank transfer confirmation. No funds have been sent or debited.</p>
        </div>
        <button type="button" onClick={() => router.replace("/withdraw")} className="h-12 rounded-xl bg-[#0000ff] text-sm font-semibold text-white">Return to destination form</button>
      </section>
    </main>
  )
}
