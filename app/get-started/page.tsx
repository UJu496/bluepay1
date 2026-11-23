"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function GetStartedPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" })
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
      const result = await authClient.signUp.email({
        name: formData.fullName.trim().replace(/\s+/g, " "),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (result.error || !result.data?.user) {
        setErrorMessage("We couldn't create your account with those details. Check them or sign in if you already have an account.")
        return
      }

      localStorage.setItem("userData", JSON.stringify({
        id: result.data.user.id,
        fullName: result.data.user.name,
        email: result.data.user.email,
      }))
      router.replace("/create-pin")
      router.refresh()
    } catch {
      setErrorMessage("We couldn't create your account right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <main className="flex min-h-screen flex-col items-center justify-center px-5 py-4" style={{ backgroundColor: "#0000FF" }}>
      <div role="status" className="text-center"><div className="mx-auto mb-3 size-14 animate-spin rounded-full border-b-2 border-white" /><p className="text-lg text-white">Creating your account...</p></div>
    </main>
  }

  return (
    <main className="flex min-h-screen flex-col px-5 py-4" style={{ backgroundColor: "#0000FF" }}>
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" aria-label="Back to home" className="text-white"><ArrowLeft size={22} /></Link>
        <span className="text-sm text-white">You Need Help?</span>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-4 w-full max-w-md text-center">
          <h1 className="mb-3 text-xl font-bold text-white">Welcome!</h1>
          <p className="text-sm leading-relaxed text-white">Create your secure BLUEPAY account to manage your services and transactions.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <label className="sr-only" htmlFor="full-name">Your full name</label>
          <input id="full-name" type="text" name="fullName" autoComplete="name" placeholder="Your Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full rounded-xl border-2 bg-transparent px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30" style={{ borderColor: "rgba(255, 255, 255, 0.8)" }} required maxLength={160} />
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-white">Your Email</label>
            <input id="email" type="email" name="email" autoComplete="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-white/30 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" required maxLength={320} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs text-white">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" placeholder="At least 8 characters" value={formData.password} onChange={handleInputChange} className="w-full rounded-lg border border-white/30 bg-white/5 px-5 py-3 pr-11 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" required minLength={8} maxLength={128} />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <p className="pt-1 text-xs leading-relaxed text-white">Creating an account means you agree to our <Link href="/terms" className="underline hover:text-white/80">terms and conditions</Link>.</p>
          {errorMessage && <p role="alert" className="rounded-lg border border-red-300 bg-red-500/20 p-3 text-center text-xs font-semibold text-white">{errorMessage}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-full bg-white py-3 text-base font-bold transition-all hover:shadow-lg disabled:opacity-50" style={{ color: "#0000FF" }}>Create account</button>
        </form>
        <p className="mt-4 text-center text-sm text-white">Already have an account? <Link href="/login" className="underline hover:text-white/80">Sign in</Link></p>
      </section>
    </main>
  )
}
