"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Clock3,
  Copy,
  Download,
  FileText,
  Receipt,
  RefreshCw,
  Share2,
  Wallet,
  XCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  formatTransactionCurrency,
  getTransactionById,
  getTransactionStatusPresentation,
  getTransactionTotalAmount,
  getTransactionTypeLabel,
  type Transaction,
  type TransactionStatusKey,
} from "@/lib/transactions"

export function TransactionDetails({ id, returnTo }: { id: string; returnTo: string | null }) {
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    const refreshTransaction = () => setTransaction(getTransactionById(id) || null)
    refreshTransaction()
    window.addEventListener("storage", refreshTransaction)
    window.addEventListener("bluepay:transactions-updated", refreshTransaction)
    return () => {
      window.removeEventListener("storage", refreshTransaction)
      window.removeEventListener("bluepay:transactions-updated", refreshTransaction)
    }
  }, [id])

  const goBack = () => {
    if (returnTo) {
      sessionStorage.setItem("bluepay:restore-transaction-list", "1")
      router.push(returnTo)
    } else {
      router.push("/transactions")
    }
  }

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setFeedback(`${label} copied`)
    } catch {
      setFeedback("Clipboard access is unavailable in this browser.")
    }
    window.setTimeout(() => setFeedback(""), 2400)
  }

  const downloadReceipt = () => {
    if (!transaction) return
    const blob = new Blob([buildReceiptHtml(transaction)], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    const safeId = transaction.id.replace(/[^a-zA-Z0-9_-]/g, "")
    anchor.download = `bluepay-receipt-${safeId || "transaction"}.html`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setFeedback("Receipt downloaded. Open it to print or save as PDF.")
    window.setTimeout(() => setFeedback(""), 3000)
  }

  const shareReceipt = async () => {
    if (!transaction) return
    const text = buildReceiptText(transaction)
    try {
      if (navigator.share) {
        await navigator.share({ title: "BLUEPAY transaction receipt", text })
        return
      }
      await navigator.clipboard.writeText(text)
      setFeedback("Receipt details copied and ready to share.")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return
      setFeedback("Sharing is unavailable. You can download the receipt instead.")
    }
    window.setTimeout(() => setFeedback(""), 2800)
  }

  if (!transaction) {
    return <main className="min-h-screen bg-[#f4f7fc] text-slate-950">
      <header className="bg-[#0000ff] px-4 pb-4 pt-7 text-white"><div className="mx-auto flex max-w-lg items-center gap-3"><button type="button" onClick={goBack} aria-label="Back to recent transactions" className="grid size-9 place-items-center rounded-full transition hover:bg-white/10"><ArrowLeft size={19} /></button><div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-blue-100">BLUEPAY MOBILE</p><h1 className="text-base font-bold">Transaction details</h1></div></div></header>
      <section className="mx-auto max-w-lg px-4 py-8"><div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"><div className="mx-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500"><FileText size={21} /></div><h2 className="mt-3 text-sm font-bold">Transaction not found</h2><p className="mt-1 text-xs leading-5 text-slate-500">This record is not available in the current transaction history.</p><button type="button" onClick={goBack} className="mt-4 rounded-lg bg-[#0000ff] px-4 py-2 text-xs font-semibold text-white">Back to transactions</button></div></section>
    </main>
  }

  const status = getTransactionStatusPresentation(transaction.status)
  const StatusIcon = getStatusIcon(status.key)
  const typeLabel = getTransactionTypeLabel(transaction)
  const statusColor = getStatusColor(status.key)
  const amountPrefix = transaction.type === "income" ? "+" : "−"
  const reference = typeof transaction.reference === "string" && transaction.reference.trim() ? transaction.reference : null

  return (
    <main className="min-h-screen bg-[#f4f7fc] pb-3 text-slate-950">
      <header className="bg-[#0000ff] px-3 py-2 text-white shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <button type="button" onClick={goBack} aria-label="Back to recent transactions" className="grid size-8 place-items-center rounded-full transition hover:bg-white/10"><ArrowLeft size={18} /></button>
          <div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100">BLUEPAY MOBILE</p><h1 className="truncate text-sm font-bold">Transaction details</h1></div>
        </div>
      </header>

      <section className="mx-auto flex max-w-lg flex-col gap-2 px-3 py-2">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-[#0000ff]" />
          <div className="px-3 py-2.5 text-center">
            <h2 className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Transaction summary</h2>
            <div className={`mx-auto grid size-8 place-items-center rounded-xl ${statusColor.icon}`}><StatusIcon size={18} aria-hidden="true" /></div>
            <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${statusColor.text}`}>{getStatusHeading(transaction.status, status.key)}</p>
            <p className={`mt-0.5 text-[24px] font-extrabold tracking-tight tabular-nums ${transaction.type === "income" ? "text-emerald-700" : "text-slate-950"}`}>{amountPrefix}{formatTransactionCurrency(Math.abs(transaction.amount))}</p>
            <p className="mx-auto max-w-sm truncate text-xs leading-4 text-slate-600">{transaction.description || typeLabel}</p>
            <p className="mt-1 text-[11px] text-slate-500">{formatTransactionDate(transaction)}{formatTransactionTime(transaction) ? ` · ${formatTransactionTime(transaction)}` : ""}</p>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <CompactSection icon={FileText} title="Transaction details" rows={[
            { label: "Type", value: typeLabel },
            { label: "Category", value: transaction.category || undefined },
            { label: "Transaction ID", value: transaction.id },
            { label: "BLUEPAY reference", value: reference || undefined },
            { label: "BLUEPAY tracking ID", value: typeof transaction.trackingId === "string" ? transaction.trackingId : undefined },
          ]} />
          {getRecipientRows(transaction, typeLabel).length > 0 && <CompactSection icon={ArrowUpRight} title="Recipient details" rows={getRecipientRows(transaction, typeLabel).map((row) => ({ label: row.label === "Full name" ? "Recipient" : row.label, value: row.value }))} />}
          <CompactSection icon={Wallet} title="Payment details" rows={[
            { label: "Transaction amount", value: formatTransactionCurrency(transaction.amount) },
            { label: "Transaction fee", value: formatOptionalMoney(transaction.fee) },
            { label: "Total amount debited", value: getTotalDebited(transaction) },
            { label: "Narration", value: stringValue(transaction.narration) || transaction.description || undefined },
          ]} />
          <details className="group border-t border-slate-100 pt-1.5">
            <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-xs font-bold text-[#0000ff]">More details<span className="text-[10px] text-slate-500 group-open:hidden">Show</span><span className="hidden text-[10px] text-slate-500 group-open:inline">Hide</span></summary>
            <CompactSection icon={ArrowDownRight} title="Sender details" rows={getSenderRows(transaction)} />
            <CompactSection icon={Clock3} title="Payment metadata" rows={[
              { label: "Date", value: formatTransactionDate(transaction) },
              { label: "Time", value: formatTransactionTime(transaction) || undefined },
              { label: "Payment method", value: stringValue(transaction.paymentMethod) },
              { label: "Channel", value: stringValue(transaction.channel) },
              { label: "Processing time", value: formatOptionalDateTime(transaction.processingAt) },
              { label: "Completion time", value: formatOptionalDateTime(transaction.completedAt) },
              { label: "BPC code", value: typeof transaction.bpcCode === "string" ? maskCode(transaction.bpcCode) : undefined },
            ]} />
            {getServiceRows(transaction).length > 0 && <CompactSection icon={Building2} title="Service details" rows={getServiceRows(transaction)} />}
            {getAdditionalRows(transaction).length > 0 && <CompactSection icon={Receipt} title="Additional information" rows={getAdditionalRows(transaction)} />}
          </details>
        </article>

        <div className="grid grid-cols-3 gap-1.5">
          <ActionButton icon={Download} label="Download receipt" onClick={downloadReceipt} />
          <ActionButton icon={Share2} label="Share receipt" onClick={shareReceipt} />
          <ActionButton icon={Copy} label="Copy reference" onClick={() => reference && void copyText(reference, "Transaction reference")} disabled={!reference} />
        </div>
        {feedback && <p role="status" aria-live="polite" className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5 text-center text-xs text-blue-900">{feedback}</p>}
        <p className="text-center text-[10px] leading-4 text-slate-500">Receipt reflects the saved BLUEPAY transaction record.</p>
      </section>
    </main>
  )
}

function CompactSection({ icon: Icon, title, rows }: { icon: LucideIcon; title: string; rows: Array<{ label: string; value?: string }> }) {
  if (!rows.some((row) => Boolean(row.value))) return null
  return <section className="border-b border-slate-100 py-1.5 last:border-b-0"><h2 className="mb-0.5 flex items-center gap-1.5 text-xs font-bold text-slate-900"><Icon size={13} aria-hidden="true" className="text-[#0000ff]" />{title}</h2><DetailRows rows={rows} /></section>
}

function DetailRows({ rows }: { rows: Array<{ label: string; value?: string }> }) {
  const visibleRows = rows.filter((row): row is { label: string; value: string } => Boolean(row.value))
  if (!visibleRows.length) return null
  return <dl className="flex flex-col divide-y divide-slate-100">
    {visibleRows.map((row) => <div key={row.label} className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 py-1 first:pt-0 last:pb-0"><dt className="text-xs leading-4 text-slate-500">{row.label}</dt><dd className="min-w-0 break-words text-right text-xs font-semibold leading-4 text-slate-800 [overflow-wrap:anywhere]">{row.value}</dd></div>)}
  </dl>
}

function ActionButton({ icon: Icon, label, onClick, disabled = false }: { icon: LucideIcon; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white px-1 py-1.5 text-center text-xs font-semibold leading-3 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0000ff] disabled:cursor-not-allowed disabled:opacity-50"><Icon size={14} aria-hidden="true" />{label}</button>
}

function getStatusIcon(key: TransactionStatusKey): LucideIcon {
  if (key === "successful" || key === "completed") return BadgeCheck
  if (key === "pending") return Clock3
  if (key === "failed") return XCircle
  if (key === "reversed") return RefreshCw
  return FileText
}

function getStatusColor(key: TransactionStatusKey) {
  if (key === "successful" || key === "completed") return { icon: "bg-emerald-100 text-emerald-700", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" }
  if (key === "pending") return { icon: "bg-amber-100 text-amber-700", text: "text-amber-800", badge: "bg-amber-50 text-amber-800", dot: "bg-amber-500" }
  if (key === "failed" || key === "reversed") return { icon: "bg-rose-100 text-rose-700", text: "text-rose-700", badge: "bg-rose-50 text-rose-700", dot: "bg-rose-500" }
  return { icon: "bg-slate-100 text-slate-600", text: "text-slate-600", badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" }
}

function getStatusHeading(status: string | undefined, key: TransactionStatusKey) {
  if (key === "successful") return "PAYMENT SUCCESSFUL"
  if (key === "pending") return status?.toLowerCase().includes("verification") || status?.toLowerCase().includes("review") ? "PAYMENT AWAITING REVIEW" : "PAYMENT PROCESSING"
  if (key === "failed") return "TRANSACTION FAILED"
  if (key === "reversed") return "TRANSACTION REVERSED"
  if (key === "completed") return "TRANSACTION COMPLETED"
  if (key === "other") return "TRANSACTION STATUS RECORDED"
  return "STATUS NOT RECORDED"
}

function getSenderRows(transaction: Transaction) {
  return [
    { label: "Name", value: stringValue(transaction.senderName) },
    { label: "BLUEPAY account", value: stringValue(transaction.senderAccountNumber) ? maskAccountNumber(String(transaction.senderAccountNumber)) : undefined },
    { label: "Sender bank", value: stringValue(transaction.senderBankName) },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
}

function getRecipientRows(transaction: Transaction, typeLabel: string) {
  const recipientName = stringValue(transaction.recipientName) || (typeLabel === "Bank transfer" ? stringValue(transaction.userName) : undefined)
  return [
    { label: "Full name", value: recipientName },
    { label: "Bank", value: stringValue(transaction.bankName) },
    { label: "Account number", value: stringValue(transaction.accountNumber) ? maskAccountNumber(String(transaction.accountNumber)) : undefined },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
}

function getServiceRows(transaction: Transaction) {
  return [
    { label: "Network", value: stringValue(transaction.network) },
    { label: "Phone number", value: stringValue(transaction.phoneNumber) ? maskPhoneNumber(String(transaction.phoneNumber)) : undefined },
    { label: "Plan", value: stringValue(transaction.plan) },
    { label: "Validity", value: stringValue(transaction.validity) },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value))
}

function getAdditionalRows(transaction: Transaction) {
  const known = new Set([
    "id", "type", "category", "description", "amount", "date", "timestamp", "createdAt", "status", "reference", "trackingId",
    "accountNumber", "bankName", "phoneNumber", "network", "userName", "recipientName", "senderName", "senderAccountNumber", "senderBankName",
    "fee", "totalAmountDebited", "paymentMethod", "narration", "channel", "processingAt", "completedAt", "bpcCode", "plan", "validity",
    "paymentAttemptId", "userId", "receiptName", "email", "name", "receiptSubmittedAt",
  ])
  return Object.entries(transaction as unknown as Record<string, unknown>)
    .filter(([key, value]) => !known.has(key) && !/(password|pin|secret|token)/i.test(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean") && value !== "")
    .map(([key, value]) => ({ label: humanize(key), value: String(value) }))
}

function getTotalDebited(transaction: Transaction) {
  const hasExplicitTotal = parseMoneyValue(transaction.totalAmountDebited) !== null
  const hasRecordedFee = transaction.type === "expense" && parseMoneyValue(transaction.fee) !== null
  return hasExplicitTotal || hasRecordedFee ? formatTransactionCurrency(getTransactionTotalAmount(transaction)) : undefined
}

function formatOptionalMoney(value: unknown) {
  const amount = parseMoneyValue(value)
  return amount === null ? undefined : formatTransactionCurrency(amount)
}

function parseMoneyValue(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null
  const normalized = typeof value === "string" ? value.replace(/[^\d.-]/g, "") : value
  if (normalized === "") return null
  const amount = Number(normalized)
  return Number.isFinite(amount) ? amount : null
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function maskAccountNumber(value: string) {
  const compact = value.replace(/\s/g, "")
  if (compact.length <= 4) return "••••"
  return `${compact.slice(0, 2)}••••${compact.slice(-2)}`
}

function maskPhoneNumber(value: string) {
  const compact = value.replace(/\s/g, "")
  if (compact.length <= 4) return "••••"
  return `${compact.slice(0, 3)}••••${compact.slice(-3)}`
}

function maskCode(value: string) {
  const compact = value.trim()
  return compact.length < 6 ? "••••" : `${compact.slice(0, 3)}••••${compact.slice(-3)}`
}

function humanize(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^\w/, (letter) => letter.toUpperCase())
}

function formatTransactionDate(transaction: Transaction) {
  const value = transaction.timestamp || transaction.createdAt || transaction.date
  if (!value) return "Date unavailable"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric" }).format(date)
}

function formatTransactionTime(transaction: Transaction) {
  const value = transaction.timestamp || transaction.createdAt
  return value ? formatOptionalDateTime(value, { hour: "2-digit", minute: "2-digit" }) : ""
}

function formatOptionalDateTime(value: unknown, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) {
  if (typeof value !== "string" || !value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : new Intl.DateTimeFormat("en-NG", options).format(date)
}

function getReceiptFields(transaction: Transaction) {
  const typeLabel = getTransactionTypeLabel(transaction)
  const rows = [
    { label: "Transaction type", value: typeLabel },
    { label: "Category", value: transaction.category },
    { label: "Description", value: transaction.description },
    { label: "Status", value: getTransactionStatusPresentation(transaction.status).label },
    { label: "Date", value: formatTransactionDate(transaction) },
    { label: "Time", value: formatTransactionTime(transaction) || undefined },
    { label: "Transaction ID", value: transaction.id },
    { label: "BLUEPAY reference", value: stringValue(transaction.reference) },
    { label: "BLUEPAY tracking ID", value: stringValue(transaction.trackingId) },
    { label: "Sender", value: stringValue(transaction.senderName) },
    { label: "Recipient", value: stringValue(transaction.recipientName) || (typeLabel === "Bank transfer" ? stringValue(transaction.userName) : undefined) },
    { label: "Bank", value: stringValue(transaction.bankName) },
    { label: "Account number", value: stringValue(transaction.accountNumber) ? maskAccountNumber(String(transaction.accountNumber)) : undefined },
    { label: "Phone number", value: stringValue(transaction.phoneNumber) ? maskPhoneNumber(String(transaction.phoneNumber)) : undefined },
    { label: "Network", value: stringValue(transaction.network) },
    { label: "Amount", value: formatTransactionCurrency(transaction.amount) },
    { label: "Fee", value: formatOptionalMoney(transaction.fee) },
    { label: "Total debited", value: getTotalDebited(transaction) },
    { label: "Payment method", value: stringValue(transaction.paymentMethod) },
    { label: "Narration", value: stringValue(transaction.narration) || transaction.description },
    { label: "Channel", value: stringValue(transaction.channel) },
    { label: "BPC code", value: typeof transaction.bpcCode === "string" ? maskCode(transaction.bpcCode) : undefined },
    { label: "Plan", value: stringValue(transaction.plan) },
    { label: "Validity", value: stringValue(transaction.validity) },
    { label: "Receipt", value: stringValue(transaction.receiptName) },
  ]
  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value))
}

function buildReceiptText(transaction: Transaction) {
  const status = getTransactionStatusPresentation(transaction.status)
  return [
    "BLUEPAY MOBILE",
    "BLUEPAY MOBILE TRANSACTION RECEIPT",
    "",
    `${getStatusHeading(transaction.status, status.key)} · ${status.label}`,
    `${transaction.type === "income" ? "+" : "−"}${formatTransactionCurrency(Math.abs(transaction.amount))}`,
    "",
    ...getReceiptFields(transaction).map((row) => `${row.label}: ${row.value}`),
    "",
    "BLUEPAY MOBILE · This receipt reflects the saved transaction record. It is not a bank confirmation.",
  ].join("\n")
}

function buildReceiptHtml(transaction: Transaction) {
  const status = getTransactionStatusPresentation(transaction.status)
  const rows = getReceiptFields(transaction).map((row) => `<div class="row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong></div>`).join("")
  const title = getStatusHeading(transaction.status, status.key)
  const amount = `${transaction.type === "income" ? "+" : "−"}${formatTransactionCurrency(Math.abs(transaction.amount))}`
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLUEPAY MOBILE Transaction Receipt</title><style>*{box-sizing:border-box}body{margin:0;background:#f1f5fb;color:#10203a;font-family:Arial,sans-serif;padding:32px 16px}.receipt{max-width:520px;margin:0 auto;background:#fff;border:1px solid #dce4ef;border-radius:22px;overflow:hidden;box-shadow:0 16px 44px rgba(15,35,68,.1)}.brand{height:7px;background:#0000ff}.content{padding:30px}.eyebrow{color:#0000ff;font-size:11px;font-weight:700;letter-spacing:2px}.title{margin:22px 0 8px;color:#0f172a;font-size:13px;letter-spacing:1px}.amount{margin:8px 0;font-size:34px;font-weight:800;letter-spacing:-1px}.status{display:inline-block;margin-top:8px;padding:7px 11px;border-radius:999px;background:#eff6ff;color:#1e40af;font-size:11px;font-weight:700}.divider{margin:22px 0;border:0;border-top:1px dashed #cbd5e1}.row{display:grid;grid-template-columns:40% 60%;gap:14px;border-bottom:1px solid #edf1f6;padding:11px 0;font-size:12px;line-height:1.5}.row span{color:#64748b}.row strong{text-align:right;overflow-wrap:anywhere;color:#1e293b}.note{margin-top:22px;color:#64748b;font-size:10px;line-height:1.6}@media print{body{padding:0;background:#fff}.receipt{max-width:none;border:0;box-shadow:none;border-radius:0}.content{padding:24px}}</style></head><body><main class="receipt"><div class="brand"></div><section class="content"><div class="eyebrow">BLUEPAY MOBILE</div><div class="title">${escapeHtml(title)}</div><div class="amount">${escapeHtml(amount)}</div><div class="status">${escapeHtml(status.label)}</div><hr class="divider">${rows}<p class="note">BLUEPAY MOBILE · This receipt reflects the saved transaction record. It is not a bank confirmation.</p></section></main></body></html>`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character)
}
