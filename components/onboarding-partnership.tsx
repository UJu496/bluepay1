"use client"

import { ArrowRight } from "lucide-react"

interface OnboardingPartnershipProps {
  onNext: () => void
}

export default function OnboardingPartnership({ onNext }: OnboardingPartnershipProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Main Image Content */}
      <div className="flex-1 overflow-y-auto">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lumii_20251019_131726593-YaEUpiT2kYSwEpD1qOJ3rbhigLcmFJ.jpg"
          alt="EFSANE Cryptocurrency Partnership"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Continue Button */}
      <div className="p-6 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0000FF" }}
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
