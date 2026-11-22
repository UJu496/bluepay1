"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, X, Camera, Upload } from "lucide-react"
import Link from "next/link"
import { getCurrentUserPin, hasUnassignedLegacyPin, saveCurrentUserPin } from "@/lib/user-pin"

export default function CreatePinPage() {
  const router = useRouter()
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    if (getCurrentUserPin() || hasUnassignedLegacyPin()) router.replace("/change-pin")
  }, [router])

  const handleNumberClick = (number: string) => {
    if (currentIndex < 4) {
      const newPin = [...pin]
      newPin[currentIndex] = number
      setPin(newPin)
      setCurrentIndex(currentIndex + 1)

      if (currentIndex === 3) {
        const completedPin = [...pin, number].join("")
        if (!saveCurrentUserPin(completedPin)) return
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0000FF" }}>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 text-center">
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

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-xl font-semibold">Create PIN</h1>
        <div className="text-white">
          <User size={20} />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="px-5 mb-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img src={profilePhoto || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera size={20} className="text-white" />
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
      <div className="flex-1 px-5 flex flex-col justify-center">
        <div className="text-center mb-4">
          <h2 className="text-white text-xl font-bold mb-2">Create your BLUEPAY PIN</h2>
          <p className="text-white/80">Set a 4-digit PIN to protect your account</p>
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

        <div className="flex justify-center items-center gap-4 max-w-xs mx-auto mb-4">
          <span aria-hidden="true" className="w-16" />
          <button
            onClick={() => handleNumberClick("0")}
            className="w-16 h-16 flex items-center justify-center text-white text-xl font-semibold hover:bg-white/10 rounded-full transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            aria-label="Delete last digit"
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <X size={20} style={{ color: "#0000FF" }} />
          </button>
        </div>

        {/* Clear instructions for both authentication methods */}
        <div className="text-center mb-6">
          <p className="text-white/90 text-sm mb-2">Use the keypad to enter your 4-digit PIN.</p>
        </div>

        <Link href="/forgot-pin" className="mx-auto mt-2 rounded-md px-3 py-2 text-center text-sm font-bold text-white underline underline-offset-4">FORGOT PIN?</Link>
      </div>
    </div>
  )
}
