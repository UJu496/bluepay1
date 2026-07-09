"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  X,
  Check,
} from "lucide-react"
import { getTransactions, saveTransaction } from "@/lib/transactions"

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("all")

  // Form state for adding transactions
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    userName: "Manual Entry",
    bpcCode: "",
  })

  const categories = {
    income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"],
    expense: [
      "Airtime",
      "Data",
      "Bills",
      "Shopping",
      "Food",
      "Transport",
      "Entertainment",
      "Withdrawal",
      "Order ATM",
      "Other",
    ],
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchQuery, selectedFilter, selectedMonth])

  const loadTransactions = () => {
    const allTransactions = getTransactions()
    setTransactions(allTransactions)
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    // Filter out BPC transactions and only show actual service transactions (Withdraw, Airtime, Data, Order ATM)
    const validCategories = ["Withdrawal", "Airtime", "Data", "ATM Order"]
    filtered = filtered.filter((t) => validCategories.includes(t.category))

    // Filter by type
    if (selectedFilter !== "all") {
      filtered = filtered.filter((t) => t.type === selectedFilter)
    }

    // Filter by month
    if (selectedMonth !== "all") {
      filtered = filtered.filter((t) => {
        const transactionMonth = new Date(t.date).getMonth()
        return transactionMonth === Number.parseInt(selectedMonth)
      })
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.phoneNumber?.includes(searchQuery) ||
          t.accountNumber?.includes(searchQuery),
      )
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredTransactions(filtered)
  }

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      alert("Please fill in all fields")
      return
    }

    saveTransaction({
      type: newTransaction.type,
      description: newTransaction.description,
      amount: Number.parseFloat(newTransaction.amount),
      date: newTransaction.date,
      category: newTransaction.category,
      userName: newTransaction.userName,
      bpcCode: newTransaction.bpcCode || undefined,
      timestamp: new Date().toISOString(),
    })

    // Update balance
    const currentBalance = Number.parseInt(localStorage.getItem("userBalance") || "200000")
    const newBalance =
      newTransaction.type === "income"
        ? currentBalance + Number.parseFloat(newTransaction.amount)
        : currentBalance - Number.parseFloat(newTransaction.amount)
    localStorage.setItem("userBalance", newBalance.toString())

    // Reload transactions
    loadTransactions()

    // Reset form
    setNewTransaction({
      type: "expense",
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      userName: "Manual Entry",
      bpcCode: "",
    })
    setShowAddModal(false)
  }

  const calculateTotals = () => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses, net: income - expenses }
  }

  const totals = calculateTotals()

  const exportTransactions = () => {
    const csv = [
      ["Date", "Time", "Type", "Category", "Description", "Amount", "User/Account", "Phone/Bank"],
      ...filteredTransactions.map((t) => [
        t.date,
        new Date(t.timestamp).toLocaleTimeString(),
        t.type,
        t.category,
        t.description,
        t.type === "income" ? t.amount : -t.amount,
        t.userName || "",
        t.phoneNumber || t.accountNumber || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push("/dashboard")} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Recent Transactions</h1>
          <button onClick={() => setShowAddModal(true)} className="p-1.5 hover:bg-blue-50 rounded-full text-blue-600">
            <Plus size={20} />
          </button>
        </div>

        {/* Summary Cards - Modern Card Design */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border border-blue-200">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <TrendingUp size={12} className="text-white" />
              </div>
              <p className="text-xs text-gray-700 font-medium">Income</p>
            </div>
            <p className="text-sm font-bold text-gray-900">₦{totals.income.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-3 border border-red-200">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <TrendingDown size={12} className="text-white" />
              </div>
              <p className="text-xs text-gray-700 font-medium">Expenses</p>
            </div>
            <p className="text-sm font-bold text-gray-900">₦{totals.expenses.toLocaleString()}</p>
          </div>
          <div className={`bg-gradient-to-br ${totals.net >= 0 ? "from-green-50 to-green-100" : "from-yellow-50 to-yellow-100"} rounded-2xl p-3 border ${totals.net >= 0 ? "border-green-200" : "border-yellow-200"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-6 h-6 rounded-full ${totals.net >= 0 ? "bg-green-500" : "bg-yellow-500"} flex items-center justify-center`}>
                <Wallet size={12} className="text-white" />
              </div>
              <p className="text-xs text-gray-700 font-medium">Net</p>
            </div>
            <p className={`text-sm font-bold ${totals.net >= 0 ? "text-green-700" : "text-yellow-700"}`}>
              ₦{totals.net.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-3 shadow-sm">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-1.5 hover:bg-blue-700 text-sm"
          >
            <Filter size={16} />
          </button>
          <button
            onClick={exportTransactions}
            className="px-3 py-1.5 text-white rounded-lg flex items-center gap-1.5 hover:opacity-90 text-sm"
            style={{ backgroundColor: "#0000FF" }}
          >
            <Download size={16} />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              selectedFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter("income")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              selectedFilter === "income" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setSelectedFilter("expense")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              selectedFilter === "expense" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center mt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No transactions yet</h3>
            <p className="text-sm text-gray-600 mb-6">Start tracking your financial activities</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 text-sm text-white rounded-full font-semibold hover:opacity-90"
              style={{ backgroundColor: "#0000FF" }}
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownRight className="text-green-600" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{transaction.description}</p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                          {transaction.category}
                        </span>
                        {transaction.userName && (
                          <span className="text-xs text-gray-600 truncate">{transaction.userName}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5">
                        {transaction.date} • {new Date(transaction.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className={`text-base font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income", category: "" })}
                    className={`py-3 rounded-lg font-semibold ${
                      newTransaction.type === "income" ? "text-white" : "bg-gray-200 text-gray-700"
                    }`}
                    style={newTransaction.type === "income" ? { backgroundColor: "#0000FF" } : {}}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense", category: "" })}
                    className={`py-3 rounded-lg font-semibold ${
                      newTransaction.type === "expense" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories[newTransaction.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  placeholder="Enter description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>



              {/* Submit Button */}
              <button
                onClick={handleAddTransaction}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filter Transactions</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Months</option>
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
