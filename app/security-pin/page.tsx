"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUserPin } from "@/lib/user-pin"

export default function SecurityPinPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(getCurrentUserPin() ? "/change-pin" : "/create-pin")
  }, [router])

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc] px-5 text-center text-sm text-[#344269]" aria-live="polite">Opening your BLUEPAY PIN settings…</main>
}
