"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, ChevronDown, Wifi } from "lucide-react"
import { saveTransaction } from "@/lib/transactions"

export default function DataPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
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

  const dataPlans = [
    { id: "100mb", size: "100MB", price: "₦100", validity: "1 Day" },
    { id: "500mb", size: "500MB", price: "₦200", validity: "3 Days" },
    { id: "1gb", size: "1GB", price: "₦350", validity: "7 Days" },
    { id: "2gb", size: "2GB", price: "₦700", validity: "14 Days" },
    { id: "5gb", size: "5GB", price: "₦1,500", validity: "30 Days" },
    { id: "10gb", size: "10GB", price: "₦2,500", validity: "30 Days" },
  ]

  const handlePurchase = () => {
    if (!phoneNumber || !selectedPlan || !selectedNetwork || !bpcCode) {
      setMessage("Please fill all fields")
      setMessageType("error")
      return
    }

    if (bpcCode !== "BPC2025_40@_BOT_ROBOT") {
      setMessage("wrong BPC CODE")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    setTimeout(() => {
      setIsLoading(false)

      const selectedPlanDetails = dataPlans.find((plan) => plan.id === selectedPlan)
      const selectedNetworkName = networks.find((n) => n.id === selectedNetwork)?.name || ""
      const numericAmount = Number.parseInt(selectedPlanDetails?.price.replace(/[₦,]/g, "") || "0")

      saveTransaction({
        type: "expense",
        category: "Data",
        description: `${selectedNetworkName} ${selectedPlanDetails?.size} Data`,
        amount: numericAmount,
        date: new Date().toISOString().split("T")[0],
        phoneNumber,
        network: selectedNetworkName,
      })

      const transactionData = {
        type: "data",
        phoneNumber,
        plan: selectedPlanDetails?.size,
        amount: selectedPlanDetails?.price,
        network: selectedNetworkName,
        validity: selectedPlanDetails?.validity,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("lastTransaction", JSON.stringify(transactionData))

      const currentBalance = localStorage.getItem("userBalance") || "200000"
      const newBalance = Number.parseInt(currentBalance) - numericAmount
      localStorage.setItem("userBalance", newBalance.toString())

      router.push("/transaction-success")
    }, 3000)
  }

  const selectedPlanDetails = dataPlans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Processing data purchase...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Buy Data</h1>
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

        {/* Data Plan Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Data Plan</label>
          <div className="grid grid-cols-2 gap-3">
            {dataPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-xl border-2 text-left ${
                  selectedPlan === plan.id ? "bg-blue-50" : "hover:border-blue-300"
                }`}
                style={{ borderColor: selectedPlan === plan.id ? "#0000FF" : "#d1d5db" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wifi size={16} style={{ color: "#0000FF" }} />
                  <span className="font-bold text-gray-800">{plan.size}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.price}</p>
                <p className="text-xs text-gray-500">{plan.validity}</p>
              </button>
            ))}
          </div>

          {/* Selected Plan Summary */}
          {selectedPlanDetails && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold mb-2" style={{ color: "#0000FF" }}>
                Selected Plan
              </h4>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold" style={{ color: "#0000FF" }}>
                    {selectedPlanDetails.size}
                  </p>
                  <p className="text-sm" style={{ color: "#0000FF" }}>
                    Valid for {selectedPlanDetails.validity}
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: "#0000FF" }}>
                  {selectedPlanDetails.price}
                </p>
              </div>
            </div>
          )}
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
          {isLoading ? "Processing..." : "Purchase Data"}
        </button>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold mb-2" style={{ color: "#0000FF" }}>
            Purchase Information
          </h3>
          <ul className="text-sm space-y-1" style={{ color: "#0000FF" }}>
            <li>• Data will be delivered instantly</li>
            <li>• Valid BPC code required for purchase</li>
            <li>• Check data balance by dialing network code</li>
            <li>• 24/7 customer support available</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
