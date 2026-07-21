"use client"

import { ArrowRight } from "lucide-react"

interface OnboardingWelcomeProps {
  onNext: () => void
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner Image */}
      <div className="w-full flex-shrink-0 overflow-hidden">
        <img
          src="/onboarding-hero.png"
          alt="BLUEPAY 2026 - Get Your Account Ready"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between px-6 py-8">
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 leading-tight">
            Get Your Account Ready And Instantly.
          </h1>

          <p className="text-base md:text-lg text-blue-600 leading-relaxed">
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills at a cheaper price.
          </p>
        </div>
        
        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Bottom Button */}
        <button
          onClick={onNext}
          className="w-full py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 mt-8"
        >
          <span>Get Started</span>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  )
}
