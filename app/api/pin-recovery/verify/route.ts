import { randomBytes } from "node:crypto"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinRecoveryGrants, user } from "@/lib/db/schema"
import { canAttemptRecovery } from "@/lib/pin-recovery"
import { hashSecurityToken, isSameOriginRequest, normalizeFullName } from "@/lib/pin-security"

export const runtime = "nodejs"

const verifyRecoverySchema = z.object({
  fullName: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
})

const genericFailure = () => NextResponse.json(
  { error: "We couldn't verify those details. Check them and try again." },
  { status: 400, headers: { "Cache-Control": "no-store" } },
)

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request" }, { status: 403 })

  const parsed = verifyRecoverySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return genericFailure()

  const email = parsed.data.email.toLowerCase()
  if (!(await canAttemptRecovery(email, request))) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 15 minutes and try again." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    )
  }

  const [account] = await db
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!account || normalizeFullName(account.name) !== normalizeFullName(parsed.data.fullName)) return genericFailure()

  try {
    const signInResult = await auth.api.signInEmail({
      body: { email: account.email, password: parsed.data.password },
      headers: request.headers,
      returnHeaders: true,
    })
    const recoveryToken = randomBytes(32).toString("base64url")
    await db.insert(pinRecoveryGrants).values({
      tokenHash: hashSecurityToken(`pin-recovery:${recoveryToken}`),
      userId: account.id,
      expiresAt: new Date(Date.now() + 10 * 60_000),
    })

    const response = NextResponse.json(
      { recoveryToken },
      { headers: { "Cache-Control": "no-store" } },
    )
    for (const cookie of signInResult.headers.getSetCookie()) response.headers.append("set-cookie", cookie)
    return response
  } catch {
    return genericFailure()
  }
}
