type UserProfile = {
  id?: string | number
  email?: string
  bluepayPin?: string
  [key: string]: unknown
}

function getCurrentProfile(): UserProfile | null {
  try {
    const profile = JSON.parse(localStorage.getItem("userData") || "null") as UserProfile | null
    return profile && typeof profile === "object" ? profile : null
  } catch {
    return null
  }
}

function canSafelyMigrateLegacyPin(): boolean {
  try {
    const profile = getCurrentProfile()
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]") as UserProfile[]
    return Boolean(
      profile?.email &&
      Array.isArray(registeredUsers) &&
      registeredUsers.length === 1 &&
      registeredUsers[0]?.email?.toLowerCase() === profile.email.trim().toLowerCase(),
    )
  } catch {
    return false
  }
}

export function getCurrentUserPin(): string | null {
  const profile = getCurrentProfile()
  if (!profile || (!(typeof profile.id === "string" || typeof profile.id === "number") && !profile.email)) return null
  if (/^\d{4}$/.test(profile.bluepayPin || "")) return profile.bluepayPin as string

  // Migrate the legacy global PIN only when the local account list proves its owner is unambiguous.
  const legacyPin = localStorage.getItem("userPin")
  if (!/^\d{4}$/.test(legacyPin || "") || !canSafelyMigrateLegacyPin()) return null
  return saveCurrentUserPin(legacyPin as string) ? legacyPin : null
}

export function hasUnassignedLegacyPin(): boolean {
  const profile = getCurrentProfile()
  return Boolean(
    profile &&
    /^\d{4}$/.test(localStorage.getItem("userPin") || "") &&
    !/^\d{4}$/.test(profile.bluepayPin || "") &&
    !canSafelyMigrateLegacyPin(),
  )
}

export function validateCurrentUserPin(pin: string): boolean {
  return /^\d{4}$/.test(pin) && getCurrentUserPin() === pin
}

export function saveCurrentUserPin(pin: string): boolean {
  const profile = getCurrentProfile()
  if (!profile || (!(typeof profile.id === "string" || typeof profile.id === "number") && !profile.email) || !/^\d{4}$/.test(pin)) return false
  try {
    const updatedProfile = { ...profile, bluepayPin: pin }
    localStorage.setItem("userData", JSON.stringify(updatedProfile))

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    if (Array.isArray(registeredUsers)) {
      const matchesCurrentUser = (user: UserProfile) => {
        if (profile.id && user.id) return String(user.id) === String(profile.id)
        return typeof profile.email === "string" && typeof user.email === "string" && user.email.toLowerCase() === profile.email.toLowerCase()
      }
      const updatedUsers = registeredUsers.map((user: UserProfile) => matchesCurrentUser(user) ? { ...user, bluepayPin: pin } : user)
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
    }

    localStorage.removeItem("userPin")
    window.dispatchEvent(new StorageEvent("storage", { key: "userData", newValue: localStorage.getItem("userData") }))
    return true
  } catch {
    return false
  }
}
