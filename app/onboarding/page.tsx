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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
      {/* Skip Button - Only show for partnership and mastercard steps */}
      {currentStep > 0 && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 bg-blue-600/20 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full font-semibold text-xs hover:bg-blue-600/30 transition-all duration-300 z-20"
        >
          SKIP
        </button>
      )}

      {/* Progress Indicator - Only show for partnership and mastercard steps */}
      {currentStep > 0 && (
        <div className="absolute top-4 left-4 flex gap-1.5 z-20">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index <= currentStep ? "bg-blue-600" : "bg-blue-600/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        className={`w-full h-full transition-all duration-300 ${
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <CurrentComponent onNext={handleNext} />
      </div>

      {/* Step Counter - Only show for partnership and mastercard steps */}
      {currentStep > 0 && (
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-600/60 text-xs z-20">
          {currentStep + 1} of {onboardingSteps.length}
        </p>
      )}
    </div>
  )
}
