"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Upload, User, X } from "lucide-react"
import Link from "next/link"

export default function CreatePinPage() {
  const router = useRouter()
  const [pin, setPin] = useState(["", "", "", ""])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  const handleNumberClick = async (number: string) => {
    if (currentIndex >= 4 || isSaving || showSuccess) return
    const nextPin = [...pin]
    nextPin[currentIndex] = number
    setPin(nextPin)
    setCurrentIndex(currentIndex + 1)
    setError("")
    if (currentIndex !== 3) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/pin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: [...pin, number].join("") }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.status === 409) {
        router.replace("/change-pin")
        return
      }
      if (!response.ok) throw new Error(result.error || "Unable to save your PIN. Please try again.")
      setShowSuccess(true)
      window.setTimeout(() => {
        router.replace("/dashboard")
        router.refresh()
      }, 500)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save your PIN. Please try again.")
      setPin(["", "", "", ""])
      setCurrentIndex(0)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackspace = () => {
    if (isSaving || currentIndex === 0) return
    const nextPin = [...pin]
    nextPin[currentIndex - 1] = ""
    setPin(nextPin)
    setCurrentIndex(currentIndex - 1)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const photoData = loadEvent.target?.result
      if (typeof photoData !== "string") return
      setProfilePhoto(photoData)
      localStorage.setItem("userProfilePhoto", photoData)
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="flex min-h-screen flex-col" style={{ backgroundColor: "#0000FF" }}>
      {showSuccess && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div role="status" className="rounded-2xl bg-white p-6 text-center text-sm font-semibold text-[#101a43]">Your PIN is protected. Opening your dashboard...</div></div>}
      <header className="flex items-center justify-between p-4 pt-12">
        <button type="button" aria-label="Go back" onClick={() => router.back()} className="text-white"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-semibold text-white">Create PIN</h1>
        <User size={20} className="text-white" aria-hidden="true" />
      </header>
      <section className="mb-4 px-5">
        <div className="flex justify-center"><div className="relative">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-white/20">{profilePhoto ? <img src={profilePhoto} alt="Selected profile" className="size-full object-cover" /> : <Camera size={20} className="text-white" />}</div>
          <label className="absolute -bottom-2 -right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white hover:bg-gray-100"><span className="sr-only">Upload an optional profile photo</span><Upload size={16} style={{ color: "#0000FF" }} /><input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" /></label>
        </div></div>
        <p className="mt-2 text-center text-sm text-white/70">Upload photo (optional)</p>
      </section>
      <section className="flex flex-1 flex-col justify-center px-5">
        <div className="mb-4 text-center"><h2 className="mb-2 text-xl font-bold text-white">Create your BLUEPAY PIN</h2><p className="text-white/80">Set a 4-digit PIN to protect your account.</p></div>
        <div className="mb-10 flex justify-center gap-4" aria-label={`${currentIndex} of 4 PIN digits entered`}>
          {pin.map((digit, index) => <span key={index} aria-hidden="true" className="flex size-14 items-center justify-center rounded-full border-2 border-white/50">{digit && <span className="size-3.5 rounded-full bg-white" />}</span>)}
        </div>
        {error && <p role="alert" className="mx-auto mb-4 max-w-xs rounded-lg border border-white/30 bg-red-500/20 px-3 py-2 text-center text-sm text-white">{error}</p>}
        <div className="mx-auto grid max-w-xs grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => <button key={number} type="button" disabled={isSaving} aria-label={`Enter ${number}`} onClick={() => void handleNumberClick(String(number))} className="flex size-16 items-center justify-center rounded-full text-xl font-semibold text-white transition hover:bg-white/10 disabled:opacity-50">{number}</button>)}
          <span aria-hidden="true" />
          <button type="button" disabled={isSaving} aria-label="Enter 0" onClick={() => void handleNumberClick("0")} className="flex size-16 items-center justify-center rounded-full text-xl font-semibold text-white transition hover:bg-white/10 disabled:opacity-50">0</button>
          <button type="button" disabled={isSaving} aria-label="Delete last digit" onClick={handleBackspace} className="flex size-16 items-center justify-center rounded-full bg-white transition hover:bg-white/90 disabled:opacity-50"><X size={20} style={{ color: "#0000FF" }} /></button>
        </div>
        <p className="mb-3 mt-5 text-center text-sm text-white/90">Your PIN is encrypted and stored securely.</p>
        <Link href="/forgot-pin" className="mx-auto mt-2 rounded-md px-3 py-2 text-center text-sm font-bold text-white underline underline-offset-4">FORGOT PIN?</Link>
      </section>
    </main>
  )
}
