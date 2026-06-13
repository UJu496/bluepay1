"use client"

import { ArrowRight, CheckCircle } from "lucide-react"

interface OnboardingMastercardProps {
  onNext: () => void
}

export default function OnboardingMastercard({ onNext }: OnboardingMastercardProps) {
  const features = ["Worldwide acceptance", "Secure transactions", "Instant notifications", "Cashback rewards"]

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden">
          <img src="/bluepay-mastercard.jpeg" alt="BLUEPAY Mastercard" className="w-20 h-16 object-contain" />
        </div>
      </div>

      <h1 className="text-xl font-bold text-white mb-3">BLUEPAY INT'L MASTERCARD Now Live!</h1>
      <h2 className="text-lg font-semibold text-white/90 mb-6">Order your BLUEPAY INT'L MASTERCARD today!</h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4 border border-white/20">
        <p className="text-white/90 text-base leading-relaxed mb-6">
          Get your premium BLUEPAY INT'L MASTERCARD with exclusive benefits!
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-white" size={16} />
                <span className="text-white text-xs font-medium">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <span>Get Started</span>
        <ArrowRight size={20} />
      </button>
    </div>
  )
}
