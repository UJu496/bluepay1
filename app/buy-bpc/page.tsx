"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const TypewriterText = ({ text, delay = 100, loop = false }: { text: string; delay?: number; loop?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        setIndex(index + 1)
      } else if (loop) {
        setDisplayedText("")
        setIndex(0)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [index, text, delay, loop])

  return <span>{displayedText}</span>
}

export default function BuyBPCPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("user@example.com")
  const [amount] = useState("₦10,257.00")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedData = JSON.parse(userData)
      setUserName(parsedData.fullName || "User")
      setUserEmail(parsedData.email || "user@example.com")
    }
  }, [])

  const handlePay = async () => {
    setIsLoading(true)

    // Store payment data for confirmation page
    const paymentData = {
      userName,
      userEmail,
      amount,
    }
    localStorage.setItem("paymentData", JSON.stringify(paymentData))

    // Show loading for 3 seconds
    setTimeout(() => {
      setIsLoading(false)
      router.push("/payment-confirmation")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Buy BPC Code</h1>
      </div>

      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 overflow-hidden">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-yellow-800 text-sm font-medium">
                🚨 IMPORTANT: For instant payment verification, always use the SAME bank account you registered for
                withdrawals when purchasing BPC codes! Our advanced payment detection system will automatically
                recognize your transaction within seconds, ensuring faster processing and immediate code delivery. Don't
                risk delays - use your verified withdrawal account for seamless BPC purchases! 💳✨
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-4 mb-6 border-l-4" style={{ borderLeftColor: "#0000FF" }}>
          <p className="text-blue-600 mb-2">Welcome back, {userName}</p>
          <p className="text-blue-600">Email: {userEmail}</p>
        </div>

        {/* Amount Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Amount</label>
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <p className="text-lg font-semibold text-gray-800">{amount}</p>
          </div>
        </div>

        {/* Full Name Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <p className="text-gray-800">{userName}</p>
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Your Email Address</label>
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <p className="text-gray-800">{userEmail}</p>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={isLoading}
          className="w-full text-white py-4 rounded-lg font-semibold text-lg mb-6 disabled:opacity-50"
          style={{ backgroundColor: "#0000FF" }}
        >
          {isLoading ? "Processing..." : "Pay"}
        </button>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm">
          Your BPC code will be displayed on the app once your payment is confirmed.
        </p>
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
