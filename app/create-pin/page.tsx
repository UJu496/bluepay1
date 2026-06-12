"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Fingerprint, X, Camera, Upload } from "lucide-react"

export default function CreatePinPage() {
  const router = useRouter()
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)

  const handleNumberClick = (number: string) => {
    if (currentIndex < 4) {
      const newPin = [...pin]
      newPin[currentIndex] = number
      setPin(newPin)
      setCurrentIndex(currentIndex + 1)

      if (currentIndex === 3) {
        const completedPin = [...pin, number].join("")
        localStorage.setItem("userPin", completedPin)
        setShowSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
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
    }, 5000)
  }

  const handleResetPasscode = () => {
    setShowResetModal(true)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photoData = e.target?.result as string
        setProfilePhoto(photoData)
        localStorage.setItem("userProfilePhoto", photoData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmReset = () => {
    // Clear PIN and reset state
    setPin(["", "", "", ""])
    setCurrentIndex(0)
    setShowResetModal(false)
    // Navigate back to registration
    router.push("/get-started")
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0000FF" }}>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center items-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
                <div
                  className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 animate-spin"
                  style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                ></div>
                <div className="absolute inset-4 rounded-full bg-blue-600 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset your password? This will clear your current PIN and redirect you to create
              a new account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white text-xl font-semibold">Create PIN</h1>
        <div className="text-white">
          <User size={24} />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera size={32} className="text-white" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <Upload size={16} style={{ color: "#0000FF" }} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>
        <p className="text-white/70 text-sm text-center mt-2">Upload photo (optional)</p>
      </div>

      {/* PIN Entry Section */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-bold mb-2">Choose Your Security Method</h2>
          <p className="text-white/80">Create a 4-digit PIN or use fingerprint authentication</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-6 mb-20">
          {pin.map((digit, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center"
            >
              {digit && <div className="w-4 h-4 rounded-full bg-white"></div>}
            </div>
          ))}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-8 max-w-xs mx-auto mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number.toString())}
              className="w-16 h-16 flex items-center justify-center text-white text-2xl font-semibold hover:bg-white/10 rounded-full transition-colors"
            >
              {number}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-8 max-w-xs mx-auto mb-8">
          <button
            onClick={() => handleNumberClick("0")}
            className="w-16 h-16 flex items-center justify-center text-white text-2xl font-semibold hover:bg-white/10 rounded-full transition-colors"
          >
            0
          </button>
          <button
            onClick={handleFingerprint}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <Fingerprint size={24} style={{ color: "#0000FF" }} />
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <X size={24} style={{ color: "#0000FF" }} />
          </button>
        </div>

        {/* Clear instructions for both authentication methods */}
        <div className="text-center mb-6">
          <p className="text-white/90 text-sm mb-2">
            Enter 4 digits above OR tap the fingerprint icon for quick access
          </p>
        </div>

        <div className="text-center">
          <p className="text-white text-lg mb-2">Forgotten your passcode?</p>
          <button
            onClick={handleResetPasscode}
            className="text-white text-lg font-semibold underline hover:text-white/80 transition-colors"
          >
            Reset passcode
          </button>
        </div>
      </div>
    </div>
  )
}
