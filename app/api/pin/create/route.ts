import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinCredentials } from "@/lib/db/schema"
import { createPinProof, hashPin, isSameOriginRequest, PIN_VERIFIED_COOKIE } from "@/lib/pin-security"

export const runtime = "nodejs"

const createPinSchema = z.object({ pin: z.string().regex(/^\d{4}$/) })

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request" }, { status: 403 })

  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const body = createPinSchema.safeParse(await request.json().catch(() => null))
  if (!body.success) return NextResponse.json({ error: "Enter a valid 4-digit PIN" }, { status: 400 })

  const pinHash = await hashPin(body.data.pin)
  const [created] = await db
    .insert(pinCredentials)
    .values({ userId: session.user.id, pinHash })
    .onConflictDoNothing({ target: pinCredentials.userId })
    .returning({ userId: pinCredentials.userId })

  if (!created) return NextResponse.json({ error: "A PIN is already set for this account" }, { status: 409 })

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
  response.cookies.set(PIN_VERIFIED_COOKIE, createPinProof(session.session.token), {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return response
}
