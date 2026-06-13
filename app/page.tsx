"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verificationStatus = localStorage.getItem("userVerified")
    setIsVerified(verificationStatus === "true")
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-4"
      style={{ backgroundColor: "#0000FF" }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-white relative">
          <div className="relative inline-block">
            <div className="mb-4"></div>

            <div className="flex items-center">
              {"BLUEPAY".split("").map((letter, index) => (
                <span
                  key={index}
                  className="text-xl font-bold animate-pulse"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: "2s",
                    animationIterationCount: "infinite",
                  }}
                >
                  {letter}
                </span>
              ))}
              <span
                className="text-xl font-light ml-2 animate-pulse"
                style={{ animationDelay: "0.7s", animationDuration: "2s", animationIterationCount: "infinite" }}
              >
                2026
              </span>
              {isVerified && (
                <div className="ml-2 animate-bounce">
                  <CheckCircle className="text-green-400 bg-white rounded-full" size={20} />
                </div>
              )}
            </div>
            {/* Animated underline */}
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-white animate-pulse"
              style={{
                width: "100%",
                animationDuration: "1.5s",
                animationIterationCount: "infinite",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg px-10 py-3 mb-4 shadow-lg w-full max-w-sm">
        <div className="text-lg font-bold text-center tracking-wide flex justify-center items-center overflow-hidden">
          <div
            className="whitespace-nowrap animate-pulse"
            style={{
              color: "#0000FF",
              animation: "slideRtlContinuous 3s linear infinite",
            }}
          >
            BLUEPAY2026
          </div>
          {isVerified && <CheckCircle className="text-green-500 ml-2" size={18} />}
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-sm mx-auto mb-4">
        <h3
          className="text-white text-xl font-bold leading-tight mb-5"
          style={{
            fontFamily: "Brush Script MT, cursive",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "1px",
          }}
        >
          Get Your Account Ready And Instantly.
        </h3>

        <p className="text-white text-sm leading-relaxed mb-4">
          Get your account ready and instantly start buying, selling airtime and data online and start paying all your
          bills in cheaper price.
        </p>
      </div>

      {/* Get Started Button - Updated to redirect to onboarding flow */}
      <Link href="/onboarding">
        <button
          className="bg-white px-14 py-3 rounded-full text-base font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          style={{ color: "#0000FF" }}
        >
          Get Started
        </button>
      </Link>
    </div>
  )
}
