"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Menu,
  Bell,
  User,
  Calendar,
  MessageCircle,
  Plus,
  BarChart3,
  CreditCard,
  Clock,
  Phone,
  BarChart,
  Headphones,
  Globe,
  DollarSign,
  Star,
  X,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Zap,
  Send,
} from "lucide-react"
import { getRecentTransactions, getSpendingByCategory } from "@/lib/transactions"

const TypewriterText = ({
  text,
  delay = 100,
  loop = false,
  underlined = false,
}: { text: string; delay?: number; loop?: boolean; underlined?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        setIndex(index + 1)
      } else if (loop) {
        setTimeout(() => {
          setDisplayedText("")
          setIndex(0)
        }, 1000)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [index, text, delay, loop])

  return <span className={underlined ? "underline decoration-2 underline-offset-2" : ""}>{displayedText}</span>
}

const WordByWordAnimation = ({ text, delay = 250 }: { text: string; delay?: number }) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const words = text.split(" ")

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => {
        const nextIndex = (prev + 1) % (words.length + 1)
        if (nextIndex === 0) {
          setDisplayedWords([])
        } else {
          setDisplayedWords(words.slice(0, nextIndex))
        }
        return nextIndex
      })
    }, delay)

    return () => clearInterval(interval)
  }, [words, delay])

  return (
    <span className="inline-block animate-pulse" style={{
      animation: "slideIn 0.5s ease-out"
    }}>
      {displayedWords.join(" ")}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [showJoinGroup, setShowJoinGroup] = useState(false)
  const [userName, setUserName] = useState("User")
  const [displayedName, setDisplayedName] = useState("")
  const [balance, setBalance] = useState(200000)
  const [isLoadingBPC, setIsLoadingBPC] = useState(false)
  const [nameIndex, setNameIndex] = useState(0)
  const [currentNotification, setCurrentNotification] = useState({ name: "", amount: "" })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentTestimony, setCurrentTestimony] = useState(0)
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null)
  const [hasWithdrawalNotification, setHasWithdrawalNotification] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [showDataUsage, setShowDataUsage] = useState(false)
  const [showCreditAlert, setShowCreditAlert] = useState(false)
  const [showBPCWarning, setShowBPCWarning] = useState(true)

  const [monthlyIncome] = useState(450000)
  const [monthlyExpenses] = useState(285000)
  const [monthlySavings] = useState(165000)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([])
  const [greeting, setGreeting] = useState("")

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return "Good Morning"
    } else if (hour < 18) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

  const nigerianNames = [
    "Adebayo Johnson",
    "Chioma Okafor",
    "Ibrahim Musa",
    "Fatima Aliyu",
    "Emeka Nwankwo",
    "Aisha Bello",
    "Olumide Adeyemi",
    "Kemi Ogundimu",
    "Chinedu Okoro",
    "Blessing Eze",
    "Tunde Afolabi",
    "Ngozi Okonkwo",
    "Yusuf Garba",
    "Folake Adebisi",
    "Chukwuma Ibe",
    "Hauwa Abdullahi",
    "Segun Oladele",
    "Amina Sani",
    "Ikechukwu Obi",
    "Funmi Ogundipe",
    "Musa Yakubu",
    "Chinelo Nnamdi",
    "Rasheed Lawal",
    "Nneka Okwu",
    "Suleiman Ahmad",
    "Adunni Bakare",
    "Chidi Anyanwu",
    "Zainab Usman",
    "Biodun Olatunji",
    "Chiamaka Udeh",
    "Aliyu Hassan",
    "Folashade Adeyinka",
    "Chukwuma Okafor",
    "Hadiza Yusuf",
    "Seyi Adebayo",
    "Chinonso Eze",
    "Mariam Abdullahi",
    "Tochukwu Nwachukwu",
    "Salamatu Garba",
    "Oluwaseun Ajayi",
    "Chineye Okoro",
    "Usman Bello",
    "Temitope Adebisi",
    "Chidinma Okonkwo",
    "Abdulrahman Sani",
    "Omolara Ogundimu",
    "Chukwudi Nnamdi",
    "Khadijah Ahmad",
    "Babatunde Afolabi",
    "Chinwendu Okwu",
    "Maryam Aliyu",
    "Olumuyiwa Adeyemi",
    "Chinenye Anyanwu",
    "Zahra Usman",
    "Adebola Olatunji",
    "Chukwunonso Udeh",
    "Hafsat Yusuf",
    "Oluwafemi Adeyinka",
    "Chioma Akafor",
  ]

  const featuredTestimonies = [
    {
      name: "Maxwell Prince Chukwu",
      location: "Lagos, Nigeria",
      text: "BLUEPAY2026 has completely transformed how I handle my financial transactions. The BPC code system is revolutionary and the CBN partnership gives me complete confidence in the platform's security.",
      rating: 5,
      amount: "₦2,500,000",
    },
    {
      name: "Adebayo Johnson",
      location: "Abuja, Nigeria",
      text: "I've been using BLUEPAY for 6 months now and I can't imagine going back to traditional banking. The withdrawal speed is incredible - money hits my account in seconds!",
      rating: 5,
      amount: "₦850,000",
    },
    {
      name: "Chioma Okafor",
      location: "Port Harcourt, Nigeria",
      text: "As a business owner, BLUEPAY has made managing my finances so much easier. The airtime and data purchase features save me time and money every day.",
      rating: 5,
      amount: "₦1,200,000",
    },
    {
      name: "Ibrahim Musa",
      location: "Kano, Nigeria",
      text: "The customer support is outstanding! Any time I have questions, they respond immediately. BLUEPAY truly cares about their users.",
      rating: 5,
      amount: "₦675,000",
    },
    {
      name: "Fatima Aliyu",
      location: "Kaduna, Nigeria",
      text: "I love the earn feature! I've made over ₦50,000 just by completing simple tasks. BLUEPAY rewards loyalty and I'm grateful for this platform.",
      rating: 5,
      amount: "₦950,000",
    },
  ]

  useEffect(() => {
    setGreeting(getTimeBasedGreeting())

    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedData = JSON.parse(userData)
      setUserName(parsedData.fullName || "User")
    }

    const savedPhoto = localStorage.getItem("userProfilePhoto")
    if (savedPhoto) {
      setUserProfilePhoto(savedPhoto)
    }

    const loadBalance = () => {
      const savedBalance = localStorage.getItem("userBalance")
      if (savedBalance) {
        setBalance(Number.parseInt(savedBalance))
      }
    }

    loadBalance()

    const loadTransactions = () => {
      setRecentTransactions(getRecentTransactions(5))
      setSpendingByCategory(getSpendingByCategory())
    }

    loadTransactions()

    const checkWithdrawalNotification = () => {
      const withdrawalSuccess = localStorage.getItem("withdrawalSuccess")
      setHasWithdrawalNotification(withdrawalSuccess === "true")
    }

    checkWithdrawalNotification()

    const checkCreditNotification = () => {
      const creditNotification = localStorage.getItem("creditNotification")
      if (creditNotification === "true") {
        setShowCreditAlert(true)
        localStorage.removeItem("creditNotification")
      }
    }

    checkCreditNotification()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userBalance") {
        loadBalance()
      }
      if (e.key === "withdrawalSuccess") {
        checkWithdrawalNotification()
      }
      if (e.key === "creditNotification") {
        checkCreditNotification()
      }
      if (e.key === "userTransactions") {
        loadTransactions()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadBalance()
        checkWithdrawalNotification()
        checkCreditNotification()
        loadTransactions()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (nameIndex < userName.length) {
        setDisplayedName(userName.slice(0, nameIndex + 1))
        setNameIndex(nameIndex + 1)
      } else {
        setDisplayedName("")
        setNameIndex(0)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [nameIndex, userName])

  useEffect(() => {
    const warningInterval = setInterval(
      () => {
        setShowBPCWarning(true)
      },
      40000, // Changed from 5 minutes to 40 seconds
    )

    return () => clearInterval(warningInterval)
  }, [])

  useEffect(() => {
    // Keep Monica widget visible permanently
    setShowJoinGroup(true)
  }, [])

  useEffect(() => {
    const updateNotification = () => {
      const randomName = nigerianNames[Math.floor(Math.random() * nigerianNames.length)]
      const randomAmount = (Math.random() * (200000 - 15000) + 15000).toFixed(2)
      setCurrentNotification({ name: randomName, amount: randomAmount })
    }

    updateNotification()

    const interval = setInterval(updateNotification, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 27)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimony((prev) => (prev + 1) % featuredTestimonies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(clockInterval)
  }, [])

  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(carouselInterval)
  }, [])

  const handleJoinGroup = () => {
    window.open("https://t.me/bluepay2", "_blank")
    setShowJoinGroup(false)
  }

  const handleBuyBPC = () => {
    setIsLoadingBPC(true)
    setTimeout(() => {
      setIsLoadingBPC(false)
      router.push("/buy-bpc")
    }, 5000)
  }

  const handleOrderATM = () => {
    router.push("/order-atm")
  }

  const handleWithdraw = () => {
    router.push("/withdraw")
  }

  const handleWatch = () => {
    window.open("https://www.facebook.com/share/v/16oy7hLUV3/", "_blank")
  }

  const handleAirtime = () => {
    router.push("/airtime")
  }

  const handleData = () => {
    router.push("/data")
  }

  const handleSupport = () => {
    router.push("/support")
  }

  const handleGroup = () => {
    window.open("https://t.me/bluepay2", "_blank")
  }

  const handleEarn = () => {
    router.push("/earn")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("userBalance")
    localStorage.removeItem("completedTasks")
    localStorage.removeItem("lastTaskReset")
    localStorage.removeItem("registeredUsers")
    localStorage.removeItem("userProfilePhoto")

    router.push("/get-started")
  }

  const handleBellClick = () => {
    localStorage.setItem("withdrawalSuccess", "false")
    setHasWithdrawalNotification(false)
    router.push("/notifications")
  }

  const handleCalendar = () => {
    setShowCalendar(true)
  }

  const handleSocial = () => {
    setShowSocial(true)
  }

  const handleDataUsage = () => {
    setShowDataUsage(true)
  }

  const formatDateTime = (date: Date) => {
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  const handleTestimonies = () => {
    router.push("/testimonies")
  }

  const handleFeaturesPage = () => {
    router.push("/features")
  }

  const handleMenuClick = () => {
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showBPCWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="text-blue-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-black mb-2">⚠️ Important Security Notice</h2>
              <div className="text-left space-y-2">
                <p className="text-black text-sm leading-relaxed">
                  <span className="font-bold">Dear {userName},</span>
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded">
                  <p className="text-black text-xs font-bold mb-1">🚨 NOTE! CRITICAL WARNING:</p>
                  <p className="text-black text-xs leading-relaxed">
                    <span className="font-semibold">DO NOT BUY BPC CODE OUTSIDE BLUEPAY2026!</span> Only authentic BPC
                    codes generated directly from BLUEPAY2026 app can be used for transactions within this platform.
                  </p>
                </div>

                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-black text-xs leading-relaxed">
                    <span className="font-semibold">Why this matters:</span> External BPC codes are{" "}
                    <span className="font-bold text-red-600">INVALID</span> and will be{" "}
                    <span className="font-bold text-red-600">REJECTED</span> by our system. Protect yourself from
                    scammers and fraudsters!
                  </p>
                </div>

                <div className="bg-green-50 p-2 rounded">
                  <p className="text-black text-xs leading-relaxed">
                    <span className="font-semibold">✅ Safe way to get BPC CODE:</span> Click the{" "}
                    <span className="font-bold text-blue-600">"Buy BPC"</span> button on your dashboard. This is the
                    ONLY legitimate source for valid BPC codes.
                  </p>
                </div>

                <p className="text-black text-xs italic text-center mt-1">
                  🔒 Your security is our priority. Stay safe with BLUEPAY2026!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBPCWarning(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              OK, I Understand
            </button>
          </div>
        </div>
      )}

      {isLoadingBPC && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Loading Buy BPC...</p>
          </div>
        </div>
      )}

      {showCreditAlert && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-bounce">
          <div className="bg-white rounded-xl shadow-2xl p-4 border-4 border-green-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Credit Alert!</h3>
                  <p className="text-sm text-gray-600">From: BLUEPAY MOBILE 2026</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreditAlert(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold mb-2" style={{ color: "#000000" }}>
                ₦200,000.00
              </p>
              <p className="text-sm text-green-600 font-semibold">Transaction Successful</p>
              <p className="text-xs text-gray-600 mt-2">Your account has been credited</p>
            </div>
          </div>
        </div>
      )}

      {showJoinGroup && (
        <div className="fixed bottom-24 right-4 z-50" style={{
          animation: "float 3s ease-in-out infinite"
        }}>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
          `}</style>
          <button
            onClick={() => {
              window.open("https://wa.me/2349167089066?text=Hi,%20I%20would%20like%20to%20contact%20BLUEPAY%20MOBILE%20customer%20representative", "_blank")
              setShowJoinGroup(false)
            }}
            className="relative w-16 h-16 rounded-full shadow-2xl transform transition-transform hover:scale-110 overflow-hidden border-4 border-white"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              boxShadow: "0 8px 20px rgba(37, 211, 102, 0.4), 0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Profile image */}
            <img 
              src="/monica.png" 
              alt="Monica" 
              className="w-full h-full object-cover"
            />
            {/* Tooltip text */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              Hi, I'm Monica
            </div>
          </button>
        </div>
      )}

      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Live Calendar</h2>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xl font-bold text-blue-600 mb-2">{formatDateTime(currentDateTime).time}</div>
                <div className="text-sm text-gray-600">{formatDateTime(currentDateTime).date}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white mb-4">
              <h3 className="font-semibold mb-2">Today's Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Check BLUEPAY earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Complete daily tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Withdraw available balance</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCalendar(false)}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}

      {showSocial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Connect With Us</h2>
              <p className="text-gray-600 text-sm">Join our community on social media</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  window.open("https://t.me/bluepay2", "_blank")
                  setShowSocial(false)
                }}
                className="w-full flex items-center gap-4 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <MessageCircle size={20} />
                <div className="text-left">
                  <div className="font-semibold">Join Telegram</div>
                  <div className="text-sm opacity-90">Get instant updates</div>
                </div>
              </button>

              <button
                onClick={() => {
                  window.open("https://www.facebook.com/share/19YsxYP8Wd/", "_blank")
                  setShowSocial(false)
                }}
                className="w-full flex items-center gap-4 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Globe size={20} />
                <div className="text-left">
                  <div className="font-semibold">Follow Facebook</div>
                  <div className="text-sm opacity-90">Latest news & updates</div>
                </div>
              </button>

              <button
                onClick={() => {
                  window.open("https://chat.whatsapp.com/FKn3uJPVnrs9WL6Cp4Torf", "_blank")
                  setShowSocial(false)
                }}
                className="w-full flex items-center gap-4 p-4 text-white rounded-xl hover:opacity-90 transition-colors"
                style={{ backgroundColor: "#0000FF" }}
              >
                <Phone size={20} />
                <div className="text-left">
                  <div className="font-semibold">Join WhatsApp</div>
                  <div className="text-sm opacity-90">Community support</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowSocial(false)}
              className="w-full mt-3 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDataUsage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Data Analytics</h2>
              <p className="text-gray-600 text-sm">Your BLUEPAY usage statistics</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm opacity-90">Total Transactions</span>
                  <BarChart3 size={20} />
                </div>
                <div className="text-xl font-bold">247</div>
              </div>

              <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm opacity-90">Monthly Earnings</span>
                  <DollarSign size={20} />
                </div>
                <div className="text-xl font-bold">₦{(balance * 0.15).toLocaleString()}</div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm opacity-90">Tasks Completed</span>
                  <Star size={20} />
                </div>
                <div className="text-xl font-bold">89</div>
              </div>

              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Usage Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Airtime Purchases</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Purchases</span>
                    <span className="text-sm font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Withdrawals</span>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDataUsage(false)}
              className="w-full mt-3 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Close Analytics
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={handleMenuClick}>
          <Menu className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">BLUEPAY2026</h1>
        <button onClick={handleBellClick} className="relative">
          <Bell className="text-white" size={20} />
          {hasWithdrawalNotification && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      {/* Greeting Section with Continuous Word-by-Word Animation */}
      <div className="text-white px-3 py-2 text-center" style={{ backgroundColor: "#0000FF" }}>
        <p className="text-sm font-semibold">
          {greeting},{" "}
          <WordByWordAnimation text={userName} delay={2000} />
        </p>
      </div>

      {/* Profile and Menu Section - Dashboard Card with proper spacing */}
      <div className="mx-3 mb-4 p-4 rounded-xl text-white mt-4" style={{ backgroundColor: "#0000FF" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/80 text-xs mb-1">Available Balance</p>
            <p className="text-xl font-bold">₦{balance.toLocaleString()}</p>
          </div>
          <button
            onClick={handleWithdraw}
            className="bg-white text-blue-600 px-5 py-1 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Withdraw
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/80 text-sm">Daily spend target</p>
            <p className="text-white font-semibold">₦200,000</p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 px-3 mb-4">
        <button onClick={handleBuyBPC} className="text-center" disabled={isLoadingBPC}>
          <div className="w-14 h-14 rounded-full bg-yellow-200 flex items-center justify-center mx-auto mb-1">
            <CreditCard className="text-yellow-600" size={20} />
          </div>
          <p className="text-xs text-gray-700">Buy BPC</p>
        </button>
        <button onClick={handleOrderATM} className="text-center">
          <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-1">
            <CreditCard className="text-purple-600" size={20} />
          </div>
          <p className="text-xs text-gray-700">Order Atm</p>
        </button>
        <button onClick={handleWatch} className="text-center">
          <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-1">
            <Clock className="text-blue-600" size={20} />
          </div>
          <p className="text-xs text-gray-700">Watch</p>
        </button>
        <button onClick={handleAirtime} className="text-center">
          <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center mx-auto mb-1">
            <Phone className="text-green-600" size={20} />
          </div>
          <p className="text-xs text-gray-700">Airtime</p>
        </button>
      </div>

      <div className="px-3 mb-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3">More Services</h2>
        <div className="grid grid-cols-4 gap-4">
          <button onClick={handleData} className="text-center">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
              <BarChart className="text-gray-600" size={20} />
            </div>
            <p className="text-sm text-gray-700">Data</p>
          </button>
          <button onClick={handleSupport} className="text-center">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
              <Headphones className="text-gray-600" size={20} />
            </div>
            <p className="text-sm text-gray-700">Support</p>
          </button>
          <button onClick={handleGroup} className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-2">
              <Globe className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-gray-700">Group</p>
          </button>
          <button onClick={handleEarn} className="text-center">
            <div className="w-14 h-14 rounded-full bg-yellow-200 flex items-center justify-center mx-auto mb-2">
              <DollarSign className="text-yellow-600" size={20} />
            </div>
            <p className="text-sm text-gray-700">Earn</p>
          </button>
          <button onClick={handleProfile} className="text-center">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
              <User className="text-gray-600" size={20} />
            </div>
            <p className="text-sm text-gray-700">Profile</p>
          </button>
          <button onClick={handleTestimonies} className="text-center">
            <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center mx-auto mb-2">
              <Star className="text-green-600" size={20} />
            </div>
            <p className="text-sm text-gray-700">Stories</p>
          </button>
        </div>


      </div>

      {/* Compact Banner Carousel - PalmPay Style */}
      <div className="mx-4 mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="relative h-28">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Slide 1 - M-CELL and MTN Evolution */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentSlide % 10 === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2816%29-uKJFcT3ala35PyCbhBpQe2SJIZ4QgH.png"
                  alt="MTN Evolution"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 2 - iPhone 17 Pro */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentSlide % 10 === 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2877%29-C4aJJS243zPUm6vRMs51iGSbmE2dp4.jpeg"
                  alt="iPhone 17 Pro"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 3 - Glo Logo with fade */}
              <div
                className={`absolute inset-0 transition-opacity duration-2000 ${
                  currentSlide % 10 === 2 ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2868%29-SoKEs8Bou8XuwFBPeqoE1CY7UWBsdm.jpeg"
                  alt="Glo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 4 - MTN on Phone */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentSlide % 10 === 3 ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2859%29-icdqatSvE2KNT4FysLMhbqaDNJsJYW.jpeg"
                  alt="MTN Mobile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 5 - Technizo Concept */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentSlide % 10 === 4 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2876%29-HtjxlRSTmRYeJIQHrdJUokCOLJaU5w.jpeg"
                  alt="Technizo Concept"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 6 - MTN Y'ello with fade and slide */}
              <div
                className={`absolute inset-0 transition-all duration-1500 ${
                  currentSlide % 10 === 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2858%29-2ttLoYx7E8CcuW15mgHR9xzuwzoOUg.jpeg"
                  alt="MTN Y'ello"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 7 - MTN 5G Person */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentSlide % 10 === 6 ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-3"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2861%29-rN5uPUremTf4rsXnoZW9Rew7IH7lqd.jpeg"
                  alt="MTN 5G"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 8 - Airtel MTN Capsule with fade */}
              <div
                className={`absolute inset-0 transition-opacity duration-2000 ${
                  currentSlide % 10 === 7 ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2867%29-ygIRGOvgzOfxfr1MCvS41M6e5gBLJf.jpeg"
                  alt="Airtel MTN"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 9 - All Networks Grid */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentSlide % 10 === 8 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2864%29-a6rzXeKQJUOG0k5T34WvRgkZiZX7gy.jpeg"
                  alt="All Networks"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide 10 - Storefront with slide and fade */}
              <div
                className={`absolute inset-0 transition-all duration-1500 ${
                  currentSlide % 10 === 9 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
                }`}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2872%29-rsgIbTfPu4IBZq6QgtpaEL7Si6g7eo.jpeg"
                  alt="Telecom Store"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Slideshow indicators - bottom positioned */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide % 10 === index ? "w-6 bg-blue-500" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-4 mb-20 p-4 rounded-xl text-white overflow-hidden" style={{ backgroundColor: "#0000FF" }}>
        <h3 className="text-xl font-bold mb-4">Important Information</h3>
        <div className="bg-white/10 rounded-xl p-4">
          <h4 className="text-lg font-semibold mb-3">How to Buy BPC Code</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm animate-marquee">
                  <TypewriterText text='Click "Buy BPC" from dashboard' delay={60} underlined={true} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm animate-marquee" style={{ animationDelay: "1s" }}>
                  <TypewriterText text="Fill details and amount" delay={60} underlined={true} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm animate-marquee" style={{ animationDelay: "2s" }}>
                  <TypewriterText text="Complete payment for BPC code" delay={60} underlined={true} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm animate-marquee" style={{ animationDelay: "3s" }}>
                  <TypewriterText text="Use your BPC code for transactions" delay={60} underlined={true} />
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 gap-1">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Financial Overview</h2>

        {/* Income, Expenses, Savings Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="text-green-500" size={20} />
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <p className="text-xs text-gray-600 mb-1">Income</p>
            <p className="text-lg font-bold text-gray-800">₦{(monthlyIncome / 1000).toFixed(0)}k</p>
            <p className="text-xs text-green-500 mt-1">+12% this month</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <TrendingDown className="text-red-500" size={20} />
              <ArrowDownRight className="text-red-500" size={16} />
            </div>
            <p className="text-xs text-gray-600 mb-1">Expenses</p>
            <p className="text-lg font-bold text-gray-800">₦{(monthlyExpenses / 1000).toFixed(0)}k</p>
            <p className="text-xs text-red-500 mt-1">+8% this month</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <PiggyBank className="text-blue-500" size={20} />
              <Star className="text-yellow-500" size={16} />
            </div>
            <p className="text-xs text-gray-600 mb-1">Savings</p>
            <p className="text-lg font-bold text-gray-800">₦{(monthlySavings / 1000).toFixed(0)}k</p>
            <p className="text-xs text-blue-500 mt-1">Goal: ₦200k</p>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Spending Breakdown</h3>
            <button onClick={() => router.push("/spending-breakdown")} className="text-blue-500 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {spendingByCategory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No spending data yet. Start making transactions!</p>
            ) : (
              spendingByCategory.slice(0, 4).map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.category}</span>
                    <span className="text-sm font-semibold text-gray-800">₦{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
            <button onClick={() => router.push("/transactions")} className="text-blue-500 text-sm font-medium">
              See All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No transactions yet. Start using BLUEPAY services!
              </p>
            ) : (
              recentTransactions.slice(0, 4).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownRight className="text-green-600" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red-600" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.accountNumber
                          ? `${transaction.bankName} - ${transaction.accountNumber}`
                          : transaction.phoneNumber
                            ? `${transaction.phoneNumber}`
                            : transaction.date}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Financial Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <Wallet className="mb-2" size={20} />
            <p className="text-xs opacity-90 mb-1">Total Balance</p>
            <p className="text-xl font-bold">₦{balance.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <Zap className="mb-2" size={20} />
            <p className="text-xs opacity-90 mb-1">This Month</p>
            <p className="text-xl font-bold">₦{monthlyExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button onClick={handleCalendar} className="text-center">
            <Calendar className="text-blue-500 mx-auto mb-1" size={20} />
            <p className="text-xs text-blue-500 font-medium">Calendar</p>
          </button>
          <button onClick={handleSocial} className="text-center">
            <MessageCircle className="text-green-500 mx-auto mb-1" size={20} />
            <p className="text-xs text-green-500 font-medium">Social</p>
          </button>
          <button
            onClick={handleFeaturesPage}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#0000FF" }}
          >
            <Plus className="text-white" size={20} />
          </button>
          <button onClick={handleDataUsage} className="text-center">
            <BarChart3 className="text-purple-500 mx-auto mb-1" size={20} />
            <p className="text-xs text-purple-500 font-medium">Data</p>
          </button>
          <button onClick={handleProfile} className="text-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-1">
              <User className="text-white" size={16} />
            </div>
            <p className="text-xs text-gray-700 font-medium">Profile</p>
          </button>
        </div>
      </div>
    </div>
  )
}
