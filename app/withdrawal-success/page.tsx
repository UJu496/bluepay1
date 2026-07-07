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
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      {/* Header - 56px */}
      <div className="flex items-center justify-between px-4 h-14" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.push("/dashboard")} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-sm font-bold">Transaction Details</h1>
        <div className="w-5"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 max-w-md mx-auto w-full">
        {/* Success Icon - 48px */}
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "#0000FF" }}>
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Status and Amount - Ultra Compact */}
        <div className="text-center mb-2">
          <h2 className="text-sm font-bold text-gray-900 mb-0.5">Transfer to {withdrawalData?.accountName}</h2>
          <p className="text-xl font-bold text-gray-900 mb-0.5">₦{amount}</p>
          <p className="text-teal-600 font-semibold text-xs">Successful</p>
        </div>

        {/* Progress Timeline - Ultra Compact */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            {/* Withdrawal Initiated */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={12} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-none mt-0.5">Initiated</p>
            </div>

            {/* Line 1 */}
            <div className="flex-1 h-0.5 mx-0.5" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Processing by Bank */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={12} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-none mt-0.5">Processing</p>
            </div>

            {/* Line 2 */}
            <div className="flex-1 h-0.5 mx-0.5" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Completed in Account */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={12} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center leading-none mt-0.5">Completed</p>
            </div>
          </div>
        </div>

        {/* Info Message - Ultra Compact */}
        <div className="bg-gray-100 rounded p-2 mb-2 text-center">
          <p className="text-xs text-gray-700 leading-tight">
            Withdrawal processed successfully. Funds will reflect in your account shortly.
          </p>
        </div>

        {/* Transaction Receipt - Full-Width Flex Rows */}
        <div className="bg-white rounded p-2.5 mb-2">
          <h3 className="text-xs font-bold text-gray-900 mb-1.5">Receipt</h3>
          
          {/* Receipt Rows - Each row full-width with flex layout */}
          <div className="space-y-1.5">
            {/* Name Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Name</span>
              <span className="text-xs font-semibold text-gray-900">{withdrawalData?.accountName}</span>
            </div>

            {/* Bank Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Bank</span>
              <span className="text-xs font-semibold text-gray-900">{withdrawalData?.selectedBank}</span>
            </div>

            {/* Account Number Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Account Number</span>
              <span className="text-xs font-semibold text-gray-900">{withdrawalData?.accountNumber}</span>
            </div>

            {/* Amount Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Amount</span>
              <span className="text-xs font-semibold text-gray-900">₦{amount}</span>
            </div>

            {/* Transaction ID Row with Copy */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Transaction ID</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900">{transactionId}</span>
                <button
                  onClick={() => handleCopy(transactionId, "Transaction ID")}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Copy Transaction ID"
                >
                  {copiedField === "Transaction ID" ? (
                    <Check size={12} className="text-green-600" />
                  ) : (
                    <Copy size={12} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Session ID Row with Copy */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Session ID</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900">{sessionId}</span>
                <button
                  onClick={() => handleCopy(sessionId, "Session ID")}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Copy Session ID"
                >
                  {copiedField === "Session ID" ? (
                    <Check size={12} className="text-green-600" />
                  ) : (
                    <Copy size={12} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Date Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Date</span>
              <span className="text-xs font-semibold text-gray-900">{new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>

            {/* Time Row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-600">Time</span>
              <span className="text-xs font-semibold text-gray-900">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>

            {/* Status Row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-semibold text-teal-600">Successful</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="flex gap-2 px-3 py-2 bg-gray-50">
        <button
          onClick={() => {
            const subject = "Report Issue - Withdrawal"
            const body = `Transaction ID: ${transactionId}\n\nPlease describe your issue...`
            window.location.href = `mailto:support@bluepay.ng?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
          }}
          className="flex-1 h-10 rounded-2xl font-bold text-xs transition-colors"
          style={{ backgroundColor: "#E8F5E9", color: "#0000FF" }}
        >
          Report Issues
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 h-10 rounded-2xl text-white font-bold text-xs"
          style={{ backgroundColor: "#0000FF" }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
