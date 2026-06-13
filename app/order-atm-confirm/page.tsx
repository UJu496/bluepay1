"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, User, Mail, Phone, Key, CheckCircle, DollarSign } from "lucide-react"
import RollingAnimation from "@/components/rolling-animation"

export default function OrderATMConfirmPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showRollingAnimation, setShowRollingAnimation] = useState(false)
  const ATM_CARD_PRICE = 2257.85

  useEffect(() => {
    const savedData = localStorage.getItem("atmOrderData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    } else {
      router.push("/order-atm")
    }
  }, [router])

  const handleConfirm = () => {
    setIsLoading(true)

    const currentBalance = Number(localStorage.getItem("userBalance") || "200000")
    const newBalance = currentBalance - ATM_CARD_PRICE
    localStorage.setItem("userBalance", newBalance.toString())

    // Store order confirmation
    localStorage.setItem("atmOrderConfirmed", "true")
    localStorage.removeItem("atmOrderData")

    setTimeout(() => {
      setIsLoading(false)
      setShowRollingAnimation(true)
    }, 1000)
  }

  const handleRollingComplete = () => {
    router.push("/order-atm-success")
  }

  const handleEdit = () => {
    router.push("/order-atm")
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0000FF" }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0000FF" }}>
      {showRollingAnimation && <RollingAnimation onComplete={handleRollingComplete} duration={6000} />}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">CONFIRM DETAILS</h1>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Header Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CreditCard className="text-blue-600" size={20} />
            </div>
          </div>
          <h2 className="text-white text-xl font-bold text-center mb-2">I CONFIRM DETAILS</h2>
          <p className="text-white/80 text-sm text-center">
            Please review your information before confirming your MASTERCARD order
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="text-white" size={20} />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">ATM Card Price</p>
                <p className="text-white text-xl font-bold">₦{ATM_CARD_PRICE.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/90 text-xs">Will be deducted</p>
              <p className="text-white/90 text-xs">from your balance</p>
            </div>
          </div>
        </div>

        {/* Details Review */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
          <h3 className="text-gray-800 text-lg font-bold mb-4">Order Details</h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Full Name</p>
                <p className="text-gray-800 font-semibold">{formData.fullName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Email Address</p>
                <p className="text-gray-800 font-semibold">{formData.email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">Phone Number</p>
                <p className="text-gray-800 font-semibold">{formData.phoneNumber}</p>
              </div>
            </div>

            {/* BPC CODE */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Key className="text-yellow-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">BPC CODE</p>
                <p className="text-gray-800 font-semibold">{formData.bpcCode}</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="w-full mt-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Edit Details
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:shadow-lg transform hover:scale-105"
          }`}
          style={{ backgroundColor: isLoading ? undefined : "#0000FF" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Order...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              CONFIRM & PAY ₦{ATM_CARD_PRICE.toLocaleString()}
            </div>
          )}
        </button>

        {/* Terms */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-3 border border-white/20">
          <p className="text-white/80 text-xs text-center">
            By confirming, you agree to our terms and conditions. Your MASTERCARD will be processed and delivered within
            3-5 business days. ₦{ATM_CARD_PRICE.toLocaleString()} will be deducted from your account balance.
          </p>
        </div>
      </div>
    </div>
  )
}
