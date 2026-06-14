import { getFirestore, type Firestore } from 'firebase/firestore'
import { app as primaryApp } from './firebase'
import { appFor } from './firebaseProjects'
import type { FirebaseProjectKey } from '../data/games'

// Firestore for a game's Firebase project: primary-project games (no key) use the
// default app; secondary-project games use a lazily-initialized named app.
//
// Kept separate from ./firebase so the heavy `firebase/firestore` module only
// gets pulled into the lazy game-detail chunk (via usePlayerData), not the main
// bundle that the global auth header loads on every page. `getFirestore` caches
// per app, so calling this repeatedly returns the same instance.
export function dbFor(projectKey?: FirebaseProjectKey): Firestore {
    return getFirestore(projectKey ? appFor(projectKey) : primaryApp)
}
