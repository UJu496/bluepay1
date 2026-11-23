import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pinCredentials } from "@/lib/db/schema"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const [credential] = await db
    .select({ userId: pinCredentials.userId })
    .from(pinCredentials)
    .where(eq(pinCredentials.userId, session.user.id))
    .limit(1)

  return NextResponse.json({ hasPin: Boolean(credential) }, { headers: { "Cache-Control": "no-store" } })
}
