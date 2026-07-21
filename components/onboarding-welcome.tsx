"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface OnboardingWelcomeProps {
  onNext: () => void
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Hero Banner Image - Bolder and larger */}
      <div className="w-full flex-shrink-0 h-56 sm:h-64 overflow-hidden shadow-md">
        <img
          src="/onboarding-hero-updated.png"
          alt="BLUEPAY MOBILE 2026 - Get Your Account Ready"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.15) saturate(1.1)' }}
        />
      </div>

      {/* Logo and Content Section */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-4 sm:py-6 min-h-0 justify-between">
        {/* Upper Section - Logo and Text moved down */}
        <div className="flex-1 flex flex-col min-h-0 justify-center">
          {/* BLUEPAY Logo */}
          <div className="flex-shrink-0 h-8 sm:h-10 mb-6 sm:mb-8">
            <img
              src="/bluepay-mobile-logo.png"
              alt="BLUEPAY MOBILE 2026"
              className="h-full object-contain"
            />
          </div>

          {/* Text Content - Moved down significantly */}
          <div className="space-y-2 sm:space-y-3 overflow-hidden">
            <h1 
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: '#0000FF' }}
            >
              Get Your Account Ready And Instantly.
            </h1>

            <p 
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: '#0000FF' }}
            >
              Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills at a cheaper price.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button - Fixed */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-6 py-2.5 sm:py-3">
        <button
          onClick={onNext}
          className="w-full py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#0000FF' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0000CC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0000FF'}
        >
          <span style={{ color: '#FFFFFF' }}>Get Started</span>
          <ArrowRight size={16} color="#FFFFFF" />
        </button>
      </div>
    </div>
  )
}
