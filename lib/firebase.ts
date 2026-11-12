import { getApps, initializeApp } from "firebase/app"
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from "firebase/auth"

let auth: Auth | undefined
let persistencePromise: Promise<void> | undefined

function getFirebaseAuth() {
  if (typeof window === "undefined") throw new Error("Firebase Authentication is browser-only")
  if (!auth) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    const defaultApp = getApps().find((app) => app.name === "[DEFAULT]")
    const app = defaultApp ?? initializeApp(firebaseConfig)
    if (defaultApp && firebaseConfig.projectId && defaultApp.options.projectId !== firebaseConfig.projectId) {
      throw new Error("The default Firebase app does not match the configured BLUEPAY MOBILE project")
    }
    auth = getAuth(app)
  }
  persistencePromise ??= setPersistence(auth, browserLocalPersistence)
  return auth
}

async function getReadyFirebaseAuth() {
  const firebaseAuth = getFirebaseAuth()
  await persistencePromise
  return firebaseAuth
}

export async function signInWithGoogle() {
  const firebaseAuth = await getReadyFirebaseAuth()
  return signInWithPopup(firebaseAuth, new GoogleAuthProvider())
}

export async function signInWithEmail(email: string, password: string) {
  const firebaseAuth = await getReadyFirebaseAuth()
  return signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const firebaseAuth = await getReadyFirebaseAuth()
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
  await updateProfile(credential.user, { displayName: name.trim() })
  return credential
}

export type BluePayProfile = Record<string, unknown> & {
  fullName: string
  email: string
  photoURL: string
  uid: string
  registeredAt: string
}

export function getOrCreateBluePayProfile(user: User, defaults: Record<string, unknown> = {}): BluePayProfile {
  let saved: Record<string, unknown> = {}
  try {
    const parsed = JSON.parse(localStorage.getItem("userData") || "null")
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) saved = parsed
  } catch {
    saved = {}
  }

  const sameUser = saved.uid === user.uid || (
    typeof saved.uid !== "string" &&
    Boolean(user.email) &&
    typeof saved.email === "string" &&
    saved.email.toLowerCase() === user.email?.toLowerCase()
  )
  const existing = sameUser ? saved : {}
  const email = user.email || (typeof existing.email === "string" ? existing.email : "")
  const fullName = user.displayName?.trim() ||
    (typeof defaults.fullName === "string" ? defaults.fullName.trim() : "") ||
    (typeof existing.fullName === "string" ? existing.fullName : "") ||
    email.split("@")[0] || "Account holder"
  const profile = {
    ...existing,
    ...defaults,
    fullName,
    email,
    photoURL: user.photoURL || (typeof existing.photoURL === "string" ? existing.photoURL : ""),
    uid: user.uid,
    registeredAt: (typeof existing.registeredAt === "string" && existing.registeredAt) ||
      (typeof defaults.registeredAt === "string" && defaults.registeredAt) ||
      new Date().toISOString(),
  } as BluePayProfile

  localStorage.setItem("userData", JSON.stringify(profile))
  return profile
}

export async function requestPasswordReset(email: string) {
  const firebaseAuth = await getReadyFirebaseAuth()
  return sendPasswordResetEmail(firebaseAuth, email.trim())
}

let googleRedirectResultPromise: ReturnType<typeof getRedirectResult> | undefined

export function completeGoogleRedirect() {
  googleRedirectResultPromise ??= getReadyFirebaseAuth().then((firebaseAuth) => getRedirectResult(firebaseAuth))
  return googleRedirectResultPromise
}

export async function resolveInitialFirebaseUser() {
  const firebaseAuth = await getReadyFirebaseAuth()
  const authStatePromise = new Promise<User | null>((resolve, reject) => {
    let unsubscribe = () => {}
    unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe()
      resolve(user)
    }, (error) => {
      unsubscribe()
      reject(error)
    })
  })
  const [redirectResult, initialUser] = await Promise.all([
    completeGoogleRedirect().catch((error: unknown) => {
      if (error && typeof error === "object" && "code" in error && error.code === "auth/no-auth-event") return null
      throw error
    }),
    authStatePromise,
  ])
  return {
    user: redirectResult?.user ?? firebaseAuth.currentUser ?? initialUser,
    isNewUser: redirectResult ? getAdditionalUserInfo(redirectResult)?.isNewUser === true : false,
  }
}

export function monitorAuthState(
  callback: (user: User | null) => void,
  onError?: (error: Error) => void,
) {
  let active = true
  let unsubscribe = () => {}

  void getReadyFirebaseAuth().then((firebaseAuth) => {
    if (active) unsubscribe = onAuthStateChanged(firebaseAuth, callback, onError)
  }).catch((error: unknown) => {
    if (!active) return
    const authError = error instanceof Error ? error : new Error(String(error))
    if (onError) onError(authError)
    else console.error("[v0] Firebase auth initialization failed", authError)
  })

  return () => {
    active = false
    unsubscribe()
  }
}

export async function signOut() {
  const firebaseAuth = await getReadyFirebaseAuth()
  return firebaseSignOut(firebaseAuth)
}
