"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, ArrowLeft, Copy, Check, Share2, Download } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Withdrawal Successful</h1>
        <div className="w-5"></div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8">
        {/* Success Animation Card */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Completed!</h2>
          <p className="text-gray-600">Your withdrawal has been processed</p>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <p className="text-gray-600 text-center mb-3">Amount Withdrawn</p>
          <p className="text-5xl font-bold text-center text-green-600 mb-4">₦{amount}</p>
          <p className="text-center text-sm text-gray-600">To {withdrawalData?.accountName}</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">{withdrawalData?.selectedBank}</p>
            <p className="text-xs text-gray-500 text-center font-mono">{withdrawalData?.accountNumber}</p>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-6">Transaction Status</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900 text-sm">Initiated</p>
                <p className="text-xs text-gray-500">Request received</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900 text-sm">Processing</p>
                <p className="text-xs text-gray-500">Verified & submitted to bank</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900 text-sm">Completed</p>
                <p className="text-xs text-gray-500">Funds transferred successfully</p>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Details Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Receipt Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 font-mono">{transactionId}</span>
                <button
                  onClick={() => handleCopy(transactionId, "Transaction ID")}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  {copiedField === "Transaction ID" ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} className="text-blue-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Date & Time</span>
              <span className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-semibold text-green-600">Successful</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              const subject = "Report Issue - Withdrawal"
              const body = `Transaction ID: ${transactionId}\n\nPlease describe your issue...`
              window.location.href = `mailto:support@bluepay.ng?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            }}
            className="w-full py-4 rounded-full bg-white text-blue-600 font-bold border-2 border-blue-600 flex items-center justify-center gap-2 hover:bg-blue-50"
          >
            <Share2 size={18} />
            Share Receipt
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-full text-white font-bold flex items-center justify-center gap-2"
            style={{ backgroundColor: "#0000FF" }}
          >
            <CheckCircle size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
