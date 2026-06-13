"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Check if email exists in registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = registeredUsers.find((u: any) => u.email === email)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (user) {
      setStep("reset")
      setSuccessMessage("Email verified! Please enter your new password.")
    } else {
      setErrorMessage("Email not found. Please check your email address.")
    }
    setIsLoading(false)
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Update password in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = registeredUsers.findIndex((u: any) => u.email === email)

    if (userIndex !== -1) {
      registeredUsers[userIndex].password = newPassword
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setSuccessMessage("Password reset successful! Redirecting to login...")

    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen px-5 py-5 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#4169E1" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white text-xl">{step === "email" ? "Verifying email..." : "Resetting password..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-5 py-5 flex flex-col" style={{ backgroundColor: "#4169E1" }}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/login" className="text-white">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-white text-lg">You Need Help?</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <h1 className="text-white text-xl font-bold mb-4">BLUEPAY</h1>
          <h2 className="text-white text-xl font-bold mb-6">
            {step === "email" ? "Forgot Password" : "Reset Password"}
          </h2>
          <p className="text-white text-lg leading-relaxed mb-4 max-w-md">
            {step === "email"
              ? "Enter your email address to reset your password. We'll verify your account and let you create a new password."
              : "Enter your new password below. Make sure it's secure and easy to remember."}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="w-full max-w-md space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 text-white placeholder-white/70 bg-transparent"
                style={{ borderColor: "#4169E1" }}
                required
              />
            </div>

            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
                <p className="text-white font-semibold">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                <p className="text-white font-semibold">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-white font-semibold text-lg disabled:opacity-50"
              style={{ color: "#4169E1" }}
            >
              Verify Email
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="w-full max-w-md space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 text-white placeholder-white/70 bg-transparent"
                style={{ borderColor: "#4169E1" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 text-white placeholder-white/70 bg-transparent"
                style={{ borderColor: "#4169E1" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
                <p className="text-white font-semibold">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                <p className="text-white font-semibold">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-white font-semibold text-lg disabled:opacity-50"
              style={{ color: "#4169E1" }}
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <span className="text-white text-lg">
            Remember your password?{" "}
            <Link href="/login" className="underline">
              Back to Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
