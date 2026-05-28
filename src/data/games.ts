export type Game = {
  id: string
  nameKey: 'games.defTheBase' | 'games.jumpingJello'
  emoji: string
  storeUrl?: string
}

export const games: Game[] = [
  { id: 'def-the-base', nameKey: 'games.defTheBase', emoji: '🎮' },
  { id: 'jumping-jello', nameKey: 'games.jumpingJello', emoji: '🍮' },
]

// When a game ships, add storeUrl and the card switches from badge to link:
// { id: 'def-the-base', nameKey: 'games.defTheBase', emoji: '🎮', storeUrl: 'https://play.google.com/store/apps/details?id=...' }
