"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Info, LineChart, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const PRICE = 525
const MIN_SHARES = 10
const heroImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260918-101548_1.png-OEqXaHjaQy21jnB5D7tfDnE7oEBAhQ.jpeg"

const steps = ["Overview", "Calculator", "Get ready", "Channels", "Status", "My investments"]
const statusOptions = ["Not Started", "Application Started", "Submitted", "Pending Allotment", "Allotted", "Partially Allotted", "Not Allotted"]

export default function DangoteIpoPage() {
  const [step, setStep] = useState(0)
  const [shares, setShares] = useState(MIN_SHARES)
  const amount = Math.max(MIN_SHARES, shares || MIN_SHARES) * PRICE

  const goNext = () => setStep((current) => Math.min(steps.length - 1, current + 1))
  const goBack = () => setStep((current) => Math.max(0, current - 1))

  return (
    <main className="min-h-screen bg-slate-50 pb-10 text-slate-950">
      <header className="bg-[#151e68] px-5 pb-7 pt-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" aria-label="Back to dashboard" className="rounded-full p-2 hover:bg-white/10"><ArrowLeft /></Link>
          <div className="flex items-center gap-2 text-sm font-semibold"><LineChart className="text-cyan-300" /> BLUEPAY INVESTMENTS</div>
          <span className="w-10" />
        </div>
        <div className="mx-auto mt-8 max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Information & routing</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Dangote IPO</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">Explore the public offer details, estimate your subscription, and continue through an approved subscription channel.</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-5">
        <div className="flex gap-2 overflow-x-auto pb-3" aria-label="IPO steps">
          {steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition ${index === step ? "bg-[#151e68] text-white" : "bg-white text-slate-500 shadow-sm"}`}>{index + 1}. {label}</button>)}
        </div>

        {step === 0 && <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <Card className="overflow-hidden border-0 shadow-sm">
            <div className="relative h-48 bg-[#101b55]"><Image src={heroImage} alt="Dangote Petroleum Refinery IPO offer artwork" fill className="object-cover object-top opacity-70" unoptimized /></div>
            <CardHeader><Badge className="w-fit bg-red-600">Initial Public Offer</Badge><CardTitle className="text-2xl">Dangote Petroleum Refinery &amp; Petrochemicals FZE</CardTitle><CardDescription>Offer window: 14 September – 13 October 2026</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-4"><div className="grid grid-cols-2 gap-3"><Metric label="Price per share" value="₦525" /><Metric label="Minimum subscription" value="10 shares" /><Metric label="Minimum investment" value="₦5,250" /><Metric label="Closes" value="13 Oct 2026" /></div><div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><Info className="mr-2 inline size-4" /> Investments carry risk. The value of investments can rise or fall and you may lose money. Read the approved prospectus before subscribing.</div><p className="text-xs leading-5 text-slate-500">BLUEPAY provides information and routing only. BLUEPAY is not an approved Receiving Agent and does not process IPO subscriptions, payments, allotments, or application status.</p><Button variant="outline" onClick={() => setStep(3)}><FileText data-icon="inline-start" /> Read Prospectus</Button><Button onClick={goNext} className="bg-red-600 hover:bg-red-700">Subscribe <ArrowRight data-icon="inline-end" /></Button></CardContent>
          </Card>
          <Card className="border-0 shadow-sm"><CardHeader><CardTitle>Before you subscribe</CardTitle><CardDescription>Understand the offer and use an authorised channel.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><Note icon={<ShieldCheck />} text="Review the approved prospectus and offer terms." /><Note icon={<ExternalLink />} text="Subscriptions are completed outside BLUEPAY." /><Note icon={<Info />} text="No sensitive information is collected here." /></CardContent></Card>
        </section>}

        {step === 1 && <Card className="mx-auto max-w-2xl border-0 shadow-sm"><CardHeader><Badge className="w-fit bg-cyan-600">Step 2</Badge><CardTitle>Investment calculator</CardTitle><CardDescription>Estimate the subscription amount. Minimum is 10 shares.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6"><label className="text-sm font-semibold" htmlFor="shares">Number of shares</label><Input id="shares" type="number" min={MIN_SHARES} step="1" value={shares} onChange={(event) => setShares(Math.max(MIN_SHARES, Number(event.target.value) || MIN_SHARES))} className="h-14 text-2xl font-bold" /><div className="rounded-2xl bg-[#151e68] p-6 text-white"><p className="text-sm text-blue-200">Estimated total subscription</p><p className="mt-1 text-4xl font-bold">₦{amount.toLocaleString()}</p><p className="mt-2 text-sm text-blue-200">{Math.max(MIN_SHARES, shares)} shares × ₦525</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[10, 20, 50, 100].map((value) => <button key={value} onClick={() => setShares(value)} className="rounded-xl border bg-white p-3 text-left text-sm hover:border-blue-500"><b>{value}</b><span className="block text-slate-500">₦{(value * PRICE).toLocaleString()}</span></button>)}</div><Button onClick={goNext}>Continue to checklist <ArrowRight data-icon="inline-end" /></Button></CardContent></Card>}

        {step === 2 && <Checklist onNext={goNext} />}
        {step === 3 && <Channels onNext={goNext} />}
        {step === 4 && <StatusView />}
        {step === 5 && <Portfolio />}

        {step > 0 && <Button variant="ghost" onClick={goBack} className="mt-4"><ArrowLeft data-icon="inline-start" /> Back</Button>}
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></div> }
function Note({ icon, text }: { icon: ReactNode; text: string }) { return <div className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6"><span className="text-blue-700">{icon}</span><span>{text}</span></div> }
type ReadyForm = {
  name: string
  dob: string
  phone: string
  email: string
  address: string
  idType: string
  idNumber: string
  cscs: string
  broker: string
}

function Checklist({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState<ReadyForm>({ name: "", dob: "", phone: "", email: "", address: "", idType: "", idNumber: "", cscs: "", broker: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof ReadyForm, string>>>({})

  const update = (field: keyof ReadyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof ReadyForm, string>> = {}
    const cleanName = form.name.trim()
    const cleanEmail = form.email.trim()
    const cleanPhone = form.phone.trim()
    const cleanAddress = form.address.trim()
    const cleanId = form.idNumber.trim()
    if (!cleanName) nextErrors.name = "Enter your full legal name."
    if (!form.dob) nextErrors.dob = "Enter your date of birth."
    if (!/^((\\+234|0)\\d{10})$/.test(cleanPhone.replace(/[\\s-]/g, ""))) nextErrors.phone = "Enter a valid Nigerian phone number, for example 08012345678."
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail)) nextErrors.email = "Enter a valid email address."
    if (!cleanAddress) nextErrors.address = "Enter your residential address."
    if (!form.idType) nextErrors.idType = "Select an identification type."
    if (!cleanId) nextErrors.idNumber = "Enter your identification number."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onNext()
  }

  return <Card className="mx-auto max-w-2xl border-0 shadow-sm"><CardHeader><Badge className="w-fit bg-cyan-600">Step 3</Badge><CardTitle>Get your details ready</CardTitle><CardDescription>Prepare the information required by your selected approved subscription channel. Make sure all details match your official records.</CardDescription></CardHeader><CardContent className="flex flex-col gap-6">
    <FormSection title="Personal information" description="These details help you prepare for the approved channel.">
      <Field label="Full Legal Name" error={errors.name}><Input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="As shown on your official records" aria-invalid={Boolean(errors.name)} /></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Date of Birth" error={errors.dob}><Input type="date" value={form.dob} onChange={(event) => update("dob", event.target.value)} aria-invalid={Boolean(errors.dob)} /></Field><Field label="Phone Number" error={errors.phone}><Input type="tel" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/[^0-9+\\s-]/g, ""))} placeholder="08012345678" aria-invalid={Boolean(errors.phone)} /></Field></div>
      <Field label="Email Address" error={errors.email}><Input type="email" value={form.email} onChange={(event) => update("email", event.target.value.trimStart())} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} /></Field><Field label="Residential Address" error={errors.address}><Input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Your current residential address" aria-invalid={Boolean(errors.address)} /></Field>
    </FormSection>
    <FormSection title="Identification / KYC" description="Provide this only through an approved subscription channel when required.">
      <Field label="Identification Type" error={errors.idType}><select value={form.idType} onChange={(event) => update("idType", event.target.value)} aria-invalid={Boolean(errors.idType)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select identification type</option><option>National ID</option><option>International Passport</option><option>Driver's Licence</option><option>Voter's Card</option></select></Field><Field label="Identification Number" error={errors.idNumber}><Input value={form.idNumber} onChange={(event) => update("idNumber", event.target.value.replace(/[^a-zA-Z0-9-]/g, ""))} placeholder="Enter only when required" aria-invalid={Boolean(errors.idNumber)} /></Field><p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">Only provide identification information through an approved subscription channel when required. Do not share sensitive identification information with anyone through WhatsApp, Telegram, social media, or unofficial links.</p>
    </FormSection>
    <FormSection title="Bank information" description="Bank information may be required by your approved subscription channel."><p className="text-sm leading-6 text-slate-600">BLUEPAY does not collect bank details here. Never provide bank PINs, passwords, OTPs, card PINs, or online-banking login information.</p></FormSection>
    <FormSection title="Investor / CSCS information" description="Exact requirements may depend on your approved subscription channel."><Field label="CSCS Investor Account / Clearing Information"><Input value={form.cscs} onChange={(event) => update("cscs", event.target.value)} placeholder="Optional preparation note" /></Field><Field label="Existing Investor / Broker Information"><Input value={form.broker} onChange={(event) => update("broker", event.target.value)} placeholder="Optional preparation note" /></Field></FormSection>
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-950"><ShieldCheck className="mr-2 inline size-4" /> Verify the authenticity of the subscription channel before entering personal or financial information. BLUEPAY does not receive IPO subscription funds here. Complete your subscription only through an approved subscription channel.</div><Button type="button" onClick={validate} className="bg-red-600 hover:bg-red-700">Continue to approved channel <ArrowRight data-icon="inline-end" /></Button>
  </CardContent></Card>
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) { return <section className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:p-5"><div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>{children}</section> }
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">{label}<span className="text-xs font-normal text-slate-500">Required</span>{children}{error && <span className="text-xs font-medium text-red-600" role="alert">{error}</span>}</label> }
function Channels({ onNext }: { onNext: () => void }) { return <Card className="mx-auto max-w-2xl border-0 shadow-sm"><CardHeader><Badge className="w-fit bg-cyan-600">Step 4</Badge><CardTitle>Approved subscription channels</CardTitle><CardDescription>Use the channels listed in the current approved prospectus. Confirm the receiving agent before sharing information or funds.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><ShieldCheck className="mr-2 inline size-4" /> BLUEPAY is not a Receiving Agent. This button is a routing placeholder until an authorised provider URL is configured.</div><Button variant="outline" disabled><ExternalLink data-icon="inline-start" /> Official channel unavailable</Button><p className="text-xs text-slate-500">No subscription, payment, or application is created by this screen.</p><Button onClick={onNext}>View application status <ArrowRight data-icon="inline-end" /></Button></CardContent></Card> }
function StatusView() { return <Card className="mx-auto max-w-2xl border-0 shadow-sm"><CardHeader><Badge className="w-fit bg-cyan-600">Step 5</Badge><CardTitle>Application status</CardTitle><CardDescription>Status is unavailable until a verified backend or authorised integration is connected.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3"><div className="rounded-2xl bg-slate-50 p-5 text-center"><p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Current verified status</p><p className="mt-2 text-2xl font-bold">Not available</p><p className="mt-2 text-sm text-slate-500">No status data has been received.</p></div>{statusOptions.map((option) => <div key={option} className="flex items-center justify-between rounded-xl border bg-white p-3 text-sm"><span>{option}</span><Badge variant="outline">Unavailable</Badge></div>)}</CardContent></Card> }
function Portfolio() { return <Card className="mx-auto max-w-2xl border-0 shadow-sm"><CardHeader><Badge className="w-fit bg-cyan-600">Step 6</Badge><CardTitle>My investments</CardTitle><CardDescription>Holdings will appear here only after verified portfolio data is available.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 gap-3">{["Shares allotted", "Acquisition price", "Total invested", "Current market value", "Gain/loss"].map((label) => <Metric key={label} label={label} value="—" />)}</div><p className="mt-4 text-xs leading-5 text-slate-500">No portfolio values are fabricated. Connect an authorised capital-market provider before displaying investment data.</p></CardContent></Card> }
