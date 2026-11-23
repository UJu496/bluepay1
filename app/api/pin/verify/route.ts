import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinCredentials } from "@/lib/db/schema"
import { createPinProof, isSameOriginRequest, PIN_VERIFIED_COOKIE, verifyPin } from "@/lib/pin-security"

export const runtime = "nodejs"

const verifyPinSchema = z.object({ pin: z.string().regex(/^\d{4}$/) })
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request" }, { status: 403 })

  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const body = verifyPinSchema.safeParse(await request.json().catch(() => null))
  if (!body.success) return NextResponse.json({ error: "Enter a valid 4-digit PIN" }, { status: 400 })

  const result = await db.transaction(async (transaction) => {
    const [credential] = await transaction
      .select()
      .from(pinCredentials)
      .where(eq(pinCredentials.userId, session.user.id))
      .for("update")
      .limit(1)

    if (!credential) return "missing" as const
    if (credential.lockedUntil && credential.lockedUntil.getTime() > Date.now()) return "locked" as const

    const matches = await verifyPin(body.data.pin, credential.pinHash)
    if (!matches) {
      const failedAttempts = credential.failedAttempts + 1
      await transaction
        .update(pinCredentials)
        .set({
          failedAttempts,
          lockedUntil: failedAttempts >= MAX_FAILED_ATTEMPTS
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
            : null,
          updatedAt: new Date(),
        })
        .where(eq(pinCredentials.userId, session.user.id))
      return failedAttempts >= MAX_FAILED_ATTEMPTS ? "locked" as const : "invalid" as const
    }

    await transaction
      .update(pinCredentials)
      .set({ failedAttempts: 0, lockedUntil: null, updatedAt: new Date() })
      .where(eq(pinCredentials.userId, session.user.id))
    return "valid" as const
  })

  if (result === "missing") return NextResponse.json({ error: "Create a PIN to continue" }, { status: 409 })
  if (result === "locked") return NextResponse.json({ error: "Too many incorrect attempts. Try again in 15 minutes." }, { status: 429 })
  if (result === "invalid") return NextResponse.json({ error: "Incorrect PIN. Please try again." }, { status: 401 })

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
