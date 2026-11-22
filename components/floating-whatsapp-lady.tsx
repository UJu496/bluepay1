"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

const TELEGRAM_GROUP_URL = "https://t.me/bluepay2"

export function FloatingWhatsappLady() {
  const pathname = usePathname()
  if (pathname === "/transactions" || pathname.startsWith("/transactions/")) return null

  return (
    <a
      href={TELEGRAM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join the BluePay Telegram group"
      className={`group fixed z-50 flex items-end gap-2 ${pathname === "/withdraw" ? "bottom-2 right-2" : "bottom-4 right-4 sm:bottom-6 sm:right-6"}`}
    >
      <span className="mb-2 hidden rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg transition-transform group-hover:-translate-y-1 sm:block">
        Join our Telegram group
      </span>
      <span className={`relative block overflow-hidden rounded-full border-2 border-white bg-blue-100 shadow-lg transition-transform group-hover:scale-105 ${pathname === "/withdraw" ? "size-9" : "size-16 border-4 sm:size-20"}`}>
        <Image
          src="/support-lady.png"
          alt="Friendly BluePay support lady"
          fill
          sizes={pathname === "/withdraw" ? "36px" : "80px"}
          className="object-cover object-top"
        />
      </span>
    </a>
  )
}
