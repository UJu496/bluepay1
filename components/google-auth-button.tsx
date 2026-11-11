"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FirebaseError } from "firebase/app"
import { completeGoogleRedirect, monitorAuthState, signInWithGoogle } from "@/lib/firebase"

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M21.35 12.23c0-.7-.06-1.37-.18-2.02H12v3.82h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.19Z" />
      <path fill="#34A853" d="M12 21.8c2.63 0 4.84-.87 6.45-2.38l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.8Z" />
      <path fill="#FBBC05" d="M6.53 13.86a5.86 5.86 0 0 1 0-3.72V7.61H3.28a9.8 9.8 0 0 0 0 8.78l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.11c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.15 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.72 5.41l3.25 2.53C7.3 7.83 9.46 6.11 12 6.11Z" />
    </svg>
  )
}

export function GoogleAuthButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigationStarted = useRef(false)

  const completeLogin = (user: import("firebase/auth").User) => {
    const previous = JSON.parse(localStorage.getItem("userData") || "{}")
    localStorage.setItem("userData", JSON.stringify({
      ...previous,
      fullName: user.displayName || previous.fullName || "Account holder",
      email: user.email || previous.email || "",
      photoURL: user.photoURL || previous.photoURL || "",
      uid: user.uid,
    }))
    if (!navigationStarted.current) {
      navigationStarted.current = true
      router.replace("/dashboard")
    }
  }

  useEffect(() => {
    let active = true
    void completeGoogleRedirect().then((result) => {
      if (active && result?.user) completeLogin(result.user)
    }).catch((redirectError) => {
      if (!active) return
      const code = redirectError instanceof FirebaseError ? redirectError.code : "unknown"
      if (code !== "auth/no-auth-event") {
        console.error("[v0] Firebase Google redirect failed", redirectError)
        setError(`Google sign-in could not be completed (${code}). Please try again.`)
      }
    })
    const unsubscribe = monitorAuthState((user) => {
      if (active && user) completeLogin(user)
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signInWithGoogle()
      if (result?.user) completeLogin(result.user)
    } catch (authError) {
      const code = authError instanceof FirebaseError ? authError.code : "unknown"
      console.error("[v0] Firebase Google sign-in failed", authError)
      setError(code === "auth/popup-closed-by-user" ? "Google sign-in was cancelled." : `Google sign-in failed (${code}). Check Firebase Authorized Domains and Google provider settings.`)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        <GoogleMark />
        {isLoading ? "Connecting..." : "Continue with Google"}
      </button>
      {error && <p className="text-center text-xs text-red-100">{error}</p>}
      <div className="flex items-center gap-3 py-1 text-white/90" aria-label="or">
        <span className="h-px flex-1 bg-white/50" />
        <span className="text-xs font-semibold">OR</span>
        <span className="h-px flex-1 bg-white/50" />
      </div>
    </div>
  )
}
