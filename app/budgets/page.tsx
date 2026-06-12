"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PieChart,
  Target,
  X,
  Save,
} from "lucide-react"

interface Budget {
  id: number
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly"
  color: string
}

export default function BudgetsPage() {
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "weekly",
  })

  const categories = [
    { name: "Airtime", color: "bg-blue-500" },
    { name: "Data", color: "bg-green-500" },
    { name: "Bills", color: "bg-purple-500" },
    { name: "Shopping", color: "bg-orange-500" },
    { name: "Food", color: "bg-red-500" },
    { name: "Transport", color: "bg-yellow-500" },
    { name: "Entertainment", color: "bg-pink-500" },
    { name: "Other", color: "bg-gray-500" },
  ]

  useEffect(() => {
    loadBudgets()
    calculateSpending()
  }, [])

  const loadBudgets = () => {
    const savedBudgets = localStorage.getItem("userBudgets")
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    } else {
      // Default budgets
      const defaultBudgets: Budget[] = [
        { id: 1, category: "Airtime", limit: 50000, spent: 45000, period: "monthly", color: "bg-blue-500" },
        { id: 2, category: "Data", limit: 40000, spent: 38000, period: "monthly", color: "bg-green-500" },
        { id: 3, category: "Bills", limit: 30000, spent: 25000, period: "monthly", color: "bg-purple-500" },
        { id: 4, category: "Shopping", limit: 25000, spent: 19000, period: "monthly", color: "bg-orange-500" },
      ]
      setBudgets(defaultBudgets)
      localStorage.setItem("userBudgets", JSON.stringify(defaultBudgets))
    }
  }

  const calculateSpending = () => {
    // Get transactions from localStorage
    const savedTransactions = localStorage.getItem("allTransactions")
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      // Calculate spending by category for current month
      const monthlySpending: { [key: string]: number } = {}

      transactions.forEach((transaction: any) => {
        const transactionDate = new Date(transaction.date)
        if (
          transaction.type === "expense" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          if (!monthlySpending[transaction.category]) {
            monthlySpending[transaction.category] = 0
          }
          monthlySpending[transaction.category] += transaction.amount
        }
      })

      // Update budgets with actual spending
      const updatedBudgets = budgets.map((budget) => ({
        ...budget,
        spent: monthlySpending[budget.category] || 0,
      }))

      if (updatedBudgets.length > 0) {
        setBudgets(updatedBudgets)
        localStorage.setItem("userBudgets", JSON.stringify(updatedBudgets))
      }
    }
  }

  useEffect(() => {
    const total = budgets.reduce((sum, b) => sum + b.limit, 0)
    const spent = budgets.reduce((sum, b) => sum + b.spent, 0)
    setTotalBudget(total)
    setTotalSpent(spent)
  }, [budgets])

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.limit) {
      alert("Please fill in all fields")
      return
    }

    // Check if category already has a budget
    if (budgets.some((b) => b.category === newBudget.category)) {
      alert("Budget for this category already exists")
      return
    }

    const categoryColor = categories.find((c) => c.name === newBudget.category)?.color || "bg-gray-500"

    const budget: Budget = {
      id: Date.now(),
      category: newBudget.category,
      limit: Number.parseFloat(newBudget.limit),
      spent: 0,
      period: newBudget.period,
      color: categoryColor,
    }

    const updatedBudgets = [...budgets, budget]
    setBudgets(updatedBudgets)
    localStorage.setItem("userBudgets", JSON.stringify(updatedBudgets))

    setNewBudget({ category: "", limit: "", period: "monthly" })
    setShowAddModal(false)
  }

  const handleUpdateBudget = () => {
    if (!editingBudget) return

    const updatedBudgets = budgets.map((b) => (b.id === editingBudget.id ? editingBudget : b))
    setBudgets(updatedBudgets)
    localStorage.setItem("userBudgets", JSON.stringify(updatedBudgets))
    setEditingBudget(null)
  }

  const handleDeleteBudget = (id: number) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      const updatedBudgets = budgets.filter((b) => b.id !== id)
      setBudgets(updatedBudgets)
      localStorage.setItem("userBudgets", JSON.stringify(updatedBudgets))
    }
  }

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100)
  }

  const getStatusColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return "text-red-600"
    if (percentage >= 80) return "text-orange-600"
    return "text-green-600"
  }

  const getStatusIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return <AlertCircle className="text-red-600" size={20} />
    if (percentage >= 80) return <AlertCircle className="text-orange-600" size={20} />
    return <CheckCircle className="text-green-600" size={20} />
  }

  const getProgressBarColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-orange-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Budget Tracker</h1>
          <button onClick={() => setShowAddModal(true)} className="p-2 hover:bg-white/10 rounded-full">
            <Plus size={24} />
          </button>
        </div>

        {/* Overall Budget Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Budget</p>
              <p className="text-2xl font-bold">₦{totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Total Spent</p>
              <p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(totalSpent, totalBudget)}`}
              style={{ width: `${getProgressPercentage(totalSpent, totalBudget)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm opacity-90">{getProgressPercentage(totalSpent, totalBudget).toFixed(1)}% used</p>
            <p className="text-sm opacity-90">₦{(totalBudget - totalSpent).toLocaleString()} remaining</p>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="p-4">
        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Target className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No budgets set</h3>
            <p className="text-gray-600 mb-4">Start tracking your spending by creating budgets</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Budget
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${budget.color} flex items-center justify-center`}>
                      <PieChart className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                      <p className="text-xs text-gray-500 capitalize">{budget.period} budget</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(budget.spent, budget.limit)}
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Edit2 className="text-gray-600" size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Trash2 className="text-red-600" size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${getStatusColor(budget.spent, budget.limit)}`}>
                      ₦{budget.spent.toLocaleString()} / ₦{budget.limit.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {getProgressPercentage(budget.spent, budget.limit).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(budget.spent, budget.limit)}`}
                      style={{ width: `${getProgressPercentage(budget.spent, budget.limit)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span
                    className={`font-semibold ${budget.limit - budget.spent >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ₦{Math.abs(budget.limit - budget.spent).toLocaleString()}
                    {budget.spent > budget.limit && " over budget"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Budget Insights */}
        {budgets.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Budget Insights
            </h3>
            <div className="space-y-3">
              {budgets.filter((b) => b.spent >= b.limit * 0.8).length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-800 mb-1">Budget Alerts</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {budgets
                      .filter((b) => b.spent >= b.limit)
                      .map((b) => (
                        <li key={b.id}>
                          • {b.category} budget exceeded by ₦{(b.spent - b.limit).toLocaleString()}
                        </li>
                      ))}
                    {budgets
                      .filter((b) => b.spent >= b.limit * 0.8 && b.spent < b.limit)
                      .map((b) => (
                        <li key={b.id}>
                          • {b.category} at {((b.spent / b.limit) * 100).toFixed(0)}% - approaching limit
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">Spending Summary</p>
                <p className="text-sm text-blue-700">
                  You've spent ₦{totalSpent.toLocaleString()} out of ₦{totalBudget.toLocaleString()} total budget (
                  {((totalSpent / totalBudget) * 100).toFixed(1)}%)
                </p>
              </div>

              {totalBudget - totalSpent > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800 mb-1">Great Job!</p>
                  <p className="text-sm text-green-700">
                    You have ₦{(totalBudget - totalSpent).toLocaleString()} remaining in your budgets
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Budget</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((cat) => !budgets.some((b) => b.category === cat.name))
                    .map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit (₦)</label>
                <input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewBudget({ ...newBudget, period: "monthly" })}
                    className={`py-3 rounded-lg font-semibold ${
                      newBudget.period === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setNewBudget({ ...newBudget, period: "weekly" })}
                    className={`py-3 rounded-lg font-semibold ${
                      newBudget.period === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddBudget}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Budget</h2>
              <button onClick={() => setEditingBudget(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={editingBudget.category}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit (₦)</label>
                <input
                  type="number"
                  value={editingBudget.limit}
                  onChange={(e) => setEditingBudget({ ...editingBudget, limit: Number.parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEditingBudget({ ...editingBudget, period: "monthly" })}
                    className={`py-3 rounded-lg font-semibold ${
                      editingBudget.period === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setEditingBudget({ ...editingBudget, period: "weekly" })}
                    className={`py-3 rounded-lg font-semibold ${
                      editingBudget.period === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdateBudget}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
