"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  FileText,
  UserCheck,
  Clock,
  Globe,
  Bell,
  Settings,
} from "lucide-react"

export default function SecurityPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [deviceManagement, setDeviceManagement] = useState(true)

  const securityScore = 85

  const recentActivity = [
    { action: "Login", device: "iPhone 13 Pro", location: "Lagos, Nigeria", time: "2 hours ago", status: "success" },
    {
      action: "Withdrawal",
      device: "Web Browser",
      location: "Abuja, Nigeria",
      time: "5 hours ago",
      status: "success",
    },
    { action: "Password Change", device: "Android", location: "Port Harcourt", time: "1 day ago", status: "success" },
    {
      action: "Failed Login",
      device: "Unknown Device",
      location: "Unknown",
      time: "2 days ago",
      status: "failed",
    },
  ]

  const connectedDevices = [
    { name: "iPhone 13 Pro", type: "Mobile", lastActive: "Active now", location: "Lagos, Nigeria" },
    { name: "Chrome on Windows", type: "Desktop", lastActive: "2 hours ago", location: "Lagos, Nigeria" },
    { name: "Samsung Galaxy S21", type: "Mobile", lastActive: "1 day ago", location: "Abuja, Nigeria" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push("/settings")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Security & Privacy</h1>
        </div>
        <p className="text-white/90 text-sm">Protect your account and personal information</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Security Score</h2>
              <p className="text-sm text-gray-600">Your account security rating</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">{securityScore}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Excellent</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-gray-700">Strong password enabled</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-gray-700">Email verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-gray-700">Phone number verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="text-orange-500" size={16} />
              <span className="text-gray-700">Enable 2FA for better security</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Lock className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Account Security</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/change-password")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Change Password</p>
                  <p className="text-xs text-gray-600">Last changed 30 days ago</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-600">Add extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Fingerprint size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Biometric Login</p>
                  <p className="text-xs text-gray-600">Use fingerprint or face ID</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  biometricEnabled ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    biometricEnabled ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>

            <button
              onClick={() => router.push("/security-questions")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserCheck size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Security Questions</p>
                  <p className="text-xs text-gray-600">Set up recovery questions</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bell className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Security Alerts</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Login Alerts</p>
                  <p className="text-xs text-gray-600">Get notified of new logins</p>
                </div>
              </div>
              <button
                onClick={() => setLoginAlerts(!loginAlerts)}
                className={`w-14 h-8 rounded-full transition-colors ${loginAlerts ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    loginAlerts ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Device Management</p>
                  <p className="text-xs text-gray-600">Monitor connected devices</p>
                </div>
              </div>
              <button
                onClick={() => setDeviceManagement(!deviceManagement)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  deviceManagement ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    deviceManagement ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Clock className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === "success" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {activity.status === "success" ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-600" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.device}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500">{activity.location}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
            View All Activity
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <Smartphone className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Connected Devices</h2>
          </div>

          <div className="space-y-3">
            {connectedDevices.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Smartphone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{device.name}</p>
                    <p className="text-xs text-gray-600">{device.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-gray-400" />
                      <p className="text-xs text-gray-500">{device.lastActive}</p>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Privacy Settings</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/data-privacy")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Data Privacy Policy</p>
                  <p className="text-xs text-gray-600">How we protect your data</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/download-data")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Download Your Data</p>
                  <p className="text-xs text-gray-600">Export your account information</p>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/delete-account")}
              className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-600" />
                <div className="text-left">
                  <p className="font-semibold text-red-600">Delete Account</p>
                  <p className="text-xs text-red-500">Permanently remove your account</p>
                </div>
              </div>
              <div className="text-red-400">›</div>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white shadow-sm">
          <h3 className="text-lg font-bold mb-2">Security Tips</h3>
          <div className="space-y-2 text-sm">
            <p>Never share your password or BPC code with anyone</p>
            <p>Enable two-factor authentication for extra security</p>
            <p>Use a strong, unique password for your account</p>
            <p>Review your account activity regularly</p>
            <p>Keep your contact information up to date</p>
          </div>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
