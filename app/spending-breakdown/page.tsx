"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingDown, Calendar } from "lucide-react"
import { getTransactions } from "@/lib/transactions"

export default function SpendingBreakdownPage() {
  const router = useRouter()
  const [spendingData, setSpendingData] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [totalSpending, setTotalSpending] = useState(0)

  useEffect(() => {
    loadSpendingData()
  }, [selectedPeriod])

  const loadSpendingData = () => {
    const allTransactions = getTransactions()
    let filteredTransactions = allTransactions.filter((t) => t.type === "expense")

    // Filter by period
    const now = new Date()
    if (selectedPeriod === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.timestamp) >= weekAgo)
    } else if (selectedPeriod === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.timestamp) >= monthAgo)
    }

    // Calculate spending by category
    const categoryTotals: Record<string, { amount: number; count: number; transactions: any[] }> = {}

    filteredTransactions.forEach((t) => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = { amount: 0, count: 0, transactions: [] }
      }
      categoryTotals[t.category].amount += t.amount
      categoryTotals[t.category].count += 1
      categoryTotals[t.category].transactions.push(t)
    })

    const total = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0)
    setTotalSpending(total)

    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"]

    const spending = Object.entries(categoryTotals)
      .map(([category, data], index) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
        color: colors[index % colors.length],
        transactions: data.transactions,
      }))
      .sort((a, b) => b.amount - a.amount)

    setSpendingData(spending)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Spending Breakdown</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        {/* Period Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-blue-500" size={20} />
            <h3 className="font-semibold text-gray-800">Time Period</h3>
          </div>
          <div className="flex gap-2">
            {["week", "month", "all"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {period === "week" ? "This Week" : period === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Total Spending Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown size={24} />
            <h2 className="text-lg font-semibold">Total Spending</h2>
          </div>
          <p className="text-4xl font-bold">₦{totalSpending.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-2">
            {selectedPeriod === "week"
              ? "Last 7 days"
              : selectedPeriod === "month"
                ? "Last 30 days"
                : "All transactions"}
          </p>
        </div>

        {/* Spending by Category */}
        <div className="space-y-4">
          {spendingData.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <TrendingDown className="text-gray-300 mx-auto mb-3" size={48} />
              <p className="text-gray-500">No spending data for this period</p>
              <p className="text-sm text-gray-400 mt-1">Start making transactions to see your spending breakdown</p>
            </div>
          ) : (
            spendingData.map((item) => (
              <div key={item.category} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.category}</h3>
                    <p className="text-sm text-gray-500">{item.count} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">₦{item.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{item.percentage}% of total</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>

                {/* Recent Transactions in Category */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Recent Transactions</p>
                  {item.transactions.slice(0, 3).map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-2 border-t border-gray-100"
                    >
                      <div>
                        <p className="text-sm text-gray-700">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-red-600">-₦{transaction.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
