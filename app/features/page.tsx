"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Smartphone,
  CreditCard,
  Shield,
  Users,
  MessageSquare,
  Star,
  Eye,
  CheckCircle,
  Building2,
  Globe,
  TrendingUp,
  Award,
  BarChart3,
  Wallet,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  status: "explored" | "not-explored"
  details: string
  benefits: string[]
}

interface CompanyInfo {
  title: string
  description: string
  icon: React.ReactNode
  stats?: { label: string; value: string }[]
}

export default function FeaturesPage() {
  const router = useRouter()
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "bpc-codes",
      title: "BPC Code System",
      description: "Revolutionary secure transaction codes with CBN partnership",
      icon: <Shield className="text-blue-500" size={20} />,
      category: "Security",
      status: "not-explored",
      details:
        "Our proprietary BPC (BLUEPAY Code) system provides bank-level security for all transactions. Each code is unique, encrypted, and validated through our CBN partnership.",
      benefits: ["Bank-level security", "CBN regulated", "Instant validation", "Fraud protection"],
    },
    {
      id: "airtime-data",
      title: "Airtime & Data Purchase",
      description: "Buy airtime and data for all networks with instant delivery",
      icon: <Smartphone className="text-green-500" size={20} />,
      category: "Transaction",
      status: "not-explored",
      details:
        "Purchase airtime and data bundles for MTN, Airtel, Glo, and 9mobile with instant delivery and competitive rates.",
      benefits: ["All networks supported", "Instant delivery", "Competitive rates", "Bulk purchase options"],
    },
    {
      id: "withdrawal",
      title: "Bank Withdrawal",
      description: "Transfer money directly to your bank account instantly",
      icon: <CreditCard className="text-purple-500" size={20} />,
      category: "Banking",
      status: "not-explored",
      details:
        "Withdraw your earnings directly to any Nigerian bank account with our instant transfer system. No delays, no hidden fees.",
      benefits: ["Instant transfers", "All Nigerian banks", "No hidden fees", "24/7 availability"],
    },
    {
      id: "atm-card",
      title: "BLUEPAY ATM Card",
      description: "Order your personalized BLUEPAY ATM card for global access",
      icon: <Wallet className="text-indigo-500" size={20} />,
      category: "Banking",
      status: "not-explored",
      details: "Get your personalized BLUEPAY ATM card with global access, contactless payments, and premium benefits.",
      benefits: ["Global acceptance", "Contactless payments", "Premium benefits", "Secure chip technology"],
    },
    {
      id: "earn-rewards",
      title: "Daily Earning Tasks",
      description: "Complete tasks daily to earn money and rewards",
      icon: <Star className="text-yellow-500" size={20} />,
      category: "Rewards",
      status: "not-explored",
      details:
        "Earn money by completing simple daily tasks, watching videos, and participating in our reward programs.",
      benefits: ["Daily tasks", "Video rewards", "Referral bonuses", "Achievement badges"],
    },
    {
      id: "referral",
      title: "Referral System",
      description: "Earn up to ₦50,000 per referral with our multi-level system",
      icon: <Users className="text-orange-500" size={20} />,
      category: "Rewards",
      status: "not-explored",
      details:
        "Our advanced referral system rewards you for every person you bring to BLUEPAY. Earn immediate bonuses and ongoing commissions.",
      benefits: ["₦50,000 per referral", "Multi-level commissions", "Instant bonuses", "Lifetime earnings"],
    },
    {
      id: "support",
      title: "24/7 Customer Support",
      description: "Get help anytime with our AI-powered support system",
      icon: <MessageSquare className="text-cyan-500" size={20} />,
      category: "Support",
      status: "not-explored",
      details:
        "Our dedicated support team is available 24/7 through multiple channels including AI chat, phone, and email support.",
      benefits: ["24/7 availability", "Multiple channels", "AI-powered", "Expert human agents"],
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Track your earnings and spending with detailed analytics",
      icon: <BarChart3 className="text-pink-500" size={20} />,
      category: "Analytics",
      status: "not-explored",
      details:
        "Get detailed insights into your financial activities with our advanced analytics dashboard and reporting tools.",
      benefits: ["Real-time tracking", "Detailed reports", "Spending insights", "Goal tracking"],
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [exploredCount, setExploredCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  const companyInfo: CompanyInfo[] = [
    {
      title: "CBN Partnership",
      description: "Officially partnered with Central Bank of Nigeria for secure financial services",
      icon: <Building2 className="text-blue-600" size={20} />,
      stats: [
        { label: "Regulatory Compliance", value: "100%" },
        { label: "Security Rating", value: "AAA+" },
      ],
    },
    {
      title: "Global Reach",
      description: "Serving customers across Nigeria with plans for African expansion",
      icon: <Globe className="text-green-600" size={20} />,
      stats: [
        { label: "Active Users", value: "500K+" },
        { label: "Transactions Daily", value: "50K+" },
      ],
    },
    {
      title: "Growth Metrics",
      description: "Consistent growth in user base and transaction volume",
      icon: <TrendingUp className="text-purple-600" size={20} />,
      stats: [
        { label: "Monthly Growth", value: "25%" },
        { label: "User Satisfaction", value: "98%" },
      ],
    },
    {
      title: "Awards & Recognition",
      description: "Recognized as Nigeria's fastest-growing fintech platform",
      icon: <Award className="text-yellow-600" size={20} />,
      stats: [
        { label: "Industry Awards", value: "12" },
        { label: "Years in Business", value: "3+" },
      ],
    },
  ]

  const categories = ["All", "Security", "Transaction", "Banking", "Rewards", "Support", "Analytics"]

  const filteredFeatures =
    selectedCategory === "All" ? features : features.filter((feature) => feature.category === selectedCategory)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleExploreFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((feature) => (feature.id === featureId ? { ...feature, status: "explored" } : feature)),
    )

    if (features.find((f) => f.id === featureId)?.status === "not-explored") {
      setExploredCount((prev) => prev + 1)
    }

    // Navigate to specific feature pages
    switch (featureId) {
      case "airtime-data":
        router.push("/airtime")
        break
      case "withdrawal":
        router.push("/withdraw")
        break
      case "support":
        router.push("/support")
        break
      case "earn-rewards":
        router.push("/earn")
        break
      case "atm-card":
        router.push("/order-atm")
        break
      case "referral":
        router.push("/earn")
        break
      default:
        // Show feature details in alert for now
        const feature = features.find((f) => f.id === featureId)
        if (feature) {
          alert(`${feature.title}\n\n${feature.details}\n\nBenefits:\n• ${feature.benefits.join("\n• ")}`)
        }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-primary">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-primary-foreground" size={20} />
        </button>
        <h1 className="text-primary-foreground text-xl font-bold">BLUEPAY Features</h1>
        <div className="text-primary-foreground text-sm">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-5 text-primary-foreground">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-3 text-balance">The Complete Financial Platform for Modern Nigeria</h2>
            <p className="text-primary-foreground/90 text-lg text-pretty">
              Discover powerful features designed to revolutionize how you manage money, earn rewards, and access
              financial services.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold">₦2.5B+</div>
              <div className="text-sm opacity-90">Transactions Processed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">500K+</div>
              <div className="text-sm opacity-90">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">99.9%</div>
              <div className="text-sm opacity-90">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Features Explored</p>
              <p className="text-xl font-bold text-foreground">
                {exploredCount}/{features.length}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {Math.round((exploredCount / features.length) * 100)}% Complete
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="text-primary" size={20} />
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(exploredCount / features.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-6">About BLUEPAY MOBILE 2026</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyInfo.map((info, index) => (
              <div key={index} className="bg-card rounded-xl p-4 border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-2">{info.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4 text-pretty">{info.description}</p>
                    {info.stats && (
                      <div className="grid grid-cols-2 gap-4">
                        {info.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center">
                            <div className="text-xl font-bold text-primary">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">Explore Features</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
          {filteredFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-card rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-foreground mb-2 text-balance">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 text-pretty">{feature.description}</p>
                      <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                        {feature.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-foreground mb-3 text-pretty">{feature.details}</p>
                    <div className="space-y-1">
                      {feature.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle size={12} className="text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {feature.status === "explored" && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Explored</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleExploreFeature(feature.id)}
                      className={`px-5 py-3 rounded-full font-semibold text-sm transition-all ${
                        feature.status === "explored"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {feature.status === "explored" ? "Explored" : "Explore Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-4">Get in Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Phone className="text-primary" size={20} />
              <div>
                <div className="font-medium text-foreground">Phone</div>
                <div className="text-sm text-muted-foreground">+234 800 BLUEPAY</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-primary" size={20} />
              <div>
                <div className="font-medium text-foreground">Email</div>
                <div className="text-sm text-muted-foreground">support@bluepay.ng</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={20} />
              <div>
                <div className="font-medium text-foreground">Address</div>
                <div className="text-sm text-muted-foreground">Lagos, Nigeria</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
