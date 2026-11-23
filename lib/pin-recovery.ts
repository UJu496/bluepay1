import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { pinRecoveryAttempts } from "@/lib/db/schema"
import { getRequestIp, hashSecurityToken } from "@/lib/pin-security"

const ATTEMPT_WINDOW = sql`interval '15 minutes'`

export async function consumeRateLimit(key: string, limit: number) {
  const [result] = await db
    .insert(pinRecoveryAttempts)
    .values({ bucketKey: hashSecurityToken(key), attempts: 1, windowStartedAt: new Date() })
    .onConflictDoUpdate({
      target: pinRecoveryAttempts.bucketKey,
      set: {
        attempts: sql`CASE WHEN ${pinRecoveryAttempts.windowStartedAt} < now() - ${ATTEMPT_WINDOW} THEN 1 ELSE ${pinRecoveryAttempts.attempts} + 1 END`,
        windowStartedAt: sql`CASE WHEN ${pinRecoveryAttempts.windowStartedAt} < now() - ${ATTEMPT_WINDOW} THEN now() ELSE ${pinRecoveryAttempts.windowStartedAt} END`,
      },
    })
    .returning({ attempts: pinRecoveryAttempts.attempts })

  return (result?.attempts ?? limit + 1) <= limit
}

export async function canAttemptRecovery(email: string, request: Request) {
  const ip = getRequestIp(request)
  const limits = await Promise.all([
    consumeRateLimit(`recovery-ip:${ip}`, 20),
    consumeRateLimit(`recovery-email:${email}`, 5),
    consumeRateLimit(`recovery-pair:${ip}:${email}`, 5),
  ])
  return limits.every(Boolean)
}

export async function canAttemptPinReset(userId: string, request: Request) {
  const ip = getRequestIp(request)
  const limits = await Promise.all([
    consumeRateLimit(`pin-reset-user:${userId}`, 8),
    consumeRateLimit(`pin-reset-ip:${ip}`, 30),
  ])
  return limits.every(Boolean)
}
