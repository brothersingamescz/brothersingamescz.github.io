import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut as fbSignOut, type User } from 'firebase/auth'
import { useAuth, googleSignIn, signInWithGoogle, signOut as primarySignOut } from './useAuth'
import { authFor } from '../lib/firebaseProjects'
import type { FirebaseProjectKey } from '../data/games'

export type GameAuthStatus = 'loading' | 'needs-signin' | 'ready'

export type GameAuth = {
    user: User | null
    uid?: string
    status: GameAuthStatus
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

// Auth for a single game's Firebase project.
//
// Primary-project games (no `projectKey`) reuse the global AuthProvider listener
// via useAuth(). Games on a secondary project get their own listener + sign-in,
// because Firebase Auth - and therefore the player's UID - is per project: the
// global session's token can't read (or satisfy the rules of) another project's
// Firestore. Each game signs in/out against its own project on its detail page.
export function useGameAuth(projectKey?: FirebaseProjectKey): GameAuth {
    const { user, loading } = useAuth()
    const [secUser, setSecUser] = useState<User | null | undefined>(undefined)

    useEffect(() => {
        if (!projectKey) return
        return onAuthStateChanged(authFor(projectKey), setSecUser)
    }, [projectKey])

    if (!projectKey) {
        return {
            user,
            uid: user?.uid,
            status: loading ? 'loading' : user ? 'ready' : 'needs-signin',
            signIn: signInWithGoogle,
            signOut: primarySignOut,
        }
    }

    const u = secUser ?? null
    return {
        user: u,
        uid: u?.uid,
        status: secUser === undefined ? 'loading' : u ? 'ready' : 'needs-signin',
        signIn: () => googleSignIn(authFor(projectKey)),
        signOut: () => fbSignOut(authFor(projectKey)),
    }
}
