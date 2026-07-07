"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, ArrowLeft, Copy, Check } from "lucide-react"
import { ToastContainer, useToast } from "@/components/toast"

export default function WithdrawalSuccessPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [withdrawalData, setWithdrawalData] = useState<any>(null)
  const [transactionId, setTransactionId] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toasts, showToast } = useToast()

  useEffect(() => {
    const data = localStorage.getItem("withdrawalData")
    if (data) {
      const parsedData = JSON.parse(data)
      setAmount(parsedData.amount.toLocaleString())
      setWithdrawalData(parsedData)

      const transId = `TXN${Date.now()}`
      const sessId = `SID${Date.now()}`
      setTransactionId(transId)
      setSessionId(sessId)

      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const withdrawalTransaction = {
        id: transId,
        amount: parsedData.amount,
        userName: userData.fullName || "User",
        bank: parsedData.selectedBank,
        accountName: parsedData.accountName,
        accountNumber: parsedData.accountNumber,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: "Successful",
      }

      // Store in withdrawal history
      const existingHistory = JSON.parse(localStorage.getItem("withdrawalHistory") || "[]")
      existingHistory.unshift(withdrawalTransaction)
      localStorage.setItem("withdrawalHistory", JSON.stringify(existingHistory))

      localStorage.setItem("withdrawalSuccess", "true")
      localStorage.removeItem("withdrawalData")
    }
  }, [])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      showToast(`${field} copied successfully.`)
      setTimeout(() => setCopiedField(null), 2000)
    })
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
        {/* Success Icon - Reduced by 30% */}
        <div className="flex justify-center mb-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "#0000FF" }}>
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Status and Amount - Compact */}
        <div className="text-center mb-3">
          <h2 className="text-base font-bold text-gray-900 mb-1">Transfer to {withdrawalData?.selectedBank}</h2>
          <p className="text-2xl font-bold text-gray-900 mb-1">₦{amount}</p>
          <p className="text-teal-600 font-semibold text-sm">Successful</p>
        </div>

        {/* Progress Timeline - Compact */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            {/* Withdrawal Initiated */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-1" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-tight">Withdrawal<br />initiated</p>
            </div>

            {/* Line 1 */}
            <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Processing by Bank */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-1" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-tight">Processing<br />by bank</p>
            </div>

            {/* Line 2 */}
            <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Completed in Account */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white mb-1" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-tight">Completed<br />in account</p>
            </div>
          </div>
        </div>

        {/* Info Message - Reduced font and line height */}
        <div className="bg-gray-100 rounded-lg p-3 mb-3 text-center">
          <p className="text-xs text-gray-700 leading-snug">
            Your withdrawal has been processed successfully and will be reflected in your account shortly.
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
              <span className="text-xs font-semibold text-gray-900 text-right">{withdrawalData?.accountName}</span>
            </div>

            {/* Bank */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Bank</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{withdrawalData?.selectedBank}</span>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Account Number</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{withdrawalData?.accountNumber}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Amount</span>
              <span className="text-xs font-semibold text-gray-900 text-right">₦{amount}</span>
            </div>

            {/* Transaction ID with Copy */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 group">
              <span className="text-xs text-gray-600">Transaction ID</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900 text-right">{transactionId}</span>
                <button
                  onClick={() => handleCopy(transactionId, "Transaction ID")}
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

            {/* Session ID with Copy */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 group">
              <span className="text-xs text-gray-600">Session ID</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900 text-right">{sessionId}</span>
                <button
                  onClick={() => handleCopy(sessionId, "Session ID")}
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

            {/* Date */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Date</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Time</span>
              <span className="text-xs font-semibold text-gray-900 text-right">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
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
              const subject = "Report Issue - Withdrawal"
              const body = `Transaction ID: ${transactionId}\n\nPlease describe your issue...`
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
