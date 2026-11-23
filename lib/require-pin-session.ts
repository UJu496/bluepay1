import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinCredentials } from "@/lib/db/schema"
import { PIN_VERIFIED_COOKIE, verifyPinProof } from "@/lib/pin-security"

export async function requirePinSession() {
  const { data: session } = await auth.getSession()
  if (!session?.user) redirect("/login")

  const [credential] = await db
    .select({ userId: pinCredentials.userId })
    .from(pinCredentials)
    .where(eq(pinCredentials.userId, session.user.id))
    .limit(1)
  if (!credential) redirect("/create-pin")

  const proof = (await cookies()).get(PIN_VERIFIED_COOKIE)?.value
  if (!verifyPinProof(session.session.token, proof)) redirect("/verify-pin")

  return session
}
