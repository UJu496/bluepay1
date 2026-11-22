"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Landmark, PencilLine } from "lucide-react"
import { getCurrentUserBankDetails, type UserBankDetails } from "@/lib/user-bank-details"

export default function BankDetailsPage() {
  const router = useRouter()
  const [details, setDetails] = useState<UserBankDetails | null>(null)
  const [accountVisible, setAccountVisible] = useState(false)

  useEffect(() => {
    setDetails(getCurrentUserBankDetails())
    const refresh = (event: StorageEvent) => {
      if (event.key === "userData") setDetails(getCurrentUserBankDetails())
    }
    window.addEventListener("storage", refresh)
    return () => window.removeEventListener("storage", refresh)
  }, [])

  const hasDetails = Boolean(details?.bankName || details?.accountNumber || details?.accountName)
  const accountNumber = details?.accountNumber || ""

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
        <button type="button" aria-label="Go back" onClick={() => router.push("/settings")} className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></button>
        <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Bank Account Details</h1></div>
      </header>
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
        <div className="rounded-2xl bg-[#101a43] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-blue-100"><Landmark size={19} /></div>
            <div><h2 className="text-sm font-semibold">Your linked account</h2><p className="text-[11px] text-blue-100">Used for bank transfers</p></div>
          </div>
        </div>
        {hasDetails ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <dl className="flex flex-col divide-y divide-slate-100">
              <div className="py-3 first:pt-0"><dt className="text-xs text-slate-500">Bank name</dt><dd className="mt-1 text-sm font-semibold text-[#172033]">{details?.bankName || "Not added"}</dd></div>
              <div className="flex items-center justify-between py-3"><div><dt className="text-xs text-slate-500">Account number</dt><dd className="mt-1 font-mono text-sm font-semibold text-[#172033]">{accountNumber ? accountVisible ? accountNumber : `••••••${accountNumber.slice(-4)}` : "Not added"}</dd></div>{accountNumber && <button type="button" onClick={() => setAccountVisible((visible) => !visible)} aria-label={accountVisible ? "Hide account number" : "Show account number"} className="rounded-lg p-2 text-slate-500 hover:bg-slate-50">{accountVisible ? <EyeOff size={17} /> : <Eye size={17} />}</button>}</div>
              <div className="py-3 last:pb-0"><dt className="text-xs text-slate-500">Account name</dt><dd className="mt-1 text-sm font-semibold text-[#172033]">{details?.accountName || "Not added"}</dd></div>
            </dl>
            <p className="mt-4 rounded-xl bg-blue-50 px-3 py-2.5 text-[11px] leading-relaxed text-[#344269]">Account details are saved to this device profile. BLUEPAY has not verified these details with a bank.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-blue-50 text-[#0000ff]"><Landmark size={20} /></div>
            <h2 className="text-sm font-semibold">No bank account added yet.</h2>
            <p className="mt-1 text-xs text-slate-500">Add a preferred bank account to use it on transfers.</p>
          </div>
        )}
        <button type="button" onClick={() => router.push("/bank-details/edit")} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0000ff] text-sm font-bold text-white shadow-sm hover:bg-blue-700"><PencilLine size={16} /> {hasDetails ? "CHANGE ACCOUNT DETAILS" : "+ ADD BANK ACCOUNT"}</button>
      </section>
    </main>
  )
}
