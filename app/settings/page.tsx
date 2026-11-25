"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Palette,
  SettingsIcon,
  HelpCircle,
  Bell,
  User,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Lock,
  CreditCard,
  Mail,
  MessageSquare,
  Info,
  FileText,
  LogOut,
  Check,
  DollarSign,
  AudioLines,
  RefreshCw,
} from "lucide-react"
import {
  announceVoiceGuideExit,
  DEFAULT_VOICE_PREFERENCES,
  notifyVoicePreferencesChanged,
  readVoicePreferences,
  saveVoicePreferences,
  VOICE_REPLAY_EVENT,
  type VoicePreferences,
} from "@/lib/voice-guide"

export default function SettingsPage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState("blue")
  const [darkMode, setDarkMode] = useState(false)
  const [voicePreferences, setVoicePreferences] = useState<VoicePreferences>(DEFAULT_VOICE_PREFERENCES)
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  })
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const themes = [
    { id: "blue", name: "Ocean Blue", primary: "#0000FF", secondary: "#4169E1", gradient: "from-blue-500 to-blue-700" },
    {
      id: "green",
      name: "Forest Green",
      primary: "#00FF00",
      secondary: "#32CD32",
      gradient: "from-green-500 to-green-700",
    },
    {
      id: "purple",
      name: "Royal Purple",
      primary: "#8B00FF",
      secondary: "#9370DB",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      id: "orange",
      name: "Sunset Orange",
      primary: "#FF8C00",
      secondary: "#FFA500",
      gradient: "from-orange-500 to-orange-700",
    },
    { id: "pink", name: "Rose Pink", primary: "#FF1493", secondary: "#FF69B4", gradient: "from-pink-500 to-pink-700" },
    {
      id: "teal",
      name: "Tropical Teal",
      primary: "#00CED1",
      secondary: "#20B2AA",
      gradient: "from-teal-500 to-teal-700",
    },
  ]

  const voiceToggles = [
    { key: "financialDetailsVoice", title: "Financial-detail narration", description: "Allow wallet balances, fees, and limits to be spoken" },
  ] as const

  useEffect(() => {
    const savedTheme = localStorage.getItem("userTheme")
    const savedDarkMode = localStorage.getItem("darkMode")
    setVoicePreferences(readVoicePreferences())

    if (savedTheme) {
      const theme = JSON.parse(savedTheme)
      setSelectedTheme(theme.id)
      applyTheme(theme)
    }

    if (savedDarkMode === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const applyTheme = (theme: any) => {
    document.documentElement.style.setProperty("--theme-primary", theme.primary)
    document.documentElement.style.setProperty("--theme-secondary", theme.secondary)
    document.documentElement.style.setProperty("--theme-gradient-from", theme.primary)
    document.documentElement.style.setProperty("--theme-gradient-to", theme.secondary)
  }

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      localStorage.setItem("userTheme", JSON.stringify(theme))
      applyTheme(theme)
      // Trigger storage event for other tabs/windows
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "userTheme",
          newValue: JSON.stringify(theme),
        }),
      )
    }
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Trigger storage event for other tabs/windows
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "darkMode",
        newValue: String(newDarkMode),
      }),
    )
  }

  const handleNotificationToggle = (type: "push" | "email" | "sms") => {
    setNotifications({ ...notifications, [type]: !notifications[type] })
    localStorage.setItem("creditNotification", "true")
    setShowNotificationModal(true)
    setTimeout(() => setShowNotificationModal(false), 4000)
  }

  const handleVoicePreferenceChange = <K extends keyof VoicePreferences>(key: K, value: VoicePreferences[K]) => {
    const next = { ...readVoicePreferences(), [key]: value }
    saveVoicePreferences(next)
    setVoicePreferences(next)
    notifyVoicePreferencesChanged(next)
  }

  const replayVoiceIntroduction = () => {
    window.dispatchEvent(new Event(VOICE_REPLAY_EVENT))
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleLogout = () => {
    announceVoiceGuideExit()
    localStorage.removeItem("userData")
    localStorage.removeItem("userBalance")
    localStorage.removeItem("completedTasks")
    localStorage.removeItem("lastTaskReset")
    localStorage.removeItem("registeredUsers")
    localStorage.removeItem("userProfilePhoto")
    localStorage.removeItem("userTheme")
    localStorage.removeItem("darkMode")
    router.push("/get-started")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0000FF" }}>
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm animate-bounce">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Credit Alert!</h2>
              <p className="text-gray-600 mb-4">You have received a credit notification</p>
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">From: BLUEPAY2026</p>
                <p className="text-xl font-bold text-green-600">₦200,000.00</p>
                <p className="text-sm text-gray-600 mt-2">Transaction successful</p>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-white p-4 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Settings & More</h1>
        </div>
        <p className="text-white/90 text-sm">Customize your BLUEPAY experience</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Customization Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Palette className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Theme Customization</h2>
              <p className="text-sm text-gray-600">Choose your preferred color scheme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedTheme === theme.id ? "border-blue-500 scale-105" : "border-gray-200"
                }`}
              >
                <div className={`h-16 rounded-lg bg-gradient-to-r ${theme.gradient} mb-2`}></div>
                <p className="text-sm font-semibold text-gray-800">{theme.name}</p>
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-gray-700" /> : <Sun size={20} className="text-gray-700" />}
              <span className="font-semibold text-gray-800">Dark Mode</span>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`w-14 h-8 rounded-full transition-colors ${darkMode ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  darkMode ? "translate-x-7" : "translate-x-1"
                } mt-1`}
              ></div>
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <SettingsIcon className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">General Settings</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/profile")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Profile Management</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/security")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Security & Privacy</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/payment-methods")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Payment Methods</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/language")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Language & Region</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>
          </div>
        </div>

        <section className="rounded-xl bg-white p-4 shadow-sm" aria-labelledby="voice-guide-title">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-[#0000ff]">
              <AudioLines size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 id="voice-guide-title" className="text-lg font-bold text-gray-800">BLUEPAY VOICE GUIDE</h2>
              <p className="text-xs text-gray-600">Personalized, on-device spoken guidance</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {voiceToggles.map((toggle) => {
              const enabled = voicePreferences[toggle.key]
              return (
                <div key={toggle.key} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{toggle.title}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-gray-600">{toggle.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={`${toggle.title}: ${enabled ? "on" : "off"}`}
                    onClick={() => handleVoicePreferenceChange(toggle.key, !enabled)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff] focus-visible:ring-offset-2 ${enabled ? "bg-[#0000ff]" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              )
            })}
          </div>

          <label htmlFor="voice-speed" className="mt-4 block text-sm font-semibold text-gray-800">Voice Speed</label>
          <select
            id="voice-speed"
            value={voicePreferences.speed}
            onChange={(event) => handleVoicePreferenceChange("speed", event.target.value as VoicePreferences["speed"])}
            className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#0000ff] focus:ring-2 focus:ring-blue-100"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
          <button
            type="button"
            onClick={replayVoiceIntroduction}
            disabled={voicePreferences.muted}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0000ff] px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={15} aria-hidden="true" /> Replay Voice Introduction
          </button>
          <p className="mt-2 text-[10px] leading-4 text-gray-500">Voice guidance introduces pages and explains transaction steps automatically. Use the floating voice control to mute or unmute it. Financial narration is off by default for privacy; passwords, PINs, full account numbers, one-time codes, and BPC authorization codes are never spoken.</p>
        </section>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Bell className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Notification Preferences</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Push Notifications</span>
              </div>
              <button
                onClick={() => handleNotificationToggle("push")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  notifications.push ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications.push ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Email Notifications</span>
              </div>
              <button
                onClick={() => handleNotificationToggle("email")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  notifications.email ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications.email ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">SMS Notifications</span>
              </div>
              <button
                onClick={() => handleNotificationToggle("sms")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  notifications.sms ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications.sms ? "translate-x-7" : "translate-x-1"
                  } mt-1`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
              <HelpCircle className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Help & Support</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/support")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Contact Support</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/faq")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">FAQs</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/about")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Info size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">About BLUEPAY</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>

            <button
              onClick={() => router.push("/terms")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-800">Terms & Privacy</span>
              </div>
              <div className="text-gray-400">›</div>
            </button>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white shadow-sm">
          <h3 className="text-lg font-bold mb-2">BLUEPAY2026</h3>
          <p className="text-sm text-white/90 mb-4">Version 2.0.1 (Build 2025)</p>
          <div className="space-y-2 text-sm">
            <p>Licensed by CBN Nigeria</p>
            <p>Secure & Encrypted Transactions</p>
            <p>Instant Withdrawals 24/7</p>
            <p>Serving Nigeria with Excellence</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-sm"
        >
          <LogOut size={20} />
          <span>Logout from BLUEPAY</span>
        </button>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
