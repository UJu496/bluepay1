import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithPopup, signOut as firebaseSignOut, type Auth, type User } from "firebase/auth"

let auth: Auth | undefined
let persistenceConfigured = false

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
  if (!persistenceConfigured) {
    persistenceConfigured = true
    void setPersistence(auth, browserLocalPersistence)
  }
  return auth
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(getFirebaseAuth(), provider)
}

export function monitorAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export function signOut() {
  return firebaseSignOut(getFirebaseAuth())
}
