"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeUser, setWelcomeUser] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errorMessage) {
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (navigator.vibrate) {
      navigator.vibrate([
        200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100,
        200, 100, 200, 100, 200, 100, 200, 100,
      ])
    }

    setIsLoading(true)

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = registeredUsers.find((u: any) => u.email === formData.email)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!user) {
      setErrorMessage("Invalid email or password")
      setIsLoading(false)
      return
    }

    if (user.password !== formData.password) {
      setErrorMessage("Wrong password. Please try again.")
      setIsLoading(false)
      return
    }

    localStorage.setItem("userData", JSON.stringify(user))
    setWelcomeUser(user.fullName)
    setIsLoading(false)

    router.push("/verify-pin")
  }

  if (showWelcome) {
    return (
      <div
        className="min-h-screen px-6 py-8 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0000FF" }}
      >
        <div className="text-center">
          <div className="bg-white/10 rounded-full p-8 mb-6">
            <div className="text-6xl">👋</div>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-white text-xl">{welcomeUser}</p>
          <p className="text-white/80 text-lg mt-2">Taking you to your dashboard...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen px-6 py-8 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0000FF" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white text-xl">Signing you in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8 flex flex-col" style={{ backgroundColor: "#0000FF" }}>
      <div className="flex items-center justify-between mb-8">
        <Link href="/get-started" className="text-white">
          <ArrowLeft size={24} />
        </Link>
        <span className="text-white text-lg">You Need Help?</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-4">BLUEPAY</h1>
          <h2 className="text-white text-3xl font-bold mb-6">Sign In</h2>
          <p className="text-white text-lg leading-relaxed mb-8 max-w-md">
            Welcome back! Sign in to access your account and continue managing your transactions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-4 rounded-xl border-2 text-white placeholder-white/70 bg-transparent"
              style={{ borderColor: "#0000FF" }}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-4 pr-12 rounded-xl border-2 text-white placeholder-white/70 bg-transparent"
              style={{ borderColor: "#0000FF" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-white font-semibold">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-full bg-white font-semibold text-lg disabled:opacity-50"
            style={{ color: "#0000FF" }}
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-white underline text-lg">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <span className="text-white text-lg">
            Don't have an account?{" "}
            <Link href="/get-started" className="underline">
              Create account
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
