"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function WithdrawalSuccessPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [withdrawalData, setWithdrawalData] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("withdrawalData")
    if (data) {
      const parsedData = JSON.parse(data)
      setAmount(parsedData.amount.toLocaleString())
      setWithdrawalData(parsedData)

      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const withdrawalTransaction = {
        id: `TXN${Date.now()}`,
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

      // Clean up withdrawal data
      localStorage.removeItem("withdrawalData")
    }
  }, [])

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
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "#0000FF" }}>
            <CheckCircle size={32} />
          </div>
        </div>

        {/* Status and Amount */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Transfer to {withdrawalData?.selectedBank}</h2>
          <p className="text-3xl font-bold text-gray-900 mb-3">₦{amount}</p>
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
              <p className="text-xs font-semibold text-gray-900 text-center">Withdrawal<br />initiated</p>
              <p className="text-xs text-gray-600 mt-1">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Line 1 */}
            <div className="flex-1 h-0.5 mx-2 mt-2" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Processing */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-2" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">Processing<br />by bank</p>
              <p className="text-xs text-gray-600 mt-1">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Line 2 */}
            <div className="flex-1 h-0.5 mx-2 mt-2" style={{ backgroundColor: "#0000FF" }}></div>

            {/* Completed */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-2" style={{ backgroundColor: "#0000FF" }}>
                <CheckCircle size={20} />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">Completed<br />in account</p>
              <p className="text-xs text-gray-600 mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 text-center">
          <p className="text-sm text-gray-700">
            Your withdrawal has been processed successfully and will be reflected in your account shortly, subject to your bank&apos;s processing time.
          </p>
        </div>

        {/* Transaction Details Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Withdrawal Details</h3>

          {/* Bank Details */}
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Bank Details</p>
            <p className="text-sm font-semibold text-gray-900">{withdrawalData?.accountName}</p>
            <p className="text-sm text-gray-600">{withdrawalData?.selectedBank} | {withdrawalData?.accountNumber}</p>
          </div>

          {/* Amount */}
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Amount</p>
            <p className="text-sm font-semibold text-gray-900">₦{amount}</p>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Date & Time</p>
            <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-full text-white font-bold text-base"
            style={{ backgroundColor: "#0000FF" }}
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => router.push("/transactions")}
            className="w-full py-3 rounded-full font-bold text-base border-2"
            style={{ borderColor: "#0000FF", color: "#0000FF", backgroundColor: "#fff" }}
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  )
}
