// Games whose Unity build writes to a *different* Firebase project than the
// site's primary one (Def the Base, see lib/firebase.ts). Configured + lazily
// initialized in lib/firebaseProjects.ts. Auth (and the player UID) is per
// project, so these games sign in against their own project on their detail page.
export type FirebaseProjectKey = 'jumpingJello'

export type Game = {
  id: string
  nameKey: 'games.defTheBase' | 'games.jumpingJello'
  taglineKey: 'games.taglines.defTheBase' | 'games.taglines.jumpingJello'
  emoji: string
  // Tailwind gradient classes used as placeholder "cover art" until real
  // artwork exists (e.g. 'from-indigo-600 to-fuchsia-600').
  gradient: string
  storeUrl?: string
  // Web progress support. The Unity game writes the Firestore document at
  // `{firestoreCollection}/{uid}`; this site reads it. Only games with
  // `hasWebProfile` show progress on the dashboard.
  hasWebProfile?: boolean
  firestoreCollection?: string
  // Set when the game's save lives in a secondary Firebase project. Omitted =
  // primary project (Def the Base).
  firebaseProject?: FirebaseProjectKey
}

export const games: Game[] = [
  {
    id: 'def-the-base',
    nameKey: 'games.defTheBase',
    taglineKey: 'games.taglines.defTheBase',
    emoji: '🎮',
    gradient: 'from-indigo-600 to-fuchsia-600',
    hasWebProfile: true,
    firestoreCollection: 'def_the_base',
  },
  {
    id: 'jumping-jello',
    nameKey: 'games.jumpingJello',
    taglineKey: 'games.taglines.jumpingJello',
    emoji: '🍮',
    gradient: 'from-amber-400 to-pink-500',
    hasWebProfile: true,
    firestoreCollection: 'jumping_jello',
    firebaseProject: 'jumpingJello',
  },
]

export function getGameById(id: string | undefined): Game | undefined {
  return games.find((g) => g.id === id)
}

// When a game ships, add storeUrl and the card switches from badge to link:
// { id: 'def-the-base', ..., storeUrl: 'https://play.google.com/store/apps/details?id=...' }
