"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft, Phone, Wifi } from "lucide-react"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const [transaction, setTransaction] = useState<any>(null)

  useEffect(() => {
    const transactionData = localStorage.getItem("lastTransaction")
    if (transactionData) {
      setTransaction(JSON.parse(transactionData))
    }
  }, [])

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Transaction Successful</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        {/* Success Icon */}
        <div className="text-center mb-8 mt-8">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={80} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Successful!</h2>
          <p className="text-gray-600">Your {transaction.type} purchase has been completed successfully</p>
        </div>

        {/* Transaction Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            {transaction.type === "airtime" ? <Phone size={20} /> : <Wifi size={20} />}
            Transaction Details
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Type</span>
              <span className="font-semibold text-gray-800 capitalize">{transaction.type}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Phone Number</span>
              <span className="font-semibold text-gray-800">{transaction.phoneNumber}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Network</span>
              <span className="font-semibold text-gray-800">{transaction.network}</span>
            </div>

            {transaction.type === "data" && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Data Plan</span>
                  <span className="font-semibold text-gray-800">{transaction.plan}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Validity</span>
                  <span className="font-semibold text-gray-800">{transaction.validity}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold text-green-600 text-lg">{formatAmount(transaction.amount)}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-semibold text-gray-800">{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">
                {transaction.type === "airtime" ? "Airtime Delivered" : "Data Activated"}
              </h4>
              <p className="text-sm text-green-700">
                {transaction.type === "airtime"
                  ? `${transaction.amount} airtime has been credited to ${transaction.phoneNumber}`
                  : `${transaction.plan} data plan has been activated on ${transaction.phoneNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-xl text-white font-bold text-lg"
            style={{ backgroundColor: "#0000FF" }}
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => router.push(`/${transaction.type}`)}
            className="w-full py-4 rounded-xl border-2 font-bold text-lg hover:bg-blue-50"
            style={{ borderColor: "#0000FF", color: "#0000FF" }}
          >
            Make Another Purchase
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
          <p className="text-sm text-blue-700">
            Need help? Contact our support team at <span className="font-semibold">bluepay032@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}
