import { getFirestore } from 'firebase/firestore'
import { app } from './firebase'

// Kept separate from ./firebase so the heavy `firebase/firestore` module only
// gets pulled into the lazy game-detail chunk (via usePlayerData), not the main
// bundle that the global auth header loads on every page.
export const db = getFirestore(app)
