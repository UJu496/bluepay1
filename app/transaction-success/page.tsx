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

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Recipient Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: "#0000FF" }}>
            {getRecipientInitial()}
          </div>
        </div>

        {/* Recipient Info and Amount */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Transfer to {transaction.recipientName || "Recipient"}
          </h2>
          <p className="text-3xl font-bold text-gray-900 mb-3">{formatAmount(transaction.amount)}</p>
          <p className="text-teal-600 font-semibold">Successful</p>
        </div>

        {/* Progress Timeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* Payment Successful */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-2" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">Payment<br />successful</p>
              <p className="text-xs text-gray-600 mt-1">{new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Line 1 */}
            <div className="flex-1 h-0.5 mx-2 mt-2" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Processing */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-2" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">Processing<br />by bank</p>
              <p className="text-xs text-gray-600 mt-1">{new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            {/* Line 2 */}
            <div className="flex-1 h-0.5 mx-2 mt-2" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Received */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-2" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">Received<br />by bank</p>
              <p className="text-xs text-gray-600 mt-1">{new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 text-center">
          <p className="text-sm text-gray-700">
            The recipient account is expected to be credited within 5 minutes, subject to notification by the bank.
          </p>
        </div>

        {/* Transaction Details Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Transaction Details</h3>

          {/* Recipient Details */}
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Recipient Details</p>
            <p className="text-sm font-semibold text-gray-900">{transaction.recipientName || "Recipient"}</p>
            <p className="text-sm text-gray-600">{transaction.accountNumber || "Account"} | {transaction.bankName || "Bank"}</p>
          </div>

          {/* Transaction No */}
          <div className="bg-white rounded-lg p-3 mb-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Transaction No.</p>
              <p className="text-sm font-semibold text-gray-900 break-all">{transaction.id || `TXN${Date.now()}`}</p>
            </div>
            <button
              onClick={() => copyToClipboard(transaction.id || `TXN${Date.now()}`)}
              className="ml-2 p-2 hover:bg-gray-100 rounded"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Payment Method</p>
            <p className="text-sm font-semibold text-gray-900">{transaction.paymentMethod || "OWealth"}</p>
          </div>

          {/* Transaction Date */}
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Transaction Date</p>
            <p className="text-sm font-semibold text-gray-900">{new Date(transaction.timestamp).toLocaleString()}</p>
          </div>

          {/* Session ID */}
          <div className="bg-white rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Session ID</p>
              <p className="text-sm font-semibold text-gray-900 break-all">{transaction.sessionId || `SID${Date.now()}`}</p>
            </div>
            <button
              onClick={() => copyToClipboard(transaction.sessionId || `SID${Date.now()}`)}
              className="ml-2 p-2 hover:bg-gray-100 rounded"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              const subject = "Report Issue - Transaction"
              const body = `Transaction ID: ${transaction.id}\n\nPlease describe your issue...`
              window.location.href = `mailto:bluepay032@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
            className="w-full py-3 rounded-full font-bold text-base transition-colors"
            style={{ backgroundColor: "#E8F5E9", color: "#0000FF" }}
          >
            Report Issue
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-full text-white font-bold text-base"
            style={{ backgroundColor: "#0000FF" }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-gray-700">
            Need help? <a href="mailto:bluepay032@gmail.com" className="font-semibold" style={{ color: "#0000FF" }}>Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
