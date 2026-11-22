export type UserBankDetails = {
  bankName: string
  accountNumber: string
  accountName: string
}

type UserProfile = Record<string, unknown> & {
  bankDetails?: UserBankDetails
}

export function getCurrentUserProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("userData")
    if (!stored) return null
    const profile = JSON.parse(stored) as UserProfile
    return profile && typeof profile === "object" ? profile : null
  } catch {
    return null
  }
}

export function getCurrentUserBankDetails(): UserBankDetails | null {
  const details = getCurrentUserProfile()?.bankDetails
  if (!details || typeof details !== "object") return null
  return {
    bankName: typeof details.bankName === "string" ? details.bankName : "",
    accountNumber: typeof details.accountNumber === "string" ? details.accountNumber : "",
    accountName: typeof details.accountName === "string" ? details.accountName : "",
  }
}

export function saveCurrentUserBankDetails(details: UserBankDetails): boolean {
  const profile = getCurrentUserProfile()
  if (!profile) return false
  try {
    localStorage.setItem("userData", JSON.stringify({ ...profile, bankDetails: details }))
    window.dispatchEvent(new StorageEvent("storage", { key: "userData", newValue: localStorage.getItem("userData") }))
    return true
  } catch {
    return false
  }
}
