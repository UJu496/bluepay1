"use client"
import { useRouter } from "next/navigation"
import { CheckCircle, Phone, Mail, Home } from "lucide-react"

export default function OrderATMSuccessPage() {
  const router = useRouter()

  const handleBackToDashboard = () => {
    const currentTime = new Date().toLocaleString()
    const notification = {
      id: Date.now(),
      type: "atm_order",
      title: "MASTERCARD Order Successful",
      message:
        "Your BLUEPAY INT'L MASTERCARD has been ordered successfully! Our team will reach out via phone call or email.",
      timestamp: currentTime,
      read: false,
    }

    const existingNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]")
    existingNotifications.unshift(notification)
    localStorage.setItem("userNotifications", JSON.stringify(existingNotifications))

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0000FF" }}>
      <div className="max-w-sm w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Successful!</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your BLUEPAY INT'L MASTERCARD has been ordered successfully! Our team will reach out via phone call or
              email.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Phone Call</p>
                  <p className="text-xs text-gray-600">Our team will call you within 24 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Email Confirmation</p>
                  <p className="text-xs text-gray-600">Check your email for order details</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Home className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Delivery</p>
                  <p className="text-xs text-gray-600">Your MASTERCARD will be delivered in 3-5 days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-blue-600" size={16} />
              <span className="text-blue-800 font-semibold text-sm">Transaction Successful</span>
            </div>
            <p className="text-blue-700 text-xs">
              Your BLUEPAY INT'L MASTERCARD order has been successfully processed and recorded in your transaction
              history.
            </p>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <button
          onClick={handleBackToDashboard}
          className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Back to Dashboard
        </button>

        {/* Support Info */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-xs">Need help? Contact our support team anytime</p>
        </div>
      </div>
    </div>
  )
}
