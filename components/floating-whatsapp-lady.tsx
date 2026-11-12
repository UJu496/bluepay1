"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

const TELEGRAM_GROUP_URL = "https://t.me/bluepay2"
const WITHDRAWAL_ROUTES = new Set(["/withdraw", "/withdrawal-confirmation", "/withdrawal-success"])

export function FloatingWhatsappLady() {
  const pathname = usePathname()
  if (WITHDRAWAL_ROUTES.has(pathname)) {
    return (
      <a href={TELEGRAM_GROUP_URL} target="_blank" rel="noopener noreferrer" className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-4 text-xs text-slate-600">
        <span className="relative block size-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-blue-100">
          <Image src="/support-lady.png" alt="" fill sizes="32px" className="object-cover object-top" />
        </span>
        <span className="font-semibold text-[#0000ff]">Join the BluePay Telegram group</span>
      </a>
    )
  }

  return (
    <a
      href={TELEGRAM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join the BluePay Telegram group"
      className="group fixed bottom-4 right-4 z-50 flex items-end gap-2 sm:bottom-6 sm:right-6"
    >
      <span className="mb-2 hidden rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg transition-transform group-hover:-translate-y-1 sm:block">
        Join our Telegram group
      </span>
      <span className="relative block h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-xl transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
        <Image
          src="/support-lady.png"
          alt="Friendly BluePay support lady"
          fill
          sizes="80px"
          className="object-cover object-top"
        />
      </span>
    </a>
  )
}
