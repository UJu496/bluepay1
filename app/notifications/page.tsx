"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Calendar, Clock, Hash } from "lucide-react"

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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Withdrawal History</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Recent Withdrawals</h2>
          <p className="text-gray-600">Your successful withdrawal transactions</p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg">No withdrawal history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Withdrawal Successful</h3>
                      <p className="text-green-600 font-bold text-xl">{formatAmount(notification.amount)}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {notification.status}
                  </span>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-800">AMOUNT:</span>
                      <span className="text-gray-800 font-semibold">{formatAmount(notification.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-800">USER NAME:</span>
                      <span className="text-gray-800 font-semibold">{notification.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-800">BANK:</span>
                      <span className="text-gray-800 font-semibold">{notification.bank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-800">ACCOUNT NAME:</span>
                      <span className="text-gray-800 font-semibold">{notification.accountName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-800">ACCOUNT NUMBER:</span>
                      <span className="text-gray-800 font-semibold">{notification.accountNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="text-gray-600 font-medium">{notification.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-gray-600 font-medium">{notification.time}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Hash className="text-gray-400" size={16} />
                    <span className="text-gray-500 text-sm">Transaction ID: {notification.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700 mb-3">
            If you have any questions about your withdrawals, our support team is here to help.
          </p>
          <button
            onClick={() => router.push("/support")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}
