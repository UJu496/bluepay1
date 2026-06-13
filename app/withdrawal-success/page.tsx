"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function WithdrawalSuccessPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("withdrawalData")
    if (data) {
      const withdrawalData = JSON.parse(data)
      setAmount(withdrawalData.amount.toLocaleString())

      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const withdrawalTransaction = {
        id: `TXN${Date.now()}`,
        amount: withdrawalData.amount,
        userName: userData.fullName || "User",
        bank: withdrawalData.selectedBank,
        accountName: withdrawalData.accountName,
        accountNumber: withdrawalData.accountNumber,
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#0000FF" }}>
      <div className="text-center max-w-md w-full">
        {/* Animated Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center">
              <svg className="w-16 h-16" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Success heading */}
        <h1 className="text-4xl font-bold text-white mb-3">Success!</h1>

        {/* Status message */}
        <p className="text-white/90 text-lg mb-8">
          Transfer initiated successfully!
        </p>

        {/* Amount Display Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
          <p className="text-white/70 text-sm mb-2">Transfer Amount</p>
          <p className="text-white text-5xl font-bold">₦{amount}</p>
        </div>

        {/* Dynamic amount description */}
        <p className="text-white/80 text-base mb-12 leading-relaxed">
          Your transfer of ₦{amount} has been processed successfully and will reflect in your account shortly.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 px-6 text-white font-bold text-lg rounded-full hover:shadow-xl transition-all duration-300 bg-white"
            style={{ color: "#0000FF" }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/transactions")}
            className="w-full py-4 px-6 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 border-2 border-white"
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  )
}
