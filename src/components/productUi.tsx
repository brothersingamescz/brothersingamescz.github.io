import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ProductMeta } from '../data/games'
import StoreBadge from './StoreBadge'
import { ArrowLeft, Check } from './icons'

// Shared building blocks for the game/app detail pages. No Firebase imports here,
// so it's safe in both the lazy GameDetail chunk and the eager AppDetail page.

export function BackLink() {
    const { t } = useTranslation()
    return (
        <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
            <ArrowLeft className="size-4" />
            {t('detail.back')}
        </Link>
    )
}

// Full-bleed media banner. The feature graphic (or gradient + emoji fallback)
// fills the background; a dark scrim keeps the white title/tagline legible in
// both themes. The store badge / in-development chip live in the hero footer.
export function ProductHero({
    name,
    tagline,
    icon,
    featureGraphic,
    gradient,
    emoji,
    storeUrl,
    inDevelopment,
}: {
    name: string
    tagline: string
    icon?: string
    featureGraphic?: string
    gradient: string
    emoji: string
    storeUrl?: string
    inDevelopment?: boolean
}) {
    const { t } = useTranslation()

    return (
        <header className="relative overflow-hidden rounded-3xl border border-line shadow-sm">
            <div className="absolute inset-0">
                {featureGraphic ? (
                    <img src={featureGraphic} alt="" className="size-full object-cover" />
                ) : (
                    <div className={`size-full bg-linear-to-br ${gradient}`} />
                )}
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/25" />

            <div className="relative flex min-h-60 flex-col justify-end gap-5 p-6 sm:min-h-72 sm:p-9">
                <div className="flex items-end gap-4">
                    {icon ? (
                        <img
                            src={icon}
                            alt=""
                            className="size-20 shrink-0 rounded-3xl border border-white/20 shadow-xl sm:size-24"
                        />
                    ) : (
                        <span
                            className={`grid size-20 shrink-0 place-items-center rounded-3xl border border-white/20 bg-linear-to-br text-4xl shadow-xl sm:size-24 ${gradient}`}
                        >
                            {emoji}
                        </span>
                    )}
                    <div className="pb-1">
                        {inDevelopment && (
                            <span className="mb-2 inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                                {t('store.inDevelopment')}
                            </span>
                        )}
                        <h1 className="text-3xl text-white drop-shadow sm:text-4xl">{name}</h1>
                        <p className="mt-1 font-sans text-white/75">{tagline}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <StoreBadge storeUrl={storeUrl} />
                </div>
            </div>
        </header>
    )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="mb-4 text-xl text-ink sm:text-2xl">{children}</h2>
}

// At-a-glance store facts (version, update date, Android, rating, size, IAP).
// The update date is localised at render time. Flex-wrap so any count of facts
// lays out cleanly on every width.
export function SpecBar({ meta }: { meta: ProductMeta }) {
    const { t, i18n } = useTranslation()
    const updated = new Date(meta.updated).toLocaleDateString(
        i18n.language.startsWith('cs') ? 'cs-CZ' : 'en-GB',
        { year: 'numeric', month: 'short', day: 'numeric' }
    )

    const items = [
        { label: t('detail.spec.version'), value: meta.version },
        { label: t('detail.spec.updated'), value: updated },
        { label: t('detail.spec.android'), value: `${meta.androidMin}+` },
        { label: t('detail.spec.rating'), value: meta.rating },
        { label: t('detail.spec.size'), value: meta.size },
        ...(meta.iap ? [{ label: t('detail.spec.iap'), value: t('detail.spec.iapYes') }] : []),
    ]

    return (
        <dl className="mt-6 flex flex-wrap gap-2">
            {items.map((it) => (
                <div
                    key={it.label}
                    className="rounded-xl border border-line bg-surface px-3.5 py-2"
                >
                    <dt className="font-sans text-[0.65rem] uppercase tracking-wide text-faint">
                        {it.label}
                    </dt>
                    <dd className="font-sans text-sm font-semibold text-ink">{it.value}</dd>
                </div>
            ))}
        </dl>
    )
}

// Check-bulleted feature list tinted with the page's product accent (`--pa`).
export function FeatureList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-pa/15 text-pa">
                        <Check className="size-3.5" />
                    </span>
                    <span className="font-sans text-sm text-muted">{item}</span>
                </li>
            ))}
        </ul>
    )
}
