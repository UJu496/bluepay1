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
    <div className="min-h-screen bg-gray-100 pb-20">
      <div style={{ backgroundColor: "#0000FF" }} className="text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">All Transactions</h1>
          <button onClick={() => setShowAddModal(true)} className="p-2 hover:bg-white/10 rounded-full">
            <Plus size={24} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} />
              <p className="text-xs opacity-90">Income</p>
            </div>
            <p className="text-lg font-bold">₦{totals.income.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={16} />
              <p className="text-xs opacity-90">Expenses</p>
            </div>
            <p className="text-lg font-bold">₦{totals.expenses.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={16} />
              <p className="text-xs opacity-90">Net</p>
            </div>
            <p className={`text-lg font-bold ${totals.net >= 0 ? "text-green-300" : "text-red-300"}`}>
              ₦{totals.net.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={exportTransactions}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={20} />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter("income")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedFilter === "income" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setSelectedFilter("expense")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedFilter === "expense" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Wallet className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first transaction</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownRight className="text-green-600" size={24} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{transaction.description}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500">{transaction.category}</span>
                          {transaction.userName && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-600 font-medium">{transaction.userName}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {transaction.phoneNumber && (
                            <span className="text-xs text-blue-600 font-medium">{transaction.phoneNumber}</span>
                          )}
                          {transaction.accountNumber && (
                            <>
                              <span className="text-xs text-blue-600 font-medium">{transaction.accountNumber}</span>
                              {transaction.bankName && (
                                <>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">{transaction.bankName}</span>
                                </>
                              )}
                            </>
                          )}
                          {transaction.network && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{transaction.network}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{transaction.date}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
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
                      newTransaction.type === "income" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
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

              {/* BPC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BPC Code (Optional)</label>
                <input
                  type="text"
                  value={newTransaction.bpcCode}
                  onChange={(e) => setNewTransaction({ ...newTransaction, bpcCode: e.target.value })}
                  placeholder="e.g., BPC2026_BOT_759_QTU"
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filter Transactions</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
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
