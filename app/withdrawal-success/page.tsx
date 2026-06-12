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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        {/* Header text */}
        <p className="text-gray-600 text-lg mb-8">Transfer initiated successfully!</p>

        {/* Large blue checkmark icon */}
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <div
            className="w-24 h-24 rounded-full border-4 flex items-center justify-center"
            style={{ borderColor: "#0000FF" }}
          >
            <svg className="w-12 h-12" fill="none" stroke="#0000FF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Transfer Successfully</h1>

        {/* Dynamic amount description */}
        <p className="text-gray-600 text-base mb-12 leading-relaxed">
          Your transfer of ₦{amount} has been processed successfully.
        </p>

        {/* Ok button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 px-6 text-white font-semibold text-lg rounded-xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0000FF" }}
        >
          Ok, I got it
        </button>
      </div>
    </div>
  )
}
