"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft, Phone, Wifi, Copy, Mail } from "lucide-react"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const [transaction, setTransaction] = useState<any>(null)
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRecipientInitial = () => {
    return transaction.recipientName?.charAt(0).toUpperCase() || "M"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-lg font-bold">Transaction Details</h1>
        <div className="w-6"></div>
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

        {/* Main Content - Left and Right Layout */}
        <div className="flex gap-3 mb-3">
          {/* Left Side - Recipient Details */}
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Recipient Details</p>
            <div className="bg-white rounded-lg p-2.5 mb-2">
              <p className="text-xs text-gray-600 mb-0.5">Name</p>
              <p className="text-sm font-semibold text-gray-900 break-words">{transaction.recipientName || "Recipient"}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 mb-2">
              <p className="text-xs text-gray-600 mb-0.5">Account Number</p>
              <p className="text-sm font-semibold text-gray-900">{transaction.accountNumber || "---"}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5">
              <p className="text-xs text-gray-600 mb-0.5">Amount</p>
              <p className="text-sm font-semibold text-gray-900">{formatAmount(transaction.amount)}</p>
            </div>
          </div>

          {/* Right Side - Transaction Details */}
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Transaction Details</p>
            <div className="bg-white rounded-lg p-2.5 mb-2">
              <p className="text-xs text-gray-600 mb-0.5">Bank</p>
              <p className="text-sm font-semibold text-gray-900">{transaction.bankName || "---"}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 mb-2">
              <p className="text-xs text-gray-600 mb-0.5">Transaction No.</p>
              <p className="text-xs font-semibold text-gray-900 break-all">{transaction.id || `TXN${Date.now()}`}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5">
              <p className="text-xs text-gray-600 mb-0.5">Date</p>
              <p className="text-xs font-semibold text-gray-900">{new Date(transaction.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Side by Side */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-2 rounded-full text-white font-bold text-xs"
            style={{ backgroundColor: "#0000FF" }}
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => {
              const subject = "Report Issue - Transaction"
              const body = `Transaction ID: ${transaction.id}\n\nPlease describe your issue...`
              window.location.href = `mailto:bluepay032@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
            className="flex-1 py-2 rounded-full font-bold text-xs transition-colors"
            style={{ backgroundColor: "#E8F5E9", color: "#0000FF" }}
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  )
}
