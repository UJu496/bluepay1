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
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-4">BLUEPAY</h1>
          <h2 className="text-white text-3xl font-bold mb-6">Welcome!</h2>
          <p className="text-white text-lg leading-relaxed mb-8 max-w-md">
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your
            bills in cheaper price.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Your Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-4 rounded-xl border-2 text-white placeholder-white/70 bg-transparent"
              style={{ borderColor: "#0000FF" }}
              required
            />
          </div>

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

          <p className="text-white text-sm leading-relaxed">
            Any further actions indicates that you agree with our terms & conditions!
          </p>

          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-white font-semibold">{errorMessage}</p>
              <p className="text-white/80 text-sm mt-2">Redirecting to login...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-full bg-white font-semibold text-lg disabled:opacity-50"
            style={{ color: "#0000FF" }}
          >
            {isLoading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-white text-lg">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
