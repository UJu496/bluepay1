"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import OnboardingWelcome from "@/components/onboarding-welcome"
import OnboardingPartnership from "@/components/onboarding-partnership"
import OnboardingMastercard from "@/components/onboarding-mastercard"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const onboardingSteps = [
    { id: "welcome", component: OnboardingWelcome },
    { id: "partnership", component: OnboardingPartnership },
    { id: "mastercard", component: OnboardingMastercard },
  ]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      setIsAnimating(true)
      setTimeout(() => {
        router.push("/get-started")
      }, 500)
    }
  }

  const handleSkip = () => {
    router.push("/get-started")
  }

  const CurrentComponent = onboardingSteps[currentStep].component

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden"
      style={{ backgroundColor: "#0000FF" }}
    >
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 z-10"
      >
        SKIP
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-6 left-6 flex gap-2">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index <= currentStep ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`max-w-sm w-full transition-all duration-300 ${
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <CurrentComponent onNext={handleNext} />

        {/* Step Counter */}
        <p className="text-white/60 text-xs mt-6 text-center">
          {currentStep + 1} of {onboardingSteps.length}
        </p>
      </div>
    </div>
  )
}
