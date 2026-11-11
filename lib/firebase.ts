import { getApp, getApps, initializeApp } from "firebase/app"
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
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
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
  }
  persistencePromise ??= setPersistence(auth, browserLocalPersistence)
  return auth
}

export async function signInWithGoogle() {
  const firebaseAuth = getFirebaseAuth()
  await (persistencePromise ?? setPersistence(firebaseAuth, browserLocalPersistence))
  const provider = new GoogleAuthProvider()
  const isMobileBrowser = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches
  if (isMobileBrowser) {
    await signInWithRedirect(firebaseAuth, provider)
    return null
  }

  try {
    return await signInWithPopup(firebaseAuth, provider)
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : ""
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(firebaseAuth, provider)
      return null
    }
    throw error
  }
}

export async function signInWithEmail(email: string, password: string) {
  const firebaseAuth = getFirebaseAuth()
  await (persistencePromise ?? setPersistence(firebaseAuth, browserLocalPersistence))
  return signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const firebaseAuth = getFirebaseAuth()
  await (persistencePromise ?? setPersistence(firebaseAuth, browserLocalPersistence))
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
  await updateProfile(credential.user, { displayName: name.trim() })
  return credential
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(getFirebaseAuth(), email.trim())
}

export function completeGoogleRedirect() {
  return getRedirectResult(getFirebaseAuth())
}

export function monitorAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export function signOut() {
  return firebaseSignOut(getFirebaseAuth())
}
