"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

interface OnboardingWelcomeProps {
  onNext: () => void
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  const [isSlicing, setIsSlicing] = useState(false)
  const [currentRobotIndex, setCurrentRobotIndex] = useState(0)

  const robotImages = [
    "/robot-lineup-1.jpg",
    "/robot-close-up-blue.jpg",
    "/robot-lineup-2.jpg",
    "/robot-bluepay-branded.jpg",
    "/robot-lineup-3.jpg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSlicing(true)
      setTimeout(() => setIsSlicing(false), 1000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const robotInterval = setInterval(() => {
      setCurrentRobotIndex((prev) => (prev + 1) % robotImages.length)
    }, 1500)

    return () => clearInterval(robotInterval)
  }, [robotImages.length])

  return (
    <div className="text-center">
      {/* Slicing Button Animation */}
      <div className="mb-4">
        <div className="relative inline-block">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl transition-all duration-500 overflow-hidden ${
              isSlicing ? "bg-white scale-110" : "bg-white/90 scale-100"
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={robotImages[currentRobotIndex] || "/placeholder.svg"}
                alt="BLUEPAY Robot"
                className="w-full h-full object-cover rounded-full animate-pulse"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-slide-right-to-left"></div>
            </div>
          </div>
          <div
            className={`absolute -inset-4 bg-white/30 rounded-full transition-all duration-500 ${
              isSlicing ? "animate-ping scale-110" : "scale-100"
            }`}
          ></div>
          {/* Slicing effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-500 ${
              isSlicing ? "opacity-70 animate-pulse" : ""
            }`}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">Welcome to BLUEPAY INT'L</h1>
      <h2 className="text-xl font-semibold text-white/90 mb-6">Your Digital Payment Solution</h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4 border border-white/20">
        <p className="text-white/90 text-base leading-relaxed">
          Operate or transact on Telegram without closing the app. Purchase airtime, data, or BPC CODE, and withdraw
          funds seamlessly.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <span>Continue</span>
        <ArrowRight size={20} />
      </button>

      <style jsx>{`
        @keyframes slide-right-to-left {
          0% { transform: translateX(100%); opacity: 0; }
          50% { transform: translateX(0%); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .animate-slide-right-to-left {
          animation: slide-right-to-left 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
