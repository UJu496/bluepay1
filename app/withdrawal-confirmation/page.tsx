"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function WithdrawalConfirmationPage() {
  const router = useRouter()
  const [withdrawalData, setWithdrawalData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("withdrawalData")
    if (data) {
      setWithdrawalData(JSON.parse(data))
    } else {
      router.push("/withdraw")
    }
  }, [router])

  const handleConfirm = () => {
    setIsLoading(true)

    // Show loading for 5 seconds
    setTimeout(() => {
      // Update balance
      const newBalance = withdrawalData.balance - withdrawalData.amount
      localStorage.setItem("userBalance", newBalance.toString())

      // Navigate to success page
      router.push("/withdrawal-success")
    }, 5000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4">
        <div className="text-center text-white">
          {/* Animated Processing Card */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              <div className="absolute inset-4 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div className="animate-spin">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Processing Withdrawal</h2>
          <p className="text-blue-100 text-lg mb-2">Please wait while we prepare</p>
          <p className="text-blue-100 text-lg mb-8">your withdrawal results</p>
          
          {/* Status Steps */}
          <div className="space-y-3 text-left max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
              <span className="text-sm">Verifying details</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/50 animate-pulse flex items-center justify-center">
                <span className="text-xs">...</span>
              </div>
              <span className="text-sm">Submitting to bank</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
              <span className="text-sm">Completing transaction</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!withdrawalData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center p-4 pt-12 relative" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()} className="absolute left-4 text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Confirm Withdrawal</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Confirm Your Details</h2>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 text-sm">Account Name</p>
              <p className="text-lg font-semibold text-gray-800">{withdrawalData.accountName}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 text-sm">Account Number</p>
              <p className="text-lg font-semibold text-gray-800">{withdrawalData.accountNumber}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 text-sm">Bank</p>
              <p className="text-lg font-semibold text-gray-800">{withdrawalData.selectedBank}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 text-sm">Amount</p>
              <p className="text-xl font-bold text-blue-600">₦{withdrawalData.amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleConfirm}
              className="w-full p-4 rounded-xl text-white font-bold text-lg"
              style={{ backgroundColor: "#0000FF" }}
            >
              YES I CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
