"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Fingerprint, X } from "lucide-react"

export default function VerifyPinPage() {
  const router = useRouter()
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [attempts, setAttempts] = useState(0)

  const handleNumberClick = (number: string) => {
    if (currentIndex < 4) {
      const newPin = [...pin]
      newPin[currentIndex] = number
      setPin(newPin)
      setCurrentIndex(currentIndex + 1)

      if (currentIndex === 3) {
        verifyPin([...newPin, number].join(""))
      }
    }
  }

  const verifyPin = (enteredPin: string) => {
    const storedPin = localStorage.getItem("userPin")

    if (enteredPin === storedPin) {
      setShowSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } else {
      setErrorMessage("Wrong PIN. Please try again.")
      setAttempts(attempts + 1)
      setPin(["", "", "", ""])
      setCurrentIndex(0)

      if (attempts >= 2) {
        setErrorMessage("Too many incorrect attempts. Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }
  }

  const handleBackspace = () => {
    if (currentIndex > 0) {
      const newPin = [...pin]
      newPin[currentIndex - 1] = ""
      setPin(newPin)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFingerprint = () => {
    setShowSuccess(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#0000FF" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white text-xl">Verifying PIN...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0000FF" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-xl font-semibold">Enter PIN</h1>
        <div className="w-6"></div>
      </div>

      {/* PIN Entry Section */}
      <div className="flex-1 px-5 flex flex-col justify-center">
        <div className="text-center mb-4">
          <h2 className="text-white text-xl font-bold mb-2">Enter Your PIN</h2>
          <p className="text-white/80">Enter your 4-digit PIN or use fingerprint</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 mb-20">
          {pin.map((digit, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center"
            >
              {digit && <div className="w-4 h-4 rounded-full bg-white"></div>}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center mb-4">
            <p className="text-white font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number.toString())}
              className="w-16 h-16 flex items-center justify-center text-white text-xl font-semibold hover:bg-white/10 rounded-full transition-colors"
            >
              {number}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 max-w-xs mx-auto">
          <button
            onClick={() => handleNumberClick("0")}
            className="w-16 h-16 flex items-center justify-center text-white text-xl font-semibold hover:bg-white/10 rounded-full transition-colors"
          >
            0
          </button>
          <button
            onClick={handleFingerprint}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <Fingerprint size={20} style={{ color: "#0000FF" }} />
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <X size={20} style={{ color: "#0000FF" }} />
          </button>
        </div>
      </div>
    </div>
  )
}
