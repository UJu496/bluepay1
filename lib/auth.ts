import { betterAuth } from "better-auth"
import { pool } from "@/lib/db"

const secret = process.env.BETTER_AUTH_SECRET
if (!secret) throw new Error("BETTER_AUTH_SECRET is required for authentication")

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.V0_RUNTIME_URL ?? "http://localhost:3000")

const trustedOrigins = [
  ...(process.env.NODE_ENV === "development"
    ? [
        "http://localhost:3000",
        process.env.V0_RUNTIME_URL,
        process.env.V0_DEV_APP_URL,
        process.env.V0_BUILD_URL,
        process.env.V0_SANDBOX_URL,
      ].filter((origin): origin is string => Boolean(origin))
    : []),
  ...(process.env.NODE_ENV === "production"
    ? [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
        process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : undefined,
      ].filter((origin): origin is string => Boolean(origin))
    : []),
]

export const auth = betterAuth({
  database: pool,
  secret,
  baseURL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
