"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, User, Mail, Phone, Key } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"

export default function OrderATMPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bpcCode: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{11}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 11-digit phone number"
    }

    if (!formData.bpcCode.trim()) {
      newErrors.bpcCode = "BPC CODE is required"
    } else if (formData.bpcCode !== "BPC2026_BOT_8640D_266T") {
      newErrors.bpcCode = "Invalid BPC CODE kindly purchase a valid BPC CODE directly from BLUEPAY2026 platform"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true)

      saveTransaction({
        type: "expense",
        category: "ATM Order",
        description: "BLUEPAY INT'L MASTERCARD Order",
        amount: 5000,
        date: new Date().toISOString().split("T")[0],
        userName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      })

      localStorage.setItem("atmOrderData", JSON.stringify(formData))

      setTimeout(() => {
        router.push("/order-atm-confirm")
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0000FF" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">ORDER ATM</h1>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Card Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CreditCard className="text-blue-600" size={20} />
            </div>
          </div>
          <h2 className="text-white text-xl font-bold text-center mb-2">BLUEPAY INT'L MASTERCARD</h2>
          <p className="text-white/80 text-sm text-center">
            Fill out your details to order your exclusive BLUEPAY INT'L MASTERCARD
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <User className="inline mr-2" size={16} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <Mail className="inline mr-2" size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* BPC CODE */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <Key className="inline mr-2" size={16} />
                BPC CODE
              </label>
              <input
                type="text"
                value={formData.bpcCode}
                onChange={(e) => handleInputChange("bpcCode", e.target.value)}
                placeholder="Enter your BPC CODE"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bpcCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.bpcCode && <p className="text-red-500 text-xs mt-1">{errors.bpcCode}</p>}
              <p className="text-gray-500 text-xs mt-1">Use your valid BPC CODE to proceed</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full mt-3 py-4 rounded-xl font-bold text-white transition-all duration-300 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "hover:shadow-lg transform hover:scale-105"
            }`}
            style={{ backgroundColor: isLoading ? undefined : "#0000FF" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "ORDER"
            )}
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-3 border border-white/20">
          <h3 className="text-white font-semibold mb-2">What happens next?</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Review your details on the confirmation page</li>
            <li>• Your order will be processed within 24 hours</li>
            <li>• Our team will contact you via phone or email</li>
            <li>• Your MASTERCARD will be delivered to your address</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
