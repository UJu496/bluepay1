"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Calendar, Clock, Hash, ArrowDownLeft, HelpCircle } from "lucide-react"

interface WithdrawalNotification {
  id: string
  amount: number
  userName: string
  bank: string
  accountName: string
  accountNumber: string
  date: string
  time: string
  status: "Successful" | "pending" | "failed"
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<WithdrawalNotification[]>([])

  useEffect(() => {
    const loadWithdrawalHistory = () => {
      const withdrawalHistory = localStorage.getItem("withdrawalHistory")

      if (withdrawalHistory) {
        const history = JSON.parse(withdrawalHistory)

        const formattedNotifications = history.map((withdrawal: any) => ({
          id: withdrawal.id,
          amount: withdrawal.amount,
          userName: withdrawal.userName,
          bank: withdrawal.bank,
          accountName: withdrawal.accountName,
          accountNumber: withdrawal.accountNumber,
          date: withdrawal.date,
          time: withdrawal.time,
          status: withdrawal.status,
        }))

        setNotifications(formattedNotifications)
      }
    }

    loadWithdrawalHistory()
  }, [])

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Withdrawal History</h1>
          <div className="w-5"></div>
        </div>
        <p className="text-sm text-gray-600">Your recent withdrawal transactions</p>
      </div>

      <div className="px-4 py-6">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center mt-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Withdrawals Yet</h3>
            <p className="text-gray-600 mb-6">Your withdrawal history will appear here</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowDownLeft className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Withdrawal</h3>
                      <p className="text-xs text-gray-500">{notification.bank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{formatAmount(notification.amount)}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold mt-1">
                      {notification.status}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Account Name</p>
                      <p className="font-semibold text-gray-900">{notification.accountName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Account Number</p>
                      <p className="font-semibold text-gray-900 font-mono text-xs">{notification.accountNumber}</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-700">{notification.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-700">{notification.time}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Hash size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="break-all">{notification.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <HelpCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Need Assistance?</h3>
                <p className="text-sm text-blue-800 mb-4">
                  If you have questions about your withdrawals or encounter any issues, our support team is ready to help.
                </p>
                <button
                  onClick={() => router.push("/support")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-sm"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
