"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, Search, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const faqCategories = [
  {
    category: "Getting Started",
    icon: HelpCircle,
    questions: [
      {
        q: "How do I create a BLUEPAY account?",
        a: "Download the BLUEPAY app, click 'Sign Up', provide your phone number, email, and BVN. Verify your identity with OTP, and you're ready to start using BLUEPAY services.",
      },
      {
        q: "What documents do I need to register?",
        a: "You need a valid Nigerian phone number, email address, BVN (Bank Verification Number), and a government-issued ID for KYC verification.",
      },
      {
        q: "Is BLUEPAY available outside Nigeria?",
        a: "Currently, BLUEPAY services are available in Nigeria. We're working on expanding to other African countries soon.",
      },
    ],
  },
  {
    category: "Transactions & Payments",
    icon: MessageCircle,
    questions: [
      {
        q: "What are the transaction limits?",
        a: "Daily limits: ₦500,000 for transfers, ₦200,000 for ATM withdrawals. Monthly limit is ₦5,000,000. Limits can be increased with Tier 3 verification.",
      },
      {
        q: "How long do transfers take?",
        a: "BLUEPAY to BLUEPAY transfers are instant. Bank transfers take 1-5 minutes. International transfers take 1-3 business days.",
      },
      {
        q: "What are the transaction fees?",
        a: "BLUEPAY to BLUEPAY: Free. Bank transfers: ₦10-50 depending on amount. ATM withdrawals: ₦35 per transaction. International transfers: 1.5% + ₦500.",
      },
      {
        q: "Can I reverse a transaction?",
        a: "Contact support immediately if you sent money to the wrong account. Reversals are processed within 24-48 hours if the recipient hasn't withdrawn the funds.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    icon: Phone,
    questions: [
      {
        q: "How secure is BLUEPAY?",
        a: "BLUEPAY uses bank-level 256-bit encryption, two-factor authentication, biometric login, and is CBN-licensed. All transactions are monitored 24/7 for fraud.",
      },
      {
        q: "What if my phone is stolen?",
        a: "Immediately call our hotline at 0800-BLUEPAY to freeze your account. You can also freeze it from another device by logging into your account.",
      },
      {
        q: "How do I enable two-factor authentication?",
        a: "Go to Settings > Security & Privacy > Two-Factor Authentication. Choose SMS, Email, or Authenticator App as your preferred method.",
      },
      {
        q: "Does BLUEPAY share my data?",
        a: "No. We never sell your personal data. We only share information required by law with regulatory bodies like CBN and NDIC.",
      },
    ],
  },
  {
    category: "Cards & ATM",
    icon: Mail,
    questions: [
      {
        q: "How do I get a BLUEPAY card?",
        a: "Order a physical card from Settings > Cards. Virtual cards are available instantly. Physical cards are delivered within 5-7 business days.",
      },
      {
        q: "Can I use my card internationally?",
        a: "Yes! BLUEPAY cards work globally wherever Mastercard is accepted. Enable international transactions in Settings > Cards.",
      },
      {
        q: "What if my card is lost or stolen?",
        a: "Freeze your card immediately in the app under Cards > Freeze Card. Order a replacement card for ₦1,000.",
      },
      {
        q: "Are there ATM withdrawal limits?",
        a: "Daily ATM limit is ₦200,000. You can withdraw from any ATM in Nigeria. International ATM withdrawals have a ₦500 fee.",
      },
    ],
  },
  {
    category: "Bills & Airtime",
    icon: HelpCircle,
    questions: [
      {
        q: "What bills can I pay on BLUEPAY?",
        a: "Pay for electricity, cable TV, internet, airtime, data, betting, and more. We support all major Nigerian service providers.",
      },
      {
        q: "Do I get cashback on bill payments?",
        a: "Yes! Earn 0.5-2% cashback on all bill payments. Cashback is credited instantly to your wallet.",
      },
      {
        q: "Can I schedule recurring payments?",
        a: "Yes. Set up auto-pay for recurring bills like electricity and cable TV. Never miss a payment again!",
      },
    ],
  },
  {
    category: "Earnings & Referrals",
    icon: MessageCircle,
    questions: [
      {
        q: "How does the referral program work?",
        a: "Share your referral code. When someone signs up and makes their first transaction, you both earn ₦500. No limit on referrals!",
      },
      {
        q: "How can I earn with BLUEPAY?",
        a: "Earn through referrals, cashback on transactions, savings interest (up to 15% p.a.), and by becoming a BLUEPAY agent.",
      },
      {
        q: "When do I receive my earnings?",
        a: "Referral bonuses are instant. Cashback is credited within 24 hours. Savings interest is paid monthly.",
      },
    ],
  },
]

export default function FAQPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (question: string) => {
    const newOpen = new Set(openQuestions)
    if (newOpen.has(question)) {
      newOpen.delete(question)
    } else {
      newOpen.add(question)
    }
    setOpenQuestions(newOpen)
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-sm text-gray-600">Find answers to common questions</p>
          </div>
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">150+</div>
            <div className="text-xs text-gray-600">Articles</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-xs text-gray-600">Support</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-xs text-gray-600">Satisfaction</div>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.category} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-lg font-semibold">{category.category}</h2>
                  <span className="ml-auto text-sm text-gray-500">{category.questions.length} questions</span>
                </div>
                <div className="space-y-3">
                  {category.questions.map((item, idx) => (
                    <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                      <button
                        onClick={() => toggleQuestion(`${category.category}-${idx}`)}
                        className="w-full flex items-start gap-3 text-left"
                      >
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 mt-0.5 transition-transform ${
                            openQuestions.has(`${category.category}-${idx}`) ? "rotate-180" : ""
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.q}</div>
                          {openQuestions.has(`${category.category}-${idx}`) && (
                            <div className="mt-2 text-sm text-gray-600 leading-relaxed">{item.a}</div>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Contact Support */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h3 className="font-semibold mb-2">Still need help?</h3>
          <p className="text-sm opacity-90 mb-4">Our support team is available 24/7 to assist you</p>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="secondary" size="sm" className="flex flex-col gap-1 h-auto py-3">
              <Phone className="h-5 w-5" />
              <span className="text-xs">Call Us</span>
            </Button>
            <Button variant="secondary" size="sm" className="flex flex-col gap-1 h-auto py-3">
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Live Chat</span>
            </Button>
            <Button variant="secondary" size="sm" className="flex flex-col gap-1 h-auto py-3">
              <Mail className="h-5 w-5" />
              <span className="text-xs">Email</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
