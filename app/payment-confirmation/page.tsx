"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PaymentConfirmationPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("user@example.com")
  const [amount, setAmount] = useState("₦8,500.00")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const paymentData = localStorage.getItem("paymentData")
    const userData = localStorage.getItem("userData")

    if (paymentData) {
      const parsedData = JSON.parse(paymentData)
      setAmount(parsedData.amount || "₦8,500.00")
    }

    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.fullName || "User")
      setUserEmail(user.email || "user@example.com")
    }
  }, [])

  const handleConfirm = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/payment")
    }, 5000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0000FF" }}>
        <div className="text-center">
          <div className="relative mb-4">
            {/* Outer rotating ring */}
            <div className="w-24 h-24 border-4 border-white/30 rounded-full animate-spin mx-auto"></div>
            {/* Inner pulsing circle */}
            <div className="absolute top-2 left-2 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
            {/* Center dot */}
            <div className="absolute top-5 left-8 w-8 h-8 bg-white rounded-full animate-bounce"></div>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>

          <p className="text-white text-xl font-semibold">Processing your confirmation...</p>
          <p className="text-white/80 text-sm mt-2">Please wait while we verify your details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0000FF" }}>
      {/* Header */}
      <div className="flex items-center p-4 pt-12">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Confirm Payment Details</h1>
      </div>

      <div className="p-4 mt-4">
        {/* Confirmation Card */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-lg">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 overflow-hidden">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-yellow-800 text-sm font-medium">
                  🚨 CRITICAL REMINDER: Use your registered withdrawal account for this BPC purchase! Our intelligent
                  payment bot scans transactions every 30 seconds and will instantly detect payments from verified
                  accounts. Using a different account may cause delays or payment verification issues. Stay smart, stay
                  fast - use your withdrawal account! 🏦⚡
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Confirm Your Details</h2>

          {/* User Details */}
          <div className="space-y-4 mb-4">
            <div className="border-b border-gray-200 pb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">FULL NAME</label>
              <p className="text-lg font-semibold text-gray-800">{userName}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">EMAIL</label>
              <p className="text-lg font-semibold text-gray-800">{userEmail}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">AMOUNT</label>
              <p className="text-xl font-bold" style={{ color: "#0000FF" }}>
                {amount}
              </p>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-center text-gray-700 font-medium">
              Please confirm that these details are correct before proceeding to payment.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#0000FF" }}
          >
            I CONFIRM DETAILS
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 100s linear infinite;
        }
      `}</style>
    </div>
  )
}
