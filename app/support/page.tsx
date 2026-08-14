"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, MessageCircle, Phone, Clock, HelpCircle, FileText, Users, Send, Bot } from "lucide-react"

export default function SupportPage() {
  const router = useRouter()
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([
    { text: "Hello! I'm BLUEPAY AI Assistant. How can I help you today?", isUser: false, timestamp: new Date() },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("bpc") && message.includes("code")) {
      return "To get a BPC code, click 'Buy BPC' from your dashboard, fill in your details and amount, then complete payment. Your BPC code will be displayed once payment is confirmed. BPC codes are required for withdrawals, airtime, and data purchases."
    }

    if (message.includes("withdraw") || message.includes("withdrawal")) {
      return "Withdrawals are processed instantly with the correct BPC code. Go to your dashboard, click 'Withdraw', enter your bank details and BPC code. Funds typically reflect within 5-10 minutes."
    }

    if (message.includes("airtime") || message.includes("data")) {
      return "To buy airtime or data, select the service from your dashboard, choose your network, enter amount and phone number, then provide your BPC code to complete the purchase."
    }

    if (message.includes("balance") || message.includes("money")) {
      return "You can check your balance on the dashboard. Earn money through our tasks in the 'Earn' section, or add funds by purchasing BPC codes. Each completed task rewards you with ₦3,000."
    }

    if (message.includes("earn") || message.includes("task")) {
      return "Visit the 'Earn' section from your dashboard to complete various tasks and earn ₦3,000 for each completed task. Tasks include watching videos, sharing content, and joining our community."
    }

    if (message.includes("support") || message.includes("help") || message.includes("contact")) {
      return "You can contact our support team via email (bluepay032@gmail.com), WhatsApp (+2349167089066), or phone. We're available 24/7 for urgent issues."
    }

    if (message.includes("account") || message.includes("profile")) {
      return "Manage your account through the Profile section. You can upgrade to premium membership for ₦5,000 and get exclusive benefits plus ₦3,000 bonus reward."
    }

    if (message.includes("payment") || message.includes("transaction")) {
      return "All transactions require BPC codes for security. Failed transactions are automatically refunded within 24 hours. Check your transaction history in the Profile section."
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! Welcome to BLUEPAY support. I'm here to help you with any questions about BPC codes, withdrawals, airtime, data, earnings, or account management. What would you like to know?"
    }

      return "I understand you need help with that. For detailed assistance, please contact our support team at bluepay032@gmail.com or WhatsApp +2349167089066. Our human agents are available 24/7 to help you with any specific issues."
  }

  const sendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = { text: chatInput, isUser: true, timestamp: new Date() }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(chatInput)
      const aiMessage = { text: aiResponse, isUser: false, timestamp: new Date() }
      setChatMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const faqs = [
    {
      question: "How do I buy a BPC code?",
      answer:
        "Click on 'Buy BPC' from the dashboard, fill in your details and amount, then complete the payment process. Your BPC code will be displayed once payment is confirmed.",
    },
    {
      question: "What is a BPC code used for?",
      answer:
        "BPC codes are required for withdrawals, airtime purchases, and data purchases. They serve as a security measure for all transactions on BLUEPAY.",
    },
    {
      question: "How long does withdrawal take?",
      answer:
        "Withdrawals are processed instantly once you provide the correct BPC code and bank details. Funds typically reflect in your account within 5-10 minutes.",
    },
    {
      question: "Can I get a refund for failed transactions?",
      answer:
        "Yes, failed transactions are automatically refunded to your BLUEPAY balance within 24 hours. Contact support if you don't receive your refund.",
    },
    {
      question: "How do I check my transaction history?",
      answer:
        "Go to your Profile section from the dashboard to view all your transaction history, including purchases, withdrawals, and earnings.",
    },
  ]

  const handleEmailSupport = () => {
    window.location.href = "mailto:bluepay032@gmail.com?subject=BLUEPAY Support Request"
  }

  const handleWhatsAppSupport = () => {
    window.open("https://chat.whatsapp.com/CBNqoGML6jZ8qmxIeu9D16?s=cl&p=a&ilr=1", "_blank")
  }

  const handleCallSupport = () => {
    window.open("https://chat.whatsapp.com/CBNqoGML6jZ8qmxIeu9D16?s=cl&p=a&ilr=1", "_blank")
  }

  const handleJoinCommunity = () => {
    window.open("https://chat.whatsapp.com/CBNqoGML6jZ8qmxIeu9D16?s=cl&p=a&ilr=1", "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#0000FF" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Support</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full p-4 text-white rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-all"
            style={{ background: "linear-gradient(to right, #0000FF, #0000FF)" }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm opacity-90">Get instant answers to your questions</p>
            </div>
          </button>
        </div>

        {showChat && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div style={{ background: "linear-gradient(to right, #0000FF, #0000FF)" }} className="p-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Bot size={20} />
                BLUEPAY AI Assistant
              </h3>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser ? "text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                    style={message.isUser ? { backgroundColor: "#0000FF" } : {}}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask me anything about BLUEPAY..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="px-4 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: "#0000FF" }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Options */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="space-y-4">
            {/* Email Support */}
            <button
              onClick={handleEmailSupport}
              className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0000FF20" }}
              >
                <Mail style={{ color: "#0000FF" }} size={20} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800">Email Support</h3>
                <p className="text-sm text-gray-600">bluepay032@gmail.com</p>
                <p className="text-xs text-gray-500">Response within 24 hours</p>
              </div>
            </button>

            {/* WhatsApp Support */}
            <button
              onClick={handleWhatsAppSupport}
              className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="text-green-600" size={20} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800">WhatsApp Community</h3>
                <p className="text-sm text-gray-600">Join our group</p>
                <p className="text-xs text-gray-500">Instant messaging support</p>
              </div>
            </button>

            {/* Phone Support - Now redirects to WhatsApp Community */}
            <button
              onClick={handleCallSupport}
              className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="text-green-600" size={20} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800">WhatsApp Group Support</h3>
                <p className="text-sm text-gray-600">Join our group</p>
                <p className="text-xs text-gray-500">Available 24/7</p>
              </div>
            </button>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "#0000FF20" }}>
          <div className="flex items-center gap-3 mb-3">
            <Clock style={{ color: "#0000FF" }} size={20} />
            <h3 className="font-semibold" style={{ color: "#0000FF" }}>
              Support Hours
            </h3>
          </div>
          <div className="space-y-2 text-sm" style={{ color: "#0000FF" }}>
            <div className="flex justify-between">
              <span>WhatsApp & Phone:</span>
              <span className="font-semibold">24/7 Available</span>
            </div>
            <div className="flex justify-between">
              <span>Email Support:</span>
              <span className="font-semibold">24 hours response</span>
            </div>
            <div className="flex justify-between">
              <span>Live Chat:</span>
              <span className="font-semibold">9 AM - 9 PM</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <FileText style={{ color: "#0000FF" }} className="mx-auto mb-2" size={20} />
              <p className="text-sm font-semibold text-gray-800">Report Issue</p>
            </button>
            <button
              onClick={handleJoinCommunity}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
            >
              <Users style={{ color: "#0000FF" }} className="mx-auto mb-2" size={20} />
              <p className="text-sm font-semibold text-gray-800">Join Community</p>
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle style={{ color: "#0000FF" }} size={20} />
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                  </div>
                  <div className={`transform transition-transform ${selectedFAQ === index ? "rotate-180" : ""}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gray-400">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
                {selectedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">Emergency Support</h3>
          <p className="text-sm text-red-700 mb-3">
            For urgent issues like unauthorized transactions or account security concerns, contact us immediately.
          </p>
          <button
            onClick={handleWhatsAppSupport}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Contact Emergency Support
          </button>
        </div>
      </div>
    </div>
  )
}
