"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="h-screen w-full bg-white overflow-hidden flex flex-col">
      {/* Header with Logo and Title */}
      <header className="pt-3 sm:pt-4 pb-2 px-4 sm:px-6 flex-shrink-0 animate-fade-in">
        {/* Logo Container */}
        <div className="mb-3 flex justify-start">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260721-145421_1.png-n7Q9BXsaGuJpaUoZyYpOVKnrfn48JY.jpeg" 
              alt="BluePay BM" 
              className="h-8 sm:h-10 object-contain"
            />
          </div>
        </div>
        
        {/* Centered Title - Matching BM Logo Design */}
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
            <span 
              className="inline-block logo-blue" 
              style={{
                background: "linear-gradient(180deg, #6B5FFF 0%, #5D4FEF 50%, #4A3FD8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 4px rgba(93, 79, 239, 0.2))",
                textShadow: "0 0 12px rgba(107, 95, 255, 0.3)",
                letterSpacing: "0.02em"
              }}
            >
              BLUE
            </span>
            <span 
              className="inline-block logo-silver ml-0.5" 
              style={{
                background: "linear-gradient(180deg, #E8E8E8 0%, #D0D0D0 50%, #B8B8B8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 4px rgba(176, 176, 176, 0.2))",
                textShadow: "0 0 8px rgba(200, 200, 200, 0.2)",
                letterSpacing: "0.02em"
              }}
            >
              PAY
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold">
            <span 
              className="inline-block logo-blue" 
              style={{
                background: "linear-gradient(180deg, #6B5FFF 0%, #5D4FEF 50%, #4A3FD8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 1.5px 3px rgba(93, 79, 239, 0.15))",
                letterSpacing: "0.015em"
              }}
            >
              MOBILE
            </span>
          </div>
          <p 
            className="text-base sm:text-lg font-bold mt-1 logo-blue" 
            style={{
              background: "linear-gradient(180deg, #6B5FFF 0%, #5D4FEF 50%, #4A3FD8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 1.5px 3px rgba(93, 79, 239, 0.15))",
              letterSpacing: "0.015em"
            }}
          >
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
        
        .title-gradient {
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  )
}
