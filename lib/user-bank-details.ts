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
    const updatedProfile = { ...profile, bankDetails: details }
    localStorage.setItem("userData", JSON.stringify(updatedProfile))

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    if (Array.isArray(registeredUsers)) {
      const matchesCurrentUser = (user: Record<string, unknown>) => {
        if (profile.id && user.id) return String(user.id) === String(profile.id)
        return typeof profile.email === "string" && typeof user.email === "string" && user.email.toLowerCase() === profile.email.toLowerCase()
      }
      const updatedUsers = registeredUsers.map((user: Record<string, unknown>) => matchesCurrentUser(user) ? { ...user, bankDetails: details } : user)
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
    }

    window.dispatchEvent(new StorageEvent("storage", { key: "userData", newValue: localStorage.getItem("userData") }))
    return true
  } catch {
    return false
  }
}
