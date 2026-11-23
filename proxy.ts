import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { PIN_VERIFIED_COOKIE, verifyPinProof } from "@/lib/pin-security"

const publicPaths = new Set([
  "/",
  "/about",
  "/features",
  "/faq",
  "/reviews",
  "/testimonies",
  "/privacy",
  "/terms",
  "/support",
  "/login",
  "/get-started",
  "/forgot-password",
  "/forgot-pin",
])

const pinSetupPaths = new Set(["/create-pin", "/verify-pin", "/change-pin", "/security-pin"])

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (publicPaths.has(path)) return NextResponse.next()

  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.redirect(new URL("/login", request.url))
  if (pinSetupPaths.has(path)) return NextResponse.next()

  const proof = request.cookies.get(PIN_VERIFIED_COOKIE)?.value
  if (!verifyPinProof(session.session.token, proof)) {
    return NextResponse.redirect(new URL("/verify-pin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
