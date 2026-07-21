"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface OnboardingWelcomeProps {
  onNext: () => void
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Hero Banner Image - Optimized height for mobile viewport */}
      <div className="w-full flex-shrink-0 h-40 sm:h-48 overflow-hidden">
        <img
          src="/onboarding-hero-updated.png"
          alt="BLUEPAY MOBILE 2026 - Get Your Account Ready"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Logo and Content Section */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-2 sm:py-3 min-h-0 justify-between">
        {/* Upper Section - Logo and Text */}
        <div className="flex-1 flex flex-col min-h-0 justify-start">
          {/* BLUEPAY Logo */}
          <div className="flex-shrink-0 h-8 sm:h-10 mb-2">
            <img
              src="/bluepay-mobile-logo.png"
              alt="BLUEPAY MOBILE 2026"
              className="h-full object-contain"
            />
          </div>

          {/* Text Content - Optimized spacing */}
          <div className="space-y-1.5 sm:space-y-2 overflow-hidden">
            <h1 
              className="text-xl sm:text-2xl font-bold leading-snug"
              style={{ color: '#0000FF' }}
            >
              Get Your Account Ready And Instantly.
            </h1>

            <p 
              className="text-xs sm:text-sm leading-snug"
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
