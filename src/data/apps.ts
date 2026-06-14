// Non-game apps by the studio. Kept separate from `games` (data/games.ts) on
// purpose: apps don't carry the Firebase / web-profile / per-project auth
// machinery games do. They're marketing cards + their own privacy policy.
export type App = {
    id: string
    nameKey: 'apps.birthdaysBeyond'
    taglineKey: 'apps.taglines.birthdaysBeyond'
    emoji: string
    // Tailwind gradient classes used as placeholder "cover art" until real
    // artwork exists (e.g. 'from-rose-500 to-amber-400').
    gradient: string
    // When the app ships, add storeUrl and the card/detail can switch from the
    // "coming soon" badge to a store link.
    storeUrl?: string
}

export const apps: App[] = [
    {
        id: 'birthdays-beyond',
        nameKey: 'apps.birthdaysBeyond',
        taglineKey: 'apps.taglines.birthdaysBeyond',
        emoji: '🎂',
        gradient: 'from-rose-500 to-amber-400',
    },
]

export function getAppById(id: string | undefined): App | undefined {
    return apps.find((a) => a.id === id)
}
