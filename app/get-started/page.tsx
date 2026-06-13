"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GetStartedPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
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
      // Strong vibration pattern for 4 seconds (4000ms with strong pulses)
      navigator.vibrate([
        200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100,
        200, 100, 200, 100, 200, 100, 200, 100,
      ])
    }

    setIsLoading(true)

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const existingUser = registeredUsers.find((user: any) => user.email === formData.email)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    if (existingUser) {
      setErrorMessage("EMAIL and NAME Already Registered")
      setIsLoading(false)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    const newUser = {
      ...formData,
      registeredAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
    }
    registeredUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    localStorage.setItem("userData", JSON.stringify(newUser))

    setIsLoading(false)
    router.push("/create-pin")
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen px-6 py-8 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0000FF" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white text-xl">Creating your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8 flex flex-col" style={{ backgroundColor: "#0000FF" }}>
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-white">
          <ArrowLeft size={24} />
        </Link>
        <span className="text-white text-lg">You Need Help?</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Welcome Section */}
        <div className="text-center mb-12 w-full max-w-md">
          <h1 className="text-white text-5xl font-bold mb-6">Welcome!</h1>
          <p className="text-white text-xl leading-relaxed">
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills in cheaper price.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          {/* Full Name Input with White Border */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Your Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-6 py-4 rounded-2xl border-2 text-white placeholder-white/60 bg-transparent transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{ borderColor: "rgba(255, 255, 255, 0.8)" }}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-white text-base mb-2">Your Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-4 rounded-lg border border-white/30 text-white placeholder-white/50 bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-white text-base mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-lg border border-white/30 text-white placeholder-white/50 bg-white/5 pr-12 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <p className="text-white text-sm leading-relaxed pt-2">
            Any further actions indicates that you agree with our{" "}
            <Link href="/terms" className="underline hover:text-white/80">
              terms & conditions
            </Link>
            !
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-white font-semibold">{errorMessage}</p>
              <p className="text-white/80 text-sm mt-2">Redirecting to login...</p>
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-full bg-white font-bold text-lg disabled:opacity-50 transition-all hover:shadow-lg"
            style={{ color: "#0000FF" }}
          >
            {isLoading ? "Creating..." : "Create account"}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <span className="text-white text-lg">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-white/80">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
