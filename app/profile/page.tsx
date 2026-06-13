"use client"
import Link from "next/link"
import { ArrowLeft, User, Star, Gift, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isUpgraded, setIsUpgraded] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      const user = JSON.parse(storedUserData)
      setUserData(user)
      setIsUpgraded(user.isUpgraded || false)
    }
  }, [])

  const handleUpgrade = async () => {
    if (isUpgraded) return

    setIsUpgrading(true)

    // Simulate upgrade process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update user data with upgrade status
    const updatedUserData = { ...userData, isUpgraded: true, upgradeDate: new Date().toISOString() }
    localStorage.setItem("userData", JSON.stringify(updatedUserData))
    setUserData(updatedUserData)
    setIsUpgraded(true)

    // Add ₦3,000 reward to balance
    const currentBalance = Number.parseFloat(localStorage.getItem("userBalance") || "200000")
    const newBalance = currentBalance + 3000
    localStorage.setItem("userBalance", newBalance.toString())

    setIsUpgrading(false)
    setShowSuccess(true)

    // Hide success message and redirect after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      router.push("/dashboard")
    }, 3000)
  }

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("userData")
    localStorage.removeItem("userBalance")
    localStorage.removeItem("completedTasks")
    localStorage.removeItem("lastTaskReset")
    localStorage.removeItem("registeredUsers")

    // Redirect to registration page
    router.push("/get-started")
  }

  if (showSuccess) {
    return (
      <div
        className="min-h-screen px-5 py-5 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0000FF" }}
      >
        <div className="text-center">
          <div className="bg-green-500 rounded-full p-4 mb-6 mx-auto w-24 h-24 flex items-center justify-center">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-bold mb-4">Profile Upgraded!</h2>
          <p className="text-white text-xl mb-2">Congratulations!</p>
          <p className="text-white text-lg">You've earned ₦3,000 reward!</p>
          <p className="text-white/80 text-sm mt-4">Returning to dashboard...</p>
        </div>
      </div>
    )
  }

  if (isUpgrading) {
    return (
      <div
        className="min-h-screen px-5 py-5 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0000FF" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white text-xl">Upgrading your profile...</p>
          <p className="text-white/80 text-sm mt-2">Please wait while we process your upgrade</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div
        className="min-h-screen px-5 py-5 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0000FF" }}
      >
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div className="px-5 py-5" style={{ backgroundColor: "#0000FF" }}>
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="text-white">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-white text-xl font-bold">Profile</h1>
          <div></div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-5 py-5">
        {/* Profile Info Card */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: isUpgraded ? "#FFD700" : "#0000FF" }}
            >
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{userData.fullName}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <div className="flex items-center mt-2">
                {isUpgraded ? (
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="text-yellow-600 font-semibold">Premium Member</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Basic Member</span>
                )}
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-sm">Member Since</p>
              <p className="font-semibold text-gray-800">
                {userData.registeredAt ? new Date(userData.registeredAt).toLocaleDateString() : "Today"}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-sm">Account Status</p>
              <p className="font-semibold text-gray-800">{isUpgraded ? "Premium" : "Basic"}</p>
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
        {!isUpgraded && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#FFD700" }}
              >
                <Star size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Unlock exclusive features and get instant ₦3,000 bonus added to your account balance!
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-3" />
                <span className="text-gray-700">Priority customer support</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-3" />
                <span className="text-gray-700">Exclusive premium features</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-3" />
                <span className="text-gray-700">Higher transaction limits</span>
              </div>
              <div className="flex items-center">
                <Gift size={16} className="text-yellow-500 mr-3" />
                <span className="text-gray-700 font-semibold">Instant ₦3,000 bonus reward</span>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg shadow-lg"
            >
              Upgrade Now - Get ₦3,000 Bonus!
            </button>
          </div>
        )}

        {/* Premium Benefits (if upgraded) */}
        {isUpgraded && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-4 mb-6 text-white">
            <div className="text-center">
              <Star size={20} className="mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Premium Member</h3>
              <p className="text-sm opacity-90">You're enjoying all premium benefits and earned your ₦3,000 bonus!</p>
              {userData.upgradeDate && (
                <p className="text-xs opacity-80 mt-2">
                  Upgraded on {new Date(userData.upgradeDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 rounded-full border-2 font-semibold text-lg mb-4"
          style={{ borderColor: "#0000FF", color: "#0000FF" }}
        >
          Back to Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-full bg-red-500 text-white font-semibold text-lg hover:bg-red-600 transition-colors"
        >
          LOG OUT
        </button>
      </div>
    </div>
  )
}
