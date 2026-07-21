"use client"

import { ArrowRight } from "lucide-react"

interface OnboardingWelcomeProps {
  onNext: () => void
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Hero Banner Image */}
      <div className="w-full flex-shrink-0 overflow-hidden">
        <img
          src="/onboarding-hero-updated.png"
          alt="BLUEPAY MOBILE 2026 - Get Your Account Ready"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 flex flex-col overflow-y-auto px-6 py-8 pb-32">
        {/* Text Content */}
        <div className="space-y-6">
          <h1 
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#0000FF' }}
          >
            Get Your Account Ready And Instantly.
          </h1>

          <p 
            className="text-base md:text-lg leading-relaxed"
            style={{ color: '#0000FF' }}
          >
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills at a cheaper price.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 shadow-lg">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
          style={{ backgroundColor: '#0000FF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0000CC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0000FF'}
        >
          <span style={{ color: '#FFFFFF' }}>Get Started</span>
          <ArrowRight size={24} color="#FFFFFF" />
        </button>
      </div>
    </div>
  )
}
