import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Config values come from Vite env vars (see .env.example).
// These are NOT secrets — the Firebase web config is public by design and ships
// in the browser bundle. Data security is enforced by Firebase Auth + Firestore
// Security Rules, not by hiding these values. We keep them in env vars only to
// avoid hardcoding project identifiers in source.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
}

// Only Auth is initialized here — it ships globally because the header shows
// sign-in state on every page. Firestore lives in ./firestore so the heavy
// `firebase/firestore` chunk only loads on the (lazy) game-detail route.
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
