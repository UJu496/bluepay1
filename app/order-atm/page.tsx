"use client"

import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function OrderAtmPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="bg-blue-600 px-5 pb-7 pt-10 text-white">
        <button onClick={() => router.back()} className="mb-7 inline-flex items-center gap-2 text-sm font-medium" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-100">BLUEPAY MOBILE</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Order ATM card</h1>
        <p className="mt-2 max-w-sm text-sm text-blue-100">Get a secure BLUEPAY card for everyday payments and withdrawals.</p>
      </header>

      <section className="mx-auto max-w-lg space-y-4 px-5 py-6">
        {submitted ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h2 className="mt-4 text-xl font-bold">Request received</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Your ATM card request has been recorded. Our support team will contact you with the next steps.</p>
            <button onClick={() => router.push("/dashboard")} className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white">Back to dashboard</button>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><CreditCard className="h-6 w-6" /></div>
                <div><h2 className="font-bold">BLUEPAY ATM card</h2><p className="mt-1 text-sm leading-6 text-slate-600">Personalized card access with secure contactless payments.</p></div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-blue-600" /> Secure request and delivery support</div>
            </div>
            <button onClick={() => setSubmitted(true)} className="w-full rounded-2xl bg-blue-600 px-4 py-4 font-bold text-white shadow-sm transition hover:bg-blue-700">Request ATM card</button>
            <button onClick={() => router.push("/support")} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700">Contact support</button>
          </>
        )}
      </section>
    </main>
  )
}
