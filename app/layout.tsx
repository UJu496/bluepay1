import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BLUEPAY MOBILE",
  description: "Fast, Secure & Reliable Digital Financial Platform.",
  openGraph: {
    title: "BLUEPAY MOBILE",
    description: "Fast, Secure & Reliable Digital Financial Platform.",
    images: [
      {
        url: "https://www-bluepaymobile2026.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BLUEPAY MOBILE",
      },
    ],
    type: "website",
    url: "https://www-bluepaymobile2026.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "BLUEPAY MOBILE",
    description: "Fast, Secure & Reliable Digital Financial Platform.",
    images: ["https://www-bluepaymobile2026.vercel.app/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={geistSans.className}>{children}</body>
    </html>
  )
}
