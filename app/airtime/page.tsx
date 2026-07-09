"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, ChevronDown } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"

export default function AirtimePage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [bpcCode, setBpcCode] = useState("")
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-500" },
    { id: "glo", name: "Glo", color: "bg-green-500" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "9mobile", name: "9mobile", color: "bg-green-600" },
  ]

  const amounts = ["₦100", "₦200", "₦500", "₦1,000", "₦2,000", "₦5,000"]

  const handlePurchase = () => {
    if (!phoneNumber || !amount || !selectedNetwork || !bpcCode) {
      setMessage("Please fill all fields")
      setMessageType("error")
      return
    }

    if (bpcCode !== "BPC2026_TELE_BOT_46Qa_VMC5") {
      setMessage("Invalid BPC CODE kindly purchase a valid BPC CODE directly from BLUEPAY2026 platform")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    setTimeout(() => {
      setIsLoading(false)

      const selectedNetworkName = networks.find((n) => n.id === selectedNetwork)?.name || ""
      const numericAmount = Number.parseInt(amount.replace(/[₦,]/g, ""))

      saveTransaction({
        type: "expense",
        category: "Airtime",
        description: `${selectedNetworkName} Airtime`,
        amount: numericAmount,
        date: new Date().toISOString().split("T")[0],
        phoneNumber,
        network: selectedNetworkName,
      })

      const transactionData = {
        type: "airtime",
        phoneNumber,
        amount,
        network: selectedNetworkName,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("lastTransaction", JSON.stringify(transactionData))

      const currentBalance = localStorage.getItem("userBalance") || "200000"
      const newBalance = Number.parseInt(currentBalance) - numericAmount
      localStorage.setItem("userBalance", newBalance.toString())

      router.push("/transaction-success")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Processing airtime purchase...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Buy Airtime</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-xl mb-4 ${
              messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-semibold text-center">{message}</p>
          </div>
        )}

        {/* Phone Number Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none"
              style={{ borderColor: "#0000FF" }}
            />
          </div>
        </div>

        {/* Network Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Network</label>
          <div className="relative">
            <button
              onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              className="w-full p-4 border-2 rounded-xl flex items-center justify-between focus:outline-none"
              style={{ borderColor: "#0000FF" }}
            >
              <span className={selectedNetwork ? "text-gray-800" : "text-gray-400"}>
                {selectedNetwork ? networks.find((n) => n.id === selectedNetwork)?.name : "Choose network"}
              </span>
              <ChevronDown size={20} className="text-gray-400" />
            </button>

            {showNetworkDropdown && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 rounded-xl shadow-lg z-10"
                style={{ borderColor: "#0000FF" }}
              >
                {networks.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => {
                      setSelectedNetwork(network.id)
                      setShowNetworkDropdown(false)
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className={`w-4 h-4 rounded-full ${network.color}`}></div>
                    <span>{network.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Amount</label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`p-3 rounded-xl border-2 font-semibold ${
                  amount === amt ? "bg-blue-50" : "border-gray-200 text-gray-700 hover:border-blue-300"
                }`}
                style={{
                  borderColor: amount === amt ? "#0000FF" : "#d1d5db",
                  color: amount === amt ? "#0000FF" : undefined,
                }}
              >
                {amt}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Or enter custom amount"
            className="w-full p-4 border-2 rounded-xl focus:outline-none"
            style={{ borderColor: "#0000FF" }}
          />
        </div>

        {/* BPC Code Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">BPC Code</label>
          <input
            type="text"
            value={bpcCode}
            onChange={(e) => setBpcCode(e.target.value)}
            placeholder="Enter your BPC code"
            className="w-full p-4 border-2 rounded-xl focus:outline-none"
            style={{ borderColor: "#0000FF" }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Don't have a BPC code?{" "}
            <button
              onClick={() => router.push("/buy-bpc")}
              className="font-semibold hover:underline"
              style={{ color: "#0000FF" }}
            >
              Buy BPC Code
            </button>
          </p>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50"
          style={{ backgroundColor: "#0000FF" }}
        >
          {isLoading ? "Processing..." : "Purchase Airtime"}
        </button>

        {/* Info Card */}
        <div className="mt-3 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold mb-2" style={{ color: "#0000FF" }}>
            Purchase Information
          </h3>
          <ul className="text-sm space-y-1" style={{ color: "#0000FF" }}>
            <li>• Airtime will be delivered instantly</li>
            <li>• Valid BPC code required for purchase</li>
            <li>• Transaction history available in profile</li>
            <li>• 24/7 customer support available</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
