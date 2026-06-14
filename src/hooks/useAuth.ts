import { createContext, useContext } from 'react'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    signOut as fbSignOut,
    type Auth,
    type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export type AuthState = { user: User | null; loading: boolean }

// The provider (components/AuthProvider) owns the single `onAuthStateChanged`
// listener and feeds this context. Auth is consumed in several places (header,
// account page, game detail), so a context avoids duplicate listeners.
export const AuthContext = createContext<AuthState>({ user: null, loading: true })

export function useAuth() {
    return useContext(AuthContext)
}

// Popup is the smooth path on desktop, but mobile browsers and in-app webviews
// often block or don't support it — fall back to a full-page redirect there.
const POPUP_FALLBACK_CODES = new Set([
    'auth/popup-blocked',
    'auth/operation-not-supported-in-this-environment',
    'auth/cancelled-popup-request',
])

// Google sign-in against a specific Firebase project's Auth. Each game on a
// secondary project signs in against its own Auth (see hooks/useGameAuth), so the
// popup/redirect handling lives here and is reused.
export async function googleSignIn(targetAuth: Auth) {
    const provider = new GoogleAuthProvider()
    try {
        await signInWithPopup(targetAuth, provider)
    } catch (err) {
        const code = (err as { code?: string }).code
        if (code && POPUP_FALLBACK_CODES.has(code)) {
            await signInWithRedirect(targetAuth, provider)
            return
        }
        if (code === 'auth/popup-closed-by-user') return // user dismissed, not an error
        throw err
    }
}

// Sign in against the primary project (global header / account page).
export function signInWithGoogle() {
    return googleSignIn(auth)
}

export function signOut() {
    return fbSignOut(auth)
}
