'use client'

import { useEffect } from 'react'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function PaymentConfirmationError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Payment confirmation failed to render')
  }, [])

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f8fc] p-5 text-center text-slate-950">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-lg font-bold">Payment review could not load</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your payment information is safe. Try loading this page again or return to the payment page.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0000ff] px-4 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/payment"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Return to payment
          </Link>
        </div>
      </section>
    </main>
  )
}
