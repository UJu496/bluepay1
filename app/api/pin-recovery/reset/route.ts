import { and, eq, gt, isNull } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { pinCredentials, pinRecoveryGrants } from "@/lib/db/schema"
import { canAttemptPinReset } from "@/lib/pin-recovery"
import { hashPin, hashSecurityToken, isSameOriginRequest, PIN_VERIFIED_COOKIE } from "@/lib/pin-security"

export const runtime = "nodejs"

const resetPinSchema = z.object({
  recoveryToken: z.string().min(32).max(128),
  pin: z.string().regex(/^\d{4}$/),
  confirmPin: z.string().regex(/^\d{4}$/),
})

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request" }, { status: 403 })

  const parsed = resetPinSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || parsed.data.pin !== parsed.data.confirmPin) {
    return NextResponse.json({ error: "Enter matching 4-digit PINs" }, { status: 400 })
  }

  const tokenHash = hashSecurityToken(`pin-recovery:${parsed.data.recoveryToken}`)
  const [grantOwner] = await db
    .select({ userId: pinRecoveryGrants.userId })
    .from(pinRecoveryGrants)
    .where(and(
      eq(pinRecoveryGrants.tokenHash, tokenHash),
      isNull(pinRecoveryGrants.consumedAt),
      gt(pinRecoveryGrants.expiresAt, new Date()),
    ))
    .limit(1)

  if (!grantOwner) return NextResponse.json({ error: "Recovery session expired. Verify your account again." }, { status: 400 })

  if (!(await canAttemptPinReset(grantOwner.userId, request))) {
    return NextResponse.json({ error: "Too many attempts. Please wait and try again." }, { status: 429 })
  }

  const newPinHash = await hashPin(parsed.data.pin)
  const updated = await db.transaction(async (transaction) => {
    const [grant] = await transaction
      .select()
      .from(pinRecoveryGrants)
      .where(and(
        eq(pinRecoveryGrants.tokenHash, tokenHash),
        eq(pinRecoveryGrants.userId, grantOwner.userId),
        isNull(pinRecoveryGrants.consumedAt),
        gt(pinRecoveryGrants.expiresAt, new Date()),
      ))
      .for("update")
      .limit(1)

    if (!grant) return false

    await transaction
      .update(pinRecoveryGrants)
      .set({ consumedAt: new Date() })
      .where(eq(pinRecoveryGrants.tokenHash, tokenHash))

    await transaction
      .insert(pinCredentials)
      .values({ userId: grant.userId, pinHash: newPinHash, failedAttempts: 0, lockedUntil: null })
      .onConflictDoUpdate({
        target: pinCredentials.userId,
        set: { pinHash: newPinHash, failedAttempts: 0, lockedUntil: null, updatedAt: new Date() },
      })

    await transaction.delete(pinRecoveryGrants).where(eq(pinRecoveryGrants.userId, grant.userId))

    return true
  })

  if (!updated) return NextResponse.json({ error: "Recovery session expired. Verify your account again." }, { status: 400 })

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
  response.cookies.set(PIN_VERIFIED_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
