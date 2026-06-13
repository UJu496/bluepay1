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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0000FF" }}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Wait while Preparing your withdrawal results</p>
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
