import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import type { FirebaseProjectKey } from '../data/games'

// Web config for games whose Unity build writes to a *different* Firebase project
// than the primary one (see ./firebase). Like the primary config these are NOT
// secrets — the Firebase web config is public by design (see .env.example).
//
// Apps are initialized lazily as named instances (one per project). Because this
// module is only imported from the lazy game-detail route (via useGameAuth /
// firestore), the secondary project never loads on the main bundle.
const CONFIGS: Record<FirebaseProjectKey, Record<string, string | undefined>> = {
    jumpingJello: {
        apiKey: import.meta.env.VITE_FB_JUMPING_JELLO_API_KEY,
        authDomain: import.meta.env.VITE_FB_JUMPING_JELLO_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FB_JUMPING_JELLO_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FB_JUMPING_JELLO_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FB_JUMPING_JELLO_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FB_JUMPING_JELLO_APP_ID,
    },
}

// Returns the named Firebase app for a secondary project, creating it once.
export function appFor(key: FirebaseProjectKey): FirebaseApp {
    return getApps().find((a) => a.name === key) ?? initializeApp(CONFIGS[key], key)
}

export function authFor(key: FirebaseProjectKey): Auth {
    return getAuth(appFor(key))
}
