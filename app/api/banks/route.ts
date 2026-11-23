import { NextResponse } from "next/server"
import { localBanks } from "@/lib/banks"

export async function GET() {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ banks: localBanks, source: "local" })
  }

  let response: Response
  let payload: { status?: boolean; data?: Array<{ id: number; name: string; code: string; logo?: string }> }
  try {
    response = await fetch("https://api.paystack.co/bank?country=nigeria&perPage=100", {
      headers: { Authorization: `Bearer ${secret}` },
      next: { revalidate: 3600 },
    })
    payload = await response.json()
  } catch {
    return NextResponse.json({ banks: localBanks, source: "local" })
  }
  if (!response.ok || !payload.status) {
    return NextResponse.json({ banks: localBanks, source: "local" })
  }

  const banks = payload.data.map((bank: { id: number; name: string; code: string; logo?: string }) => ({
    id: String(bank.id),
    name: bank.name,
    code: bank.code,
    logo: bank.logo ?? null,
  }))
  return NextResponse.json({ banks })
}
