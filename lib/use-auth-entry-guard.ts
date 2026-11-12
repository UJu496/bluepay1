"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { resolveInitialFirebaseUser } from "@/lib/firebase"

export function useAuthEntryGuard() {
  const router = useRouter()
  const [readyForAnonymousUser, setReadyForAnonymousUser] = useState(false)

  useEffect(() => {
    let active = true

    void resolveInitialFirebaseUser().then(({ user, isNewUser }) => {
      if (!active) return
      if (user) {
        router.replace(isNewUser ? "/create-pin" : "/dashboard")
        return
      }
      setReadyForAnonymousUser(true)
    }).catch(() => {
      if (active) setReadyForAnonymousUser(true)
    })

    return () => {
      active = false
    }
  }, [router])

  return readyForAnonymousUser
}
