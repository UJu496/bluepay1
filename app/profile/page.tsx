"use client"
import Link from "next/link"
import { ArrowLeft, User, Settings, LogOut, Bell, Shield, Download, MapPin, Phone, Mail, Edit2, Copy, CheckCircle, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      const user = JSON.parse(storedUserData)
      setUserData(user)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("userBalance")
    localStorage.removeItem("completedTasks")
    localStorage.removeItem("lastTaskReset")
    localStorage.removeItem("registeredUsers")
    router.push("/get-started")
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(userData?.phone || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white pt-6 pb-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button onClick={() => router.push("/settings")} className="p-2 hover:bg-white/10 rounded-full transition">
            <Settings size={24} />
          </button>
        </div>

        {/* Profile Card Floating Effect */}
        <div className="relative -mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 mx-auto max-w-sm">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <User size={40} className="text-white" />
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition"
                >
                  <Edit2 size={16} className="text-blue-600" />
                </button>
              </div>

              {/* Name and status */}
              <h2 className="text-2xl font-bold text-gray-900 text-center">{userData.fullName}</h2>
              <div className="flex items-center gap-2 mt-2 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-green-600">Account Verified</span>
              </div>
            </div>

            {/* User ID/Tag */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-600 mb-1">BluePay User ID</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 font-mono">BP{userData.id || "12345678"}</span>
                <button className="text-blue-600 hover:text-blue-700">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">✓</div>
                <p className="text-xs text-gray-600">Identity</p>
                <p className="text-xs font-semibold text-gray-900">Verified</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">✓</div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-xs font-semibold text-gray-900">Verified</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">✓</div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-xs font-semibold text-gray-900">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-20 pb-8">
        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            {/* Email */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Email Address</p>
                <p className="text-sm font-semibold text-gray-900">{userData.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Phone size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">{userData.phone || "+234 XXX XXX XXXX"}</p>
              </div>
              <button onClick={handleCopyPhone} className="text-gray-400 hover:text-gray-600">
                {copied ? <CheckCircle size={20} className="text-green-600" /> : <Copy size={20} />}
              </button>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin size={20} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Location</p>
                <p className="text-sm font-semibold text-gray-900">Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-2">
            {/* Security */}
            <button onClick={() => router.push("/security")} className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Shield size={20} className="text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Security</p>
                  <p className="text-xs text-gray-600">Passwords & 2FA</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>

            {/* Notifications */}
            <button onClick={() => router.push("/notifications")} className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Bell size={20} className="text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-600">Alerts & updates</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>

            {/* Download Data */}
            <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Download size={20} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Download Data</p>
                  <p className="text-xs text-gray-600">Your account information</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="text-sm font-semibold text-gray-900">
                {userData.registeredAt ? new Date(userData.registeredAt).toLocaleDateString() : "Today"}
              </span>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Account Status</span>
              <span className="text-sm font-semibold text-green-600">Active</span>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Verification Level</span>
              <span className="text-sm font-semibold text-blue-600">Verified</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Back to Dashboard
            <ArrowRight size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition flex items-center justify-center gap-2 border border-red-200"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  )
}
