"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FirebaseError } from "firebase/app"
import { completeGoogleRedirect, monitorAuthState, signInWithGoogle } from "@/lib/firebase"

function describeGoogleAuthError(error: unknown, phase: string) {
  if (error instanceof FirebaseError) {
    return `${phase} — Firebase error ${error.code}: ${error.message}`
  }
  if (error instanceof Error) {
    return `${phase} — application error ${error.name}: ${error.message}`
  }
  return `${phase} — unknown error: ${String(error)}`
}

function getSafeGoogleErrorDetails(error: unknown) {
  const value = error && typeof error === "object" ? error as Record<string, unknown> : {}
  const customData = value.customData && typeof value.customData === "object"
    ? value.customData as Record<string, unknown>
    : undefined
  const safeCustomData = customData
    ? Object.fromEntries(Object.entries(customData).map(([key, item]) => [
        key,
        /token|credential|password|secret|email|code/i.test(key)
          ? "[redacted]"
          : item && typeof item === "object"
            ? `[object keys: ${Object.keys(item).join(", ")}]`
            : item,
      ]))
    : undefined

  return {
    name: error instanceof Error ? error.name : typeof error,
    code: typeof value.code === "string" ? value.code : null,
    message: error instanceof Error ? error.message : String(error),
    customDataKeys: customData ? Object.keys(customData) : [],
    customData: safeCustomData,
    href: window.location.href,
    hostname: window.location.hostname,
    origin: window.location.origin,
    isTopFrame: window.self === window.top,
  }
}

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
      if (!active || !result?.user) return
      try {
        completeLogin(result.user)
      } catch (handoffError) {
        setError(describeGoogleAuthError(handoffError, "Google redirect dashboard handoff"))
      }
    }).catch((redirectError) => {
      if (!active) return
      const code = redirectError instanceof FirebaseError ? redirectError.code : ""
      if (code !== "auth/no-auth-event") {
        console.error("[v0] Google redirect callback error", JSON.stringify(getSafeGoogleErrorDetails(redirectError)))
        setError(describeGoogleAuthError(redirectError, "Google OAuth redirect callback"))
      }
    })
    const unsubscribe = monitorAuthState((user) => {
      if (!active || !user) return
      try {
        completeLogin(user)
      } catch (handoffError) {
        setError(describeGoogleAuthError(handoffError, "Google auth-state dashboard handoff"))
      }
    }, (authStateError) => {
      if (active) {
        console.error("[v0] Google auth-state observer error", JSON.stringify(getSafeGoogleErrorDetails(authStateError)))
        setError(describeGoogleAuthError(authStateError, "Firebase auth-state observer"))
      }
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    let result
    try {
      result = await signInWithGoogle()
    } catch (authError) {
      console.error("[v0] Google popup sign-in error", JSON.stringify(getSafeGoogleErrorDetails(authError)))
      setError(describeGoogleAuthError(authError, "Google popup sign-in"))
      setIsLoading(false)
      return
    }

    if (result?.user) {
      try {
        completeLogin(result.user)
      } catch (handoffError) {
        setError(describeGoogleAuthError(handoffError, "Google sign-in dashboard handoff"))
        setIsLoading(false)
      }
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
      {error && <p role="alert" aria-live="assertive" className="break-words rounded-lg border border-red-300/40 bg-red-950/30 p-3 text-left text-xs leading-relaxed text-red-100">{error}</p>}
      <div className="flex items-center gap-3 py-1 text-white/90" aria-label="or">
        <span className="h-px flex-1 bg-white/50" />
        <span className="text-xs font-semibold">OR</span>
        <span className="h-px flex-1 bg-white/50" />
      </div>
    </div>
  )
}
