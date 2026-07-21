"use client"

import { useRouter } from "next/navigation"
import OnboardingWelcome from "@/components/onboarding-welcome"

export default function OnboardingPage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/get-started")
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
      <OnboardingWelcome onNext={handleNext} />
    </div>
  )
}
