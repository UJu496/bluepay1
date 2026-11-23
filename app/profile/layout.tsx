import type { ReactNode } from "react"
import { requirePinSession } from "@/lib/require-pin-session"

export const dynamic = "force-dynamic"

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  await requirePinSession()
  return children
}
