"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    if (errorMessage) setErrorMessage("")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const result = await authClient.signIn.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (result.error || !result.data?.user) {
        setErrorMessage("Invalid email or password. Please try again.")
        return
      }

      localStorage.setItem("userData", JSON.stringify({
        id: result.data.user.id,
        fullName: result.data.user.name,
        email: result.data.user.email,
      }))

      const pinStatus = await fetch("/api/pin/status", { cache: "no-store" })
      if (!pinStatus.ok) throw new Error("Unable to check PIN status")
      const status = (await pinStatus.json()) as { hasPin: boolean }
      router.replace(status.hasPin ? "/verify-pin" : "/create-pin")
      router.refresh()
    } catch {
      setErrorMessage("We couldn't sign you in right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <main className="flex min-h-screen flex-col items-center justify-center px-5 py-4" style={{ backgroundColor: "#0000FF" }}>
      <div role="status" className="text-center"><div className="mx-auto mb-3 size-14 animate-spin rounded-full border-b-2 border-white" /><p className="text-lg text-white">Signing you in...</p></div>
    </main>
  }

  return (
    <main className="flex min-h-screen flex-col px-5 py-4" style={{ backgroundColor: "#0000FF" }}>
      <header className="mb-6 flex items-center justify-between">
        <Link href="/get-started" aria-label="Back to sign up" className="text-white"><ArrowLeft size={22} /></Link>
        <span className="text-sm text-white">You Need Help?</span>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-xl font-bold text-white">BLUEPAY</h1>
          <h2 className="mb-3 text-xl font-bold text-white">Sign In</h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-white">Sign in with your secure BLUEPAY account to continue to PIN verification.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <label htmlFor="email" className="sr-only">Your email</label>
          <input id="email" type="email" name="email" autoComplete="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border-2 bg-transparent px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30" style={{ borderColor: "rgba(255,255,255,.65)" }} required maxLength={320} />
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input id="password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full rounded-lg border-2 bg-transparent px-4 py-3 pr-11 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30" style={{ borderColor: "rgba(255,255,255,.65)" }} required />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {errorMessage && <p role="alert" className="rounded-lg border border-red-300 bg-red-500/20 p-3 text-center text-sm font-semibold text-white">{errorMessage}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-full bg-white py-3 text-base font-semibold disabled:opacity-50" style={{ color: "#0000FF" }}>Login</button>
        </form>
        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          <Link href="/forgot-password" className="text-white underline">Forgot account password?</Link>
          <Link href="/forgot-pin" className="text-white underline">Forgot BLUEPAY PIN?</Link>
        </div>
        <p className="mt-4 text-sm text-white">Don&apos;t have an account? <Link href="/get-started" className="underline">Create account</Link></p>
      </section>
    </main>
  )
}
