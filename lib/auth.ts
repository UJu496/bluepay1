import { createNeonAuth } from "@neon/auth/next/server"

const baseUrl = process.env.NEON_AUTH_BASE_URL
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET ?? process.env.BETTER_AUTH_SECRET

if (!baseUrl) throw new Error("NEON_AUTH_BASE_URL is required for authentication")
if (!cookieSecret || cookieSecret.length < 32) {
  throw new Error("NEON_AUTH_COOKIE_SECRET or a 32-character BETTER_AUTH_SECRET is required for authentication")
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: { secret: cookieSecret, sessionDataTtl: 300 },
})
