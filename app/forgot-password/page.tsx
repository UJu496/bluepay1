import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fc] text-[#172033]">
      <header className="flex h-16 items-center gap-3 bg-[#0000ff] px-4 text-white shadow-sm">
        <Link href="/login" aria-label="Back to login" className="rounded-full p-2 hover:bg-white/15"><ArrowLeft size={19} /></Link>
        <div><p className="text-[10px] font-medium tracking-wide text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-semibold">Account password help</h1></div>
      </header>
      <section className="mx-auto w-full max-w-md p-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-[#344269]"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0000ff]" /><p>Account password resets are not enabled yet. This page will not read or change browser-stored account data.</p></div>
          <p className="text-sm leading-relaxed text-slate-600">Contact BLUEPAY support for account password assistance. PIN recovery is available separately and requires your full name, registered email, and account password.</p>
          <Link href="/support" className="flex h-11 items-center justify-center rounded-xl bg-[#0000ff] text-sm font-bold text-white">Contact support</Link>
          <Link href="/login" className="text-center text-xs font-semibold text-[#0000ff] underline underline-offset-4">Return to login</Link>
        </div>
      </section>
    </main>
  )
}
