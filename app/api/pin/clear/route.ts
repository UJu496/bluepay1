import { NextResponse } from "next/server"
import { isSameOriginRequest, PIN_VERIFIED_COOKIE } from "@/lib/pin-security"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request" }, { status: 403 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(PIN_VERIFIED_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
