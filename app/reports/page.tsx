"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  PieChart,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react"

interface Transaction {
  id: number
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  status: string
}

interface CategoryData {
  category: string
  amount: number
  percentage: number
  color: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [netSavings, setNetSavings] = useState(0)
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryData[]>([])
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([])
  const [monthlyTrend, setMonthlyTrend] = useState<{ month: string; income: number; expense: number }[]>([])

  const categoryColors: { [key: string]: string } = {
    Airtime: "bg-blue-500",
    Data: "bg-green-500",
    Bills: "bg-purple-500",
    Shopping: "bg-orange-500",
    Food: "bg-red-500",
    Transport: "bg-yellow-500",
    Entertainment: "bg-pink-500",
    Salary: "bg-indigo-500",
    Freelance: "bg-teal-500",
    Business: "bg-cyan-500",
    Investment: "bg-emerald-500",
    Savings: "bg-lime-500",
    Other: "bg-gray-500",
  }

  useEffect(() => {
    loadTransactions()
  }, [period])

  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem("allTransactions")
    if (savedTransactions) {
      const allTransactions: Transaction[] = JSON.parse(savedTransactions)
      const filtered = filterTransactionsByPeriod(allTransactions, period)
      setTransactions(filtered)
      calculateAnalytics(filtered)
      calculateMonthlyTrend(allTransactions)
    }
  }

  const filterTransactionsByPeriod = (transactions: Transaction[], period: string) => {
    const now = new Date()
    const filtered = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      switch (period) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return transactionDate >= weekAgo
        case "month":
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
        case "year":
          return transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
    return filtered
  }

  const calculateAnalytics = (transactions: Transaction[]) => {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    setTotalIncome(income)
    setTotalExpense(expense)
    setNetSavings(income - expense)

    // Calculate expense by category
    const expenseCategories: { [key: string]: number } = {}
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount
      })

    const expenseData: CategoryData[] = Object.entries(expenseCategories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / expense) * 100,
        color: categoryColors[category] || "bg-gray-500",
      }))
      .sort((a, b) => b.amount - a.amount)

    setExpenseByCategory(expenseData)

    // Calculate income by category
    const incomeCategories: { [key: string]: number } = {}
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        incomeCategories[t.category] = (incomeCategories[t.category] || 0) + t.amount
      })

    const incomeData: CategoryData[] = Object.entries(incomeCategories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / income) * 100,
        color: categoryColors[category] || "bg-gray-500",
      }))
      .sort((a, b) => b.amount - a.amount)

    setIncomeByCategory(incomeData)
  }

  const calculateMonthlyTrend = (transactions: Transaction[]) => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {}
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Get last 6 months
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`
      monthlyData[monthKey] = { income: 0, expense: 0 }
    }

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`
      if (monthlyData[monthKey]) {
        if (t.type === "income") {
          monthlyData[monthKey].income += t.amount
        } else {
          monthlyData[monthKey].expense += t.amount
        }
      }
    })

    const trendData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))

    setMonthlyTrend(trendData)
  }

  const exportReport = () => {
    const reportData = {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncome,
        totalExpense,
        netSavings,
      },
      expenseByCategory,
      incomeByCategory,
      transactions,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-report-${period}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0"

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Reports & Analytics</h1>
          <button onClick={exportReport} className="p-2 hover:bg-white/10 rounded-full">
            <Download size={24} />
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {["week", "month", "year"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`flex-1 py-2 rounded-lg font-semibold capitalize transition-colors ${
                period === p ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <ArrowDownRight size={16} className="text-green-300" />
              <p className="text-xs opacity-90">Income</p>
            </div>
            <p className="text-lg font-bold">₦{(totalIncome / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpRight size={16} className="text-red-300" />
              <p className="text-xs opacity-90">Expense</p>
            </div>
            <p className="text-lg font-bold">₦{(totalExpense / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign size={16} className="text-yellow-300" />
              <p className="text-xs opacity-90">Savings</p>
            </div>
            <p className="text-lg font-bold">₦{(netSavings / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Net Savings Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Net Savings
            </h3>
            <span className={`text-sm font-semibold ${netSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
              {savingsRate}% rate
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${netSavings >= 0 ? "bg-green-100" : "bg-red-100"}`}
            >
              {netSavings >= 0 ? (
                <TrendingUp className="text-green-600" size={32} />
              ) : (
                <TrendingDown className="text-red-600" size={32} />
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">₦{Math.abs(netSavings).toLocaleString()}</p>
              <p className="text-sm text-gray-600">{netSavings >= 0 ? "Saved this period" : "Overspent this period"}</p>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            6-Month Trend
          </h3>
          <div className="space-y-3">
            {monthlyTrend.map((data, index) => {
              const maxAmount = Math.max(...monthlyTrend.map((d) => Math.max(d.income, d.expense)))
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                    <span className="text-xs text-gray-600">
                      ₦{((data.income - data.expense) / 1000).toFixed(0)}k net
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${(data.income / maxAmount) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">₦{(data.income / 1000).toFixed(0)}k in</p>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${(data.expense / maxAmount) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">₦{(data.expense / 1000).toFixed(0)}k out</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-red-600" size={20} />
            Expense Breakdown
          </h3>
          {expenseByCategory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No expenses in this period</p>
          ) : (
            <div className="space-y-3">
              {expenseByCategory.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">₦{cat.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{cat.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${cat.color}`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-green-600" size={20} />
            Income Breakdown
          </h3>
          {incomeByCategory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No income in this period</p>
          ) : (
            <div className="space-y-3">
              {incomeByCategory.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">₦{cat.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{cat.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${cat.color}`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial Health Score */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 shadow-sm text-white">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="text-white" size={20} />
            Financial Health Score
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-4xl font-bold">
                {totalIncome > 0 ? Math.min(100, Math.round((netSavings / totalIncome) * 100 + 50)) : 50}
              </p>
              <p className="text-sm opacity-90">out of 100</p>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {totalIncome > 0
                    ? Math.min(100, Math.round((netSavings / totalIncome) * 100 + 50)) >= 70
                      ? "😊"
                      : Math.min(100, Math.round((netSavings / totalIncome) * 100 + 50)) >= 50
                        ? "😐"
                        : "😟"
                    : "😐"}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm opacity-90">
            <p>
              • Savings Rate: {savingsRate}%{" "}
              {Number.parseFloat(savingsRate) >= 20
                ? "(Excellent)"
                : Number.parseFloat(savingsRate) >= 10
                  ? "(Good)"
                  : "(Needs Improvement)"}
            </p>
            <p>
              • Expense Control:{" "}
              {totalIncome > 0 && totalExpense / totalIncome <= 0.7
                ? "Excellent"
                : totalIncome > 0 && totalExpense / totalIncome <= 0.9
                  ? "Good"
                  : "Needs Attention"}
            </p>
            <p>• Transaction Count: {transactions.length} this period</p>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Key Insights
          </h3>
          <div className="space-y-3">
            {netSavings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-800 mb-1">Great Job!</p>
                <p className="text-sm text-green-700">
                  You saved ₦{netSavings.toLocaleString()} this {period}. Keep up the good work!
                </p>
              </div>
            )}

            {netSavings < 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-800 mb-1">Budget Alert</p>
                <p className="text-sm text-red-700">
                  You overspent by ₦{Math.abs(netSavings).toLocaleString()} this {period}. Consider reviewing your
                  expenses.
                </p>
              </div>
            )}

            {expenseByCategory.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">Top Expense Category</p>
                <p className="text-sm text-blue-700">
                  {expenseByCategory[0].category} accounts for {expenseByCategory[0].percentage.toFixed(1)}% of your
                  expenses (₦{expenseByCategory[0].amount.toLocaleString()})
                </p>
              </div>
            )}

            {Number.parseFloat(savingsRate) < 10 && totalIncome > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-800 mb-1">Savings Tip</p>
                <p className="text-sm text-orange-700">
                  Your savings rate is {savingsRate}%. Try to aim for at least 20% to build a healthy financial cushion.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
