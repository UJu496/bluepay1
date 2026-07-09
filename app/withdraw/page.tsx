"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"

export default function WithdrawPage() {
  const router = useRouter()
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [amount, setAmount] = useState("")
  const [bpcCode, setBpcCode] = useState("")
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [balance, setBalance] = useState(200000)

  const banks = [
    "Access Bank",
    "GTBank",
    "First Bank",
    "UBA",
    "Zenith Bank",
    "Fidelity Bank",
    "FCMB",
    "Sterling Bank",
    "Union Bank",
    "Wema Bank",
    "Stanbic IBTC",
    "Ecobank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Unity Bank",
    "Providus Bank",
    "Jaiz Bank",
    "SunTrust Bank",
    "Titan Trust Bank",
    "Globus Bank",
    "PalmPay",
    "OPay",
    "Kuda Bank",
    "Moniepoint",
    "Sparkle",
    "VFD Microfinance Bank",
    "Rubies Bank",
    "Carbon",
    "ALAT by Wema",
    "Eyowo",
    "Paga",
    "Paystack",
    "Flutterwave",
    "Interswitch",
    "Remita",
  ]

  useEffect(() => {
    const savedBalance = localStorage.getItem("userBalance")
    if (savedBalance) {
      setBalance(Number.parseInt(savedBalance))
    }
  }, [])

  const handleBuyBPCCode = () => {
    router.push("/buy-bpc")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!accountName || !accountNumber || !selectedBank || !amount || !bpcCode) {
      setError("Please fill all fields")
      return
    }

    if (accountNumber.length !== 10) {
      setError("Account number must be 10 digits")
      return
    }

    const withdrawAmount = Number.parseInt(amount)
    if (withdrawAmount > balance) {
      setError("Insufficient balance")
      return
    }

    if (bpcCode !== "BPC2026_TELE_BOT_46Qa_VMC5") {
      setError("Invalid BPC CODE kindly purchase a valid BPC CODE directly from BLUEPAY2026 platform")
      return
    }

    saveTransaction({
      type: "expense",
      category: "Withdrawal",
      description: `Withdrawal to ${selectedBank}`,
      amount: withdrawAmount,
      date: new Date().toISOString().split("T")[0],
      accountNumber,
      bankName: selectedBank,
      userName: accountName,
    })

    const withdrawalData = {
      accountName,
      accountNumber,
      selectedBank,
      amount: withdrawAmount,
      balance,
    }
    localStorage.setItem("withdrawalData", JSON.stringify(withdrawalData))
    router.push("/withdrawal-confirmation")
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center p-3 pt-8 relative" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()} className="absolute left-3 text-white">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-white text-base font-bold">Transfer To Bank</h1>
      </div>

      <div className="p-3 max-w-md mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Bank Details</h2>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full p-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Account Number (10 digits)"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full p-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBankDropdown(!showBankDropdown)}
              className="w-full p-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-gray-800 text-left flex items-center justify-between"
            >
              <span className={selectedBank ? "text-gray-800" : "text-gray-500"}>{selectedBank || "Select Bank"}</span>
              <ChevronDown size={18} />
            </button>

            {showBankDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-blue-500 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => {
                      setSelectedBank(bank)
                      setShowBankDropdown(false)
                    }}
                    className="w-full p-2 text-sm text-left hover:bg-blue-50 text-gray-800"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="BPC CODE (Buy BPC)"
              value={bpcCode}
              onChange={(e) => setBpcCode(e.target.value)}
              className="w-full p-3 text-sm border-2 border-blue-500 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
          </div>

          <button type="button" onClick={handleBuyBPCCode} className="text-sm text-blue-600 font-semibold hover:underline">
            Buy BPC code
          </button>

          {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

          <div className="mt-2">
            <p className="text-sm font-bold text-gray-800">Available Balance: ₦{balance.toLocaleString()}</p>
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-lg text-white font-bold text-sm mt-2"
            style={{ backgroundColor: "#0000FF" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
