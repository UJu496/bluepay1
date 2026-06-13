"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  X,
  Save,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Briefcase,
  Gift,
  Sparkles,
} from "lucide-react"

interface Goal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  icon: string
  color: string
  priority: "high" | "medium" | "low"
}

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [showContributeModal, setShowContributeModal] = useState<Goal | null>(null)
  const [contributeAmount, setContributeAmount] = useState("")

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    category: "",
    priority: "medium" as "high" | "medium" | "low",
  })

  const categories = [
    { name: "House", icon: "home", color: "bg-blue-500" },
    { name: "Car", icon: "car", color: "bg-green-500" },
    { name: "Education", icon: "graduation-cap", color: "bg-purple-500" },
    { name: "Vacation", icon: "plane", color: "bg-orange-500" },
    { name: "Emergency Fund", icon: "heart", color: "bg-red-500" },
    { name: "Business", icon: "briefcase", color: "bg-indigo-500" },
    { name: "Gift", icon: "gift", color: "bg-pink-500" },
    { name: "Other", icon: "sparkles", color: "bg-gray-500" },
  ]

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    const savedGoals = localStorage.getItem("userGoals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    } else {
      // Default goals
      const defaultGoals: Goal[] = [
        {
          id: 1,
          name: "New Apartment",
          targetAmount: 5000000,
          currentAmount: 2500000,
          deadline: "2025-12-31",
          category: "House",
          icon: "home",
          color: "bg-blue-500",
          priority: "high",
        },
        {
          id: 2,
          name: "Emergency Fund",
          targetAmount: 1000000,
          currentAmount: 650000,
          deadline: "2025-06-30",
          category: "Emergency Fund",
          icon: "heart",
          color: "bg-red-500",
          priority: "high",
        },
        {
          id: 3,
          name: "Dubai Vacation",
          targetAmount: 800000,
          currentAmount: 320000,
          deadline: "2025-08-15",
          category: "Vacation",
          icon: "plane",
          color: "bg-orange-500",
          priority: "medium",
        },
      ]
      setGoals(defaultGoals)
      localStorage.setItem("userGoals", JSON.stringify(defaultGoals))
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      home: Home,
      car: Car,
      "graduation-cap": GraduationCap,
      plane: Plane,
      heart: Heart,
      briefcase: Briefcase,
      gift: Gift,
      sparkles: Sparkles,
    }
    const IconComponent = icons[iconName] || Target
    return <IconComponent size={20} className="text-white" />
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(deadline)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline || !newGoal.category) {
      alert("Please fill in all required fields")
      return
    }

    const categoryData = categories.find((c) => c.name === newGoal.category)

    const goal: Goal = {
      id: Date.now(),
      name: newGoal.name,
      targetAmount: Number.parseFloat(newGoal.targetAmount),
      currentAmount: Number.parseFloat(newGoal.currentAmount),
      deadline: newGoal.deadline,
      category: newGoal.category,
      icon: categoryData?.icon || "sparkles",
      color: categoryData?.color || "bg-gray-500",
      priority: newGoal.priority,
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    localStorage.setItem("userGoals", JSON.stringify(updatedGoals))

    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
      category: "",
      priority: "medium",
    })
    setShowAddModal(false)
  }

  const handleUpdateGoal = () => {
    if (!editingGoal) return

    const updatedGoals = goals.map((g) => (g.id === editingGoal.id ? editingGoal : g))
    setGoals(updatedGoals)
    localStorage.setItem("userGoals", JSON.stringify(updatedGoals))
    setEditingGoal(null)
  }

  const handleDeleteGoal = (id: number) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      const updatedGoals = goals.filter((g) => g.id !== id)
      setGoals(updatedGoals)
      localStorage.setItem("userGoals", JSON.stringify(updatedGoals))
    }
  }

  const handleContribute = () => {
    if (!showContributeModal || !contributeAmount) return

    const amount = Number.parseFloat(contributeAmount)
    if (amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    const updatedGoals = goals.map((g) =>
      g.id === showContributeModal.id ? { ...g, currentAmount: g.currentAmount + amount } : g,
    )
    setGoals(updatedGoals)
    localStorage.setItem("userGoals", JSON.stringify(updatedGoals))

    // Add transaction
    const savedTransactions = localStorage.getItem("allTransactions")
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : []

    const transaction = {
      id: Date.now(),
      type: "expense",
      category: "Savings",
      amount: amount,
      description: `Contribution to ${showContributeModal.name}`,
      date: new Date().toISOString(),
      status: "completed",
    }

    transactions.push(transaction)
    localStorage.setItem("allTransactions", JSON.stringify(transactions))

    setContributeAmount("")
    setShowContributeModal(null)
  }

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Financial Goals</h1>
          <button onClick={() => setShowAddModal(true)} className="p-2 hover:bg-white/10 rounded-full">
            <Plus size={20} />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Saved</p>
              <p className="text-xl font-bold">₦{totalCurrentAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Total Target</p>
              <p className="text-xl font-bold">₦{totalTargetAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="h-3 bg-white rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm opacity-90">{overallProgress.toFixed(1)}% achieved</p>
            <p className="text-sm opacity-90">₦{(totalTargetAmount - totalCurrentAmount).toLocaleString()} to go</p>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="p-4">
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl p-5 text-center">
            <Target className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No goals set</h3>
            <p className="text-gray-600 mb-4">Start planning your financial future by setting goals</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                return priorityOrder[a.priority] - priorityOrder[b.priority]
              })
              .map((goal) => {
                const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
                const daysRemaining = getDaysRemaining(goal.deadline)
                const isCompleted = progress >= 100

                return (
                  <div key={goal.id} className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-full ${goal.color} flex items-center justify-center`}>
                          {getIconComponent(goal.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{goal.name}</h3>
                          <p className="text-sm text-gray-500">{goal.category}</p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(goal.priority)}`}
                          >
                            {goal.priority} priority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted && <CheckCircle className="text-green-600" size={20} />}
                        <button
                          onClick={() => setEditingGoal(goal)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Edit2 className="text-gray-600" size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Trash2 className="text-red-600" size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-indigo-600">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-indigo-500"}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <span
                        className={`font-semibold ${
                          daysRemaining < 0 ? "text-red-600" : daysRemaining <= 30 ? "text-orange-600" : "text-gray-600"
                        }`}
                      >
                        {daysRemaining < 0
                          ? `${Math.abs(daysRemaining)} days overdue`
                          : daysRemaining === 0
                            ? "Due today"
                            : `${daysRemaining} days left`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Remaining</p>
                        <p className="text-lg font-bold text-gray-800">
                          ₦{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Monthly Target</p>
                        <p className="text-lg font-bold text-gray-800">
                          ₦
                          {daysRemaining > 0
                            ? Math.ceil(
                                (goal.targetAmount - goal.currentAmount) / (daysRemaining / 30),
                              ).toLocaleString()
                            : 0}
                        </p>
                      </div>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => setShowContributeModal(goal)}
                        className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
                      >
                        <DollarSign size={20} />
                        Add Contribution
                      </button>
                    )}

                    {isCompleted && (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={20} />
                        <p className="text-sm font-semibold text-green-700">Goal Achieved!</p>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}

        {/* Goal Insights */}
        {goals.length > 0 && (
          <div className="mt-3 bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              Goal Insights
            </h3>
            <div className="space-y-3">
              {goals.filter((g) => getProgressPercentage(g.currentAmount, g.targetAmount) >= 100).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800 mb-1">Completed Goals</p>
                  <p className="text-sm text-green-700">
                    You've achieved{" "}
                    {goals.filter((g) => getProgressPercentage(g.currentAmount, g.targetAmount) >= 100).length} out of{" "}
                    {goals.length} goals!
                  </p>
                </div>
              )}

              {goals.filter((g) => getDaysRemaining(g.deadline) <= 30 && getDaysRemaining(g.deadline) > 0).length >
                0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-800 mb-1">Approaching Deadlines</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {goals
                      .filter((g) => getDaysRemaining(g.deadline) <= 30 && getDaysRemaining(g.deadline) > 0)
                      .map((g) => (
                        <li key={g.id}>
                          • {g.name} - {getDaysRemaining(g.deadline)} days remaining
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-indigo-800 mb-1">Overall Progress</p>
                <p className="text-sm text-indigo-700">
                  You've saved ₦{totalCurrentAmount.toLocaleString()} towards your total goal of ₦
                  {totalTargetAmount.toLocaleString()} ({overallProgress.toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 w-full max-w-md my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Goal</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., New Apartment"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (₦)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount (₦)</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {["high", "medium", "low"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewGoal({ ...newGoal, priority: priority as any })}
                      className={`py-3 rounded-lg font-semibold capitalize ${
                        newGoal.priority === priority
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 w-full max-w-md my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Goal</h2>
              <button onClick={() => setEditingGoal(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (₦)</label>
                <input
                  type="number"
                  value={editingGoal.targetAmount}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: Number.parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount (₦)</label>
                <input
                  type="number"
                  value={editingGoal.currentAmount}
                  onChange={(e) => setEditingGoal({ ...editingGoal, currentAmount: Number.parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={editingGoal.deadline}
                  onChange={(e) => setEditingGoal({ ...editingGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {["high", "medium", "low"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setEditingGoal({ ...editingGoal, priority: priority as any })}
                      className={`py-3 rounded-lg font-semibold capitalize ${
                        editingGoal.priority === priority
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdateGoal}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Contribution</h2>
              <button onClick={() => setShowContributeModal(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Contributing to</p>
              <p className="text-lg font-semibold text-gray-800">{showContributeModal.name}</p>
              <p className="text-sm text-gray-600 mt-2">
                Current: ₦{showContributeModal.currentAmount.toLocaleString()} / ₦
                {showContributeModal.targetAmount.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setContributeAmount(amount.toString())}
                    className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700"
                  >
                    ₦{(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>

              <button
                onClick={handleContribute}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <DollarSign size={20} />
                Add Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
