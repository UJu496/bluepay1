import { NextResponse } from "next/server"

export async function GET() {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: "Bank directory is not configured. Set PAYSTACK_SECRET_KEY on the server." }, { status: 503 })
  }

  const response = await fetch("https://api.paystack.co/bank?country=nigeria&perPage=100", {
    headers: { Authorization: `Bearer ${secret}` },
    next: { revalidate: 3600 },
  })
  const payload = await response.json()
  if (!response.ok || !payload.status) {
    return NextResponse.json({ error: "The bank directory provider is unavailable." }, { status: 502 })
  }

  const banks = payload.data.map((bank: { id: number; name: string; code: string; logo?: string }) => ({
    id: String(bank.id),
    name: bank.name,
    code: bank.code,
    logo: bank.logo ?? null,
  }))
  return NextResponse.json({ banks })
}
