import type { ReactNode } from "react"
import { requirePinSession } from "@/lib/require-pin-session"

export default async function BankDetailsLayout({ children }: { children: ReactNode }) {
  await requirePinSession()
  return children
}
