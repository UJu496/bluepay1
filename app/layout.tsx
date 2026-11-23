import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { FloatingWhatsappLady } from "@/components/floating-whatsapp-lady"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://bluepaymobile2026.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: "BLUEPAY MOBILE | Secure Payments",
  description: "Secure account access, PIN-protected banking, and everyday digital payments with BLUEPAY MOBILE.",
  verification: {
    google: [
      "eR5tw2Q3nzT2G97TOSqYtRxLED76aXC2xnRwI16Iv0M",
      "ZhOslAdkYj7tX-0Bx01Y_Rs4FQAETRZukqNvM4khTx0",
    ],
  },
  openGraph: {
    title: "BLUEPAY MOBILE | Secure Payments",
    description: "Secure account access, PIN-protected banking, and everyday digital payments with BLUEPAY MOBILE.",
    images: [
      {
        url: "/og-image.jpg",
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
    title: "BLUEPAY MOBILE | Secure Payments",
    description: "Secure account access, PIN-protected banking, and everyday digital payments with BLUEPAY MOBILE.",
    images: ["https://www-bluepaymobile2026.vercel.app/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#0000ff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={geistSans.className}>
        {children}
        <FloatingWhatsappLady />
      </body>
    </html>
  )
}
