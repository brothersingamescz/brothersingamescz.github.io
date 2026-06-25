import type { ProductMeta, Shot } from './games'

// Non-game apps by the studio. Kept separate from `games` (data/games.ts) on
// purpose: apps don't carry the Firebase / web-profile / per-project auth
// machinery games do. They're marketing cards + their own privacy policy.
export type App = {
    id: string
    nameKey: 'apps.birthdayReminder'
    taglineKey: 'apps.taglines.birthdayReminder'
    descriptionKey: string
    featureKeys: string[]
    icon?: string
    featureGraphic?: string
    screenshots?: Shot[]
    emoji: string
    // Tailwind gradient classes used as cover/backdrop and ambient accent glow.
    gradient: string
    // Per-product accent colour (hex) - sets `--pa` on the detail page.
    accent: string
    // Static privacy-policy route for this app (apps get a dedicated page).
    privacyPath: string
    storeUrl?: string
    // Play Store facts for the spec strip.
    meta?: ProductMeta
}

export const apps: App[] = [
    {
        id: 'birthday-reminder',
        nameKey: 'apps.birthdayReminder',
        taglineKey: 'apps.taglines.birthdayReminder',
        descriptionKey: 'apps.descriptions.birthdayReminder',
        featureKeys: [
            'apps.features.birthdayReminder.events',
            'apps.features.birthdayReminder.countdowns',
            'apps.features.birthdayReminder.offline',
            'apps.features.birthdayReminder.backup',
        ],
        icon: '/images/birthdaysnamedays/icon.png',
        featureGraphic: '/images/birthdaysnamedays/feature-graphic.png',
        screenshots: [
            {
                src: '/images/birthdaysnamedays/01-upcoming.png',
                captionKey: 'gallery.birthday.upcoming',
            },
            {
                src: '/images/birthdaysnamedays/02-record.png',
                captionKey: 'gallery.birthday.record',
            },
            {
                src: '/images/birthdaysnamedays/03-calendar.png',
                captionKey: 'gallery.birthday.calendar',
            },
            { src: '/images/birthdaysnamedays/04-stats.png', captionKey: 'gallery.birthday.stats' },
            {
                src: '/images/birthdaysnamedays/05-settings.png',
                captionKey: 'gallery.birthday.settings',
            },
        ],
        emoji: '🎂',
        gradient: 'from-violet-600 to-pink-500',
        accent: '#a855f7',
        privacyPath: '/privacy/birthday-reminder',
        storeUrl:
            'https://play.google.com/store/apps/details?id=com.brothersingames.birthdaynamedayreminder',
        meta: {
            version: '1.0.0',
            updated: '2026-06-25',
            androidMin: '7.0',
            rating: 'PEGI 3',
            size: '64 MB',
            iap: true,
        },
    },
]

export function getAppById(id: string | undefined): App | undefined {
    return apps.find((a) => a.id === id)
}
