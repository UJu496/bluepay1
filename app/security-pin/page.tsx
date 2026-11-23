"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SecurityPinPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/change-pin")
  }, [router])

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc] px-5 text-center text-sm text-[#344269]" aria-live="polite">Opening secure PIN settings…</main>
}
