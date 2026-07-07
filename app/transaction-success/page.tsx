"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft, Copy, Check } from "lucide-react"
import { ToastContainer, useToast } from "@/components/toast"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const [transaction, setTransaction] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toasts, showToast } = useToast()

  useEffect(() => {
    const transactionData = localStorage.getItem("lastTransaction")
    if (transactionData) {
      setTransaction(JSON.parse(transactionData))
    }
  }, [])

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    )
  }

  const formatAmount = (amount: string) => {
    if (amount.startsWith("₦")) return amount
    return `₦${amount}`
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      showToast(`${field} copied successfully.`)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const getRecipientInitial = () => {
    return transaction.recipientName?.charAt(0).toUpperCase() || "M"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Compact 60-64px */}
      <div className="flex items-center justify-between px-4 h-16" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.push("/dashboard")} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-base font-bold">Transaction Details</h1>
        <div className="w-5"></div>
      </div>

      <div className="px-4 py-3 max-w-md mx-auto">
        {/* Recipient Avatar */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: "#0000FF" }}>
            {getRecipientInitial()}
          </div>
        </div>

        {/* Recipient Info and Amount */}
        <div className="text-center mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Transfer to {transaction.recipientName || "Recipient"}
          </h2>
          <p className="text-2xl font-bold text-gray-900 mb-2">{formatAmount(transaction.amount)}</p>
          <p className="text-teal-600 font-semibold text-sm">Successful</p>
        </div>

        {/* Progress Timeline - Compact */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {/* Payment Successful */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-1" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-tight">Payment<br />successful</p>
            </div>

            {/* Line 1 */}
            <div className="flex-1 h-0.5 mx-1.5" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Processing */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-1" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-tight">Processing<br />by bank</p>
            </div>

            {/* Line 2 */}
            <div className="flex-1 h-0.5 mx-1.5" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Received */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-1" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-tight">Received<br />by bank</p>
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="bg-gray-100 rounded-lg p-2 mb-3 text-center">
          <p className="text-xs text-gray-700">
            The recipient account is expected to be credited within 5 minutes.
          </p>
        </div>

        {/* Transaction Receipt - Clean Banking Layout */}
        <div className="bg-white rounded-lg p-3 mb-3">
          <h3 className="text-xs font-bold text-gray-900 mb-2">Transaction Receipt</h3>
          
          {/* Receipt Rows */}
          <div className="space-y-2">
            {/* Name */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Name</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{transaction.recipientName || "---"}</span>
            </div>

            {/* Bank */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Bank</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{transaction.bankName || "---"}</span>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Account Number</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{transaction.accountNumber || "---"}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Amount</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{formatAmount(transaction.amount)}</span>
            </div>

            {/* Transaction ID with Copy */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 group">
              <span className="text-xs text-gray-600">Transaction ID</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900 text-right">{transaction.id || `TXN${Date.now()}`}</span>
                <button
                  onClick={() => handleCopy(transaction.id || `TXN${Date.now()}`, "Transaction ID")}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Copy Transaction ID"
                >
                  {copiedField === "Transaction ID" ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} className="text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Session ID with Copy - If available */}
            {transaction.sessionId && (
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 group">
                <span className="text-xs text-gray-600">Session ID</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-900 text-right">{transaction.sessionId}</span>
                  <button
                    onClick={() => handleCopy(transaction.sessionId, "Session ID")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Copy Session ID"
                  >
                    {copiedField === "Session ID" ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} className="text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Date</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{new Date(transaction.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Time</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{new Date(transaction.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-semibold text-teal-600">Successful</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Side by Side, Compact */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              const subject = "Report Issue - Transfer"
              const body = `Transaction ID: ${transaction.id}\n\nPlease describe your issue...`
              window.location.href = `mailto:support@bluepay.ng?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
            className="flex-1 h-12 rounded-2xl font-bold text-sm transition-colors"
            style={{ backgroundColor: "#E8F5E9", color: "#0000FF" }}
          >
            Report Issues
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 h-12 rounded-2xl text-white font-bold text-sm"
            style={{ backgroundColor: "#0000FF" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
