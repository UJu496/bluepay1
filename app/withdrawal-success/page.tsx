"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft, Landmark } from "lucide-react"

export default function WithdrawalSuccessPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <header className="bg-[#0000ff] px-4 pb-5 pt-12 text-white">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button type="button" onClick={() => router.push("/dashboard")} aria-label="Back to dashboard" className="rounded-full p-2 hover:bg-white/10"><ArrowLeft size={19} /></button>
          <div><p className="text-xs font-medium text-blue-100">BLUEPAY MOBILE</p><h1 className="text-lg font-semibold">Payout status</h1></div>
        </div>
      </header>
      <section className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-6">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><Landmark size={25} /></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Not sent</p><h2 className="mt-1 text-2xl font-bold tracking-tight">No bank payout was made</h2><p className="mt-2 text-sm leading-6 text-slate-600">The current BLUEPAY withdrawal flow is destination-form only. A local status or saved preview is not proof of a bank transfer.</p></div>
        <div role="alert" className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-950"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" size={18} /><p>No payout provider is connected. No funds were sent or debited by this screen.</p></div>
        <button type="button" onClick={() => router.replace("/withdraw")} className="h-12 rounded-xl bg-[#0000ff] text-sm font-semibold text-white">Return to destination form</button>
        <button type="button" onClick={() => router.push("/dashboard")} className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700">Go to dashboard</button>
      </section>
    </main>
  )
}
