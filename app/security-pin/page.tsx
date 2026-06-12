"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function SecurityPinPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handlePinInput = (value: string, isConfirm = false) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      if (isConfirm) {
        setConfirmPin(value)
      } else {
        setPin(value)
      }
    }
  }

  const handleCreatePin = () => {
    if (pin.length < 4) {
      alert("PIN must be at least 4 digits")
      return
    }

    if (pin !== confirmPin) {
      alert("PINs do not match")
      return
    }

    setIsCreating(true)

    // Save security PIN
    setTimeout(() => {
      localStorage.setItem("securityPin", pin)
      localStorage.setItem("pinCreated", "true")
      setIsCreating(false)
      alert("Security PIN created successfully!")
      router.push("/dashboard")
    }, 3000)
  }

  const getPinStrength = (pinValue: string) => {
    if (pinValue.length < 4) return { strength: "Weak", color: "text-red-500", width: "25%" }
    if (pinValue.length < 6) return { strength: "Medium", color: "text-yellow-500", width: "50%" }
    if (new Set(pinValue).size < 3) return { strength: "Medium", color: "text-yellow-500", width: "50%" }
    return { strength: "Strong", color: "text-green-500", width: "100%" }
  }

  const pinStrength = getPinStrength(pin)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Creating your security PIN...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we secure your account</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#4169E1" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Security PIN</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-8">
            <Shield className="mx-auto mb-4 text-blue-500" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Security PIN</h2>
            <p className="text-gray-600">Set up a secure PIN to protect your transactions</p>
          </div>

          {step === 1 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Create Your PIN</label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => handlePinInput(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 4-6 digit PIN"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {pin.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">PIN Strength</span>
                      <span className={`text-sm font-medium ${pinStrength.color}`}>{pinStrength.strength}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          pinStrength.strength === "Strong"
                            ? "bg-green-500"
                            : pinStrength.strength === "Medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: pinStrength.width }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">PIN Security Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use at least 4 digits (6 recommended)</li>
                  <li>• Avoid sequential numbers (1234, 5678)</li>
                  <li>• Don't use your birthday or phone number</li>
                  <li>• Mix different digits for better security</li>
                </ul>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={pin.length < 4}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Confirm Your PIN</label>
                <input
                  type={showPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => handlePinInput(e.target.value, true)}
                  className="w-full p-4 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Re-enter your PIN"
                  maxLength={6}
                />

                {confirmPin.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    {pin === confirmPin ? (
                      <>
                        <CheckCircle className="text-green-500" size={16} />
                        <span className="text-sm text-green-600">PINs match</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-red-500"></div>
                        <span className="text-sm text-red-600">PINs do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-green-500" size={20} />
                  <h4 className="font-semibold text-green-800">Security Benefits</h4>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Secure all your transactions</li>
                  <li>• Prevent unauthorized access</li>
                  <li>• Quick and easy authentication</li>
                  <li>• Enhanced account protection</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreatePin}
                  disabled={pin !== confirmPin || pin.length < 4}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create PIN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
