"use client"

import { createAuthClient } from "@neon/auth/next"

export const authClient = createAuthClient()

export async function signOutAndClearPinProof() {
  await authClient.signOut()
  await fetch("/api/pin/clear", { method: "POST", credentials: "same-origin" })
}
