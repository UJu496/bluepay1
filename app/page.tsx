"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="h-screen w-full bg-white overflow-hidden flex flex-col">
      {/* Header with Logo and Title */}
      <header className="pt-3 sm:pt-4 pb-2 px-4 sm:px-6 flex-shrink-0 animate-fade-in">
        {/* Logo */}
        <img 
          src="/bluepay-mobile-logo.png" 
          alt="BLUEPAY MOBILE" 
          className="h-7 sm:h-8 object-contain mb-2"
        />
        
        {/* Centered Title */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "#0000FF" }}>
            BLUEPAY MOBILE
          </h2>
          <p className="text-lg sm:text-xl font-bold" style={{ color: "#0000FF" }}>
            2026
          </p>
        </div>
      </header>

      {/* Hero Section - Fills remaining screen */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Hero Image */}
          <div className="relative w-full h-40 sm:h-48 flex-shrink-0 px-3 sm:px-4 animate-fade-in animation-delay-100">
            <img
              src="/onboarding-hero-updated.png"
              alt="BLUEPAY MOBILE 2026"
              className="w-full h-full object-cover rounded-2xl shadow-md"
              style={{ filter: "contrast(1.2) saturate(1.15)" }}
            />
          </div>

          {/* Content Section */}
          <div className="px-4 sm:px-6 py-5 sm:py-6 flex-1 flex flex-col justify-center min-h-0 animate-fade-in animation-delay-200">
            <div className="w-full max-w-md mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full mb-3 text-xs sm:text-sm font-semibold">
                <span>Fast • Secure • Affordable</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">
                Pay Bills, Buy Airtime & Data in Seconds
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
                Everything you need to manage your digital payments in one place. Buy airtime, data bundles, pay bills, transfer money, and manage your wallet instantly and securely.
              </p>

              {/* Primary CTA Button */}
              <Link 
                href="/get-started" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="h-3 flex-shrink-0"></div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}
