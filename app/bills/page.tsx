"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Bell,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Save,
  Zap,
  Wifi,
  Home,
  Phone,
  Tv,
  CreditCard,
} from "lucide-react"

interface Bill {
  id: number
  name: string
  category: string
  amount: number
  dueDate: string
  frequency: "monthly" | "weekly" | "yearly" | "one-time"
  status: "paid" | "pending" | "overdue"
  reminderDays: number
  autoPayEnabled: boolean
  icon: string
}

export default function BillsPage() {
  const router = useRouter()
  const [bills, setBills] = useState<Bill[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBill, setEditingBill] = useState<Bill | null>(null)
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all")

  const [newBill, setNewBill] = useState({
    name: "",
    category: "",
    amount: "",
    dueDate: "",
    frequency: "monthly" as "monthly" | "weekly" | "yearly" | "one-time",
    reminderDays: "3",
    autoPayEnabled: false,
  })

  const categories = [
    { name: "Electricity", icon: "zap" },
    { name: "Internet", icon: "wifi" },
    { name: "Rent", icon: "home" },
    { name: "Phone", icon: "phone" },
    { name: "Cable TV", icon: "tv" },
    { name: "Subscription", icon: "credit-card" },
    { name: "Other", icon: "dollar-sign" },
  ]

  useEffect(() => {
    loadBills()
  }, [])

  const loadBills = () => {
    const savedBills = localStorage.getItem("userBills")
    if (savedBills) {
      const parsedBills = JSON.parse(savedBills)
      // Update bill statuses
      const updatedBills = parsedBills.map((bill: Bill) => ({
        ...bill,
        status: getBillStatus(bill.dueDate, bill.status),
      }))
      setBills(updatedBills)
      localStorage.setItem("userBills", JSON.stringify(updatedBills))
    } else {
      // Default bills
      const defaultBills: Bill[] = [
        {
          id: 1,
          name: "NEPA Electricity",
          category: "Electricity",
          amount: 15000,
          dueDate: "2025-01-15",
          frequency: "monthly",
          status: "pending",
          reminderDays: 3,
          autoPayEnabled: false,
          icon: "zap",
        },
        {
          id: 2,
          name: "MTN Internet",
          category: "Internet",
          amount: 12000,
          dueDate: "2025-01-10",
          frequency: "monthly",
          status: "paid",
          reminderDays: 3,
          autoPayEnabled: true,
          icon: "wifi",
        },
        {
          id: 3,
          name: "House Rent",
          category: "Rent",
          amount: 250000,
          dueDate: "2025-01-01",
          frequency: "yearly",
          status: "overdue",
          reminderDays: 7,
          autoPayEnabled: false,
          icon: "home",
        },
      ]
      setBills(defaultBills)
      localStorage.setItem("userBills", JSON.stringify(defaultBills))
    }
  }

  const getBillStatus = (dueDate: string, currentStatus: string): "paid" | "pending" | "overdue" => {
    if (currentStatus === "paid") return "paid"

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    if (due < today) return "overdue"
    return "pending"
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      zap: Zap,
      wifi: Wifi,
      home: Home,
      phone: Phone,
      tv: Tv,
      "credit-card": CreditCard,
      "dollar-sign": DollarSign,
    }
    const IconComponent = icons[iconName] || DollarSign
    return <IconComponent size={24} className="text-white" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-orange-500"
      case "overdue":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={20} className="text-green-600" />
      case "pending":
        return <Clock size={20} className="text-orange-600" />
      case "overdue":
        return <AlertCircle size={20} className="text-red-600" />
      default:
        return <Clock size={20} className="text-gray-600" />
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAddBill = () => {
    if (!newBill.name || !newBill.category || !newBill.amount || !newBill.dueDate) {
      alert("Please fill in all required fields")
      return
    }

    const categoryIcon = categories.find((c) => c.name === newBill.category)?.icon || "dollar-sign"

    const bill: Bill = {
      id: Date.now(),
      name: newBill.name,
      category: newBill.category,
      amount: Number.parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      frequency: newBill.frequency,
      status: getBillStatus(newBill.dueDate, "pending"),
      reminderDays: Number.parseInt(newBill.reminderDays),
      autoPayEnabled: newBill.autoPayEnabled,
      icon: categoryIcon,
    }

    const updatedBills = [...bills, bill]
    setBills(updatedBills)
    localStorage.setItem("userBills", JSON.stringify(updatedBills))

    setNewBill({
      name: "",
      category: "",
      amount: "",
      dueDate: "",
      frequency: "monthly",
      reminderDays: "3",
      autoPayEnabled: false,
    })
    setShowAddModal(false)
  }

  const handleUpdateBill = () => {
    if (!editingBill) return

    const updatedBills = bills.map((b) => (b.id === editingBill.id ? editingBill : b))
    setBills(updatedBills)
    localStorage.setItem("userBills", JSON.stringify(updatedBills))
    setEditingBill(null)
  }

  const handleDeleteBill = (id: number) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      const updatedBills = bills.filter((b) => b.id !== id)
      setBills(updatedBills)
      localStorage.setItem("userBills", JSON.stringify(updatedBills))
    }
  }

  const handleMarkAsPaid = (id: number) => {
    const updatedBills = bills.map((b) => (b.id === id ? { ...b, status: "paid" as const } : b))
    setBills(updatedBills)
    localStorage.setItem("userBills", JSON.stringify(updatedBills))

    // Add transaction
    const bill = bills.find((b) => b.id === id)
    if (bill) {
      const savedTransactions = localStorage.getItem("allTransactions")
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : []

      const transaction = {
        id: Date.now(),
        type: "expense",
        category: bill.category,
        amount: bill.amount,
        description: `${bill.name} - Bill Payment`,
        date: new Date().toISOString(),
        status: "completed",
      }

      transactions.push(transaction)
      localStorage.setItem("allTransactions", JSON.stringify(transactions))
    }
  }

  const filteredBills = bills.filter((bill) => {
    if (filter === "all") return true
    return bill.status === filter
  })

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0)
  const paidBills = bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.amount, 0)
  const pendingBills = bills.filter((b) => b.status === "pending").reduce((sum, b) => sum + b.amount, 0)
  const overdueBills = bills.filter((b) => b.status === "overdue").reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Bills & Reminders</h1>
          <button onClick={() => setShowAddModal(true)} className="p-2 hover:bg-white/10 rounded-full">
            <Plus size={24} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90 mb-1">Total Bills</p>
            <p className="text-xl font-bold">₦{totalBills.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90 mb-1">Paid</p>
            <p className="text-xl font-bold text-green-300">₦{paidBills.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90 mb-1">Pending</p>
            <p className="text-xl font-bold text-orange-300">₦{pendingBills.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90 mb-1">Overdue</p>
            <p className="text-xl font-bold text-red-300">₦{overdueBills.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "pending", "paid", "overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === status ? "bg-white text-purple-600" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      <div className="p-4">
        {filteredBills.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No bills found</h3>
            <p className="text-gray-600 mb-4">
              {filter === "all" ? "Start tracking your bills and never miss a payment" : `No ${filter} bills`}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Bill
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBills.map((bill) => {
              const daysUntil = getDaysUntilDue(bill.dueDate)
              return (
                <div key={bill.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${getStatusColor(bill.status)} flex items-center justify-center flex-shrink-0`}
                    >
                      {getIconComponent(bill.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{bill.name}</h3>
                          <p className="text-xs text-gray-500">{bill.category}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {getStatusIcon(bill.status)}
                          <button
                            onClick={() => setEditingBill(bill)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit2 className="text-gray-600" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Trash2 className="text-red-600" size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-gray-800">₦{bill.amount.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 capitalize">{bill.frequency}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar size={14} />
                          <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                        </div>
                        {bill.status !== "paid" && (
                          <span
                            className={`text-xs font-semibold ${
                              daysUntil < 0
                                ? "text-red-600"
                                : daysUntil <= bill.reminderDays
                                  ? "text-orange-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {daysUntil < 0
                              ? `${Math.abs(daysUntil)} days overdue`
                              : daysUntil === 0
                                ? "Due today"
                                : `${daysUntil} days left`}
                          </span>
                        )}
                      </div>

                      {bill.autoPayEnabled && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                          <Zap size={12} />
                          <span>Auto-pay enabled</span>
                        </div>
                      )}

                      {bill.status !== "paid" && (
                        <button
                          onClick={() => handleMarkAsPaid(bill.id)}
                          className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-sm"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Upcoming Reminders */}
        {bills.filter(
          (b) => b.status === "pending" && getDaysUntilDue(b.dueDate) <= 7 && getDaysUntilDue(b.dueDate) >= 0,
        ).length > 0 && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <Bell className="text-orange-600" size={20} />
              Upcoming Bills
            </h3>
            <div className="space-y-2">
              {bills
                .filter(
                  (b) => b.status === "pending" && getDaysUntilDue(b.dueDate) <= 7 && getDaysUntilDue(b.dueDate) >= 0,
                )
                .map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between text-sm">
                    <span className="text-orange-700">{bill.name}</span>
                    <span className="font-semibold text-orange-800">
                      {getDaysUntilDue(bill.dueDate) === 0 ? "Due today" : `${getDaysUntilDue(bill.dueDate)} days`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Bill</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Name</label>
                <input
                  type="text"
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  placeholder="e.g., NEPA Electricity"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newBill.category}
                  onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={newBill.frequency}
                  onChange={(e) => setNewBill({ ...newBill, frequency: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder (days before)</label>
                <input
                  type="number"
                  value={newBill.reminderDays}
                  onChange={(e) => setNewBill({ ...newBill, reminderDays: e.target.value })}
                  placeholder="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Enable Auto-pay</p>
                  <p className="text-xs text-gray-600">Automatically pay this bill</p>
                </div>
                <button
                  onClick={() => setNewBill({ ...newBill, autoPayEnabled: !newBill.autoPayEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    newBill.autoPayEnabled ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      newBill.autoPayEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              <button
                onClick={handleAddBill}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bill Modal */}
      {editingBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Bill</h2>
              <button onClick={() => setEditingBill(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Name</label>
                <input
                  type="text"
                  value={editingBill.name}
                  onChange={(e) => setEditingBill({ ...editingBill, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={editingBill.amount}
                  onChange={(e) => setEditingBill({ ...editingBill, amount: Number.parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={editingBill.dueDate}
                  onChange={(e) => setEditingBill({ ...editingBill, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingBill.status}
                  onChange={(e) => setEditingBill({ ...editingBill, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder (days before)</label>
                <input
                  type="number"
                  value={editingBill.reminderDays}
                  onChange={(e) => setEditingBill({ ...editingBill, reminderDays: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Enable Auto-pay</p>
                  <p className="text-xs text-gray-600">Automatically pay this bill</p>
                </div>
                <button
                  onClick={() => setEditingBill({ ...editingBill, autoPayEnabled: !editingBill.autoPayEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    editingBill.autoPayEnabled ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      editingBill.autoPayEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              <button
                onClick={handleUpdateBill}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
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
