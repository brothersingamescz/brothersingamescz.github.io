// Games whose Unity build writes to a *different* Firebase project than the
// site's primary one (Def the Base, see lib/firebase.ts). Configured + lazily
// initialized in lib/firebaseProjects.ts. Auth (and the player UID) is per
// project, so these games sign in against their own project on their detail page.
export type FirebaseProjectKey = 'jumpingJello'

// A captioned screenshot for a product's gallery. `captionKey` is an i18n key.
export type Shot = { src: string; captionKey: string }

// At-a-glance facts from the Play Store listing, shown as a spec strip on the
// detail page. `updated` is an ISO date, formatted per locale at render time.
export type ProductMeta = {
    version: string
    updated: string
    androidMin: string
    rating: string
    size: string
    iap?: boolean
}

export type Game = {
    id: string
    nameKey: 'games.defTheBase' | 'games.jumpingJello'
    taglineKey: 'games.taglines.defTheBase' | 'games.taglines.jumpingJello'
    // i18n key for the long marketing description shown on the detail page.
    descriptionKey: string
    // i18n keys for the short feature bullets on the detail page.
    featureKeys: string[]
    // Real artwork (under /public/images). Falls back to emoji + gradient when
    // a game has none yet (Jumping Jello today).
    icon?: string
    featureGraphic?: string
    screenshots?: Shot[]
    emoji: string
    // Tailwind gradient classes used as cover/backdrop when no artwork exists,
    // and as the ambient accent glow behind real art.
    gradient: string
    // Per-product accent colour (hex) - sets the `--pa` CSS var on the detail
    // page so buttons/links/badges pick up the game's identity.
    accent: string
    // True while the game is still in development (no store link yet): the UI
    // shows a "coming soon / in development" treatment instead of a gallery.
    inDevelopment?: boolean
    storeUrl?: string
    // Web progress support. The Unity game writes the Firestore document at
    // `{firestoreCollection}/{uid}`; this site reads it. Only games with
    // `hasWebProfile` show progress on the dashboard.
    hasWebProfile?: boolean
    firestoreCollection?: string
    // Set when the game's save lives in a secondary Firebase project. Omitted =
    // primary project (Def the Base).
    firebaseProject?: FirebaseProjectKey
    // Play Store facts for the spec strip (omitted while unreleased).
    meta?: ProductMeta
}

export const games: Game[] = [
    {
        id: 'def-the-base',
        nameKey: 'games.defTheBase',
        taglineKey: 'games.taglines.defTheBase',
        descriptionKey: 'games.descriptions.defTheBase',
        featureKeys: [
            'games.features.defTheBase.towers',
            'games.features.defTheBase.waves',
            'games.features.defTheBase.upgrades',
            'games.features.defTheBase.cloud',
        ],
        icon: '/images/defthebase/icon.png',
        featureGraphic: '/images/defthebase/feature-graphic.png',
        screenshots: [
            {
                src: '/images/defthebase/01-main-menu.webp',
                captionKey: 'gallery.defTheBase.mainMenu',
            },
            {
                src: '/images/defthebase/02-mission-select.webp',
                captionKey: 'gallery.defTheBase.missionSelect',
            },
            {
                src: '/images/defthebase/05-gameplay.webp',
                captionKey: 'gallery.defTheBase.gameplay',
            },
            { src: '/images/defthebase/08-defense.webp', captionKey: 'gallery.defTheBase.defense' },
            {
                src: '/images/defthebase/06-tower-upgrade.webp',
                captionKey: 'gallery.defTheBase.towerUpgrade',
            },
            {
                src: '/images/defthebase/03-upgrade-tree.webp',
                captionKey: 'gallery.defTheBase.upgradeTree',
            },
            {
                src: '/images/defthebase/07-mass-upgrade.webp',
                captionKey: 'gallery.defTheBase.massUpgrade',
            },
            { src: '/images/defthebase/04-loading.webp', captionKey: 'gallery.defTheBase.loading' },
        ],
        emoji: '🎮',
        gradient: 'from-amber-500 to-orange-700',
        accent: '#f59e0b',
        storeUrl: 'https://play.google.com/store/apps/details?id=com.brothersingames.defthebase2',
        hasWebProfile: true,
        firestoreCollection: 'def_the_base',
        meta: {
            version: '0.2',
            updated: '2026-06-11',
            androidMin: '7.1',
            rating: 'PEGI 3',
            size: '98 MB',
        },
    },
    {
        id: 'jumping-jello',
        nameKey: 'games.jumpingJello',
        taglineKey: 'games.taglines.jumpingJello',
        descriptionKey: 'games.descriptions.jumpingJello',
        featureKeys: [
            'games.features.jumpingJello.hop',
            'games.features.jumpingJello.levels',
            'games.features.jumpingJello.skins',
            'games.features.jumpingJello.cloud',
        ],
        emoji: '🍮',
        gradient: 'from-amber-400 to-pink-500',
        accent: '#fb7185',
        inDevelopment: true,
        hasWebProfile: true,
        firestoreCollection: 'jumping_jello',
        firebaseProject: 'jumpingJello',
    },
]

export function getGameById(id: string | undefined): Game | undefined {
    return games.find((g) => g.id === id)
}
