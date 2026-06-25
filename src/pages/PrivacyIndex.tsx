import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ShieldCheck } from '../components/icons'

const games = [
    { slug: 'def-the-base', nameKey: 'games.defTheBase' as const },
    { slug: 'jumping-jello', nameKey: 'games.jumpingJello' as const },
]

const apps = [{ slug: 'birthday-reminder', nameKey: 'apps.birthdayReminder' as const }]

export default function PrivacyIndex() {
    const { t } = useTranslation()

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                <ShieldCheck className="size-3.5 text-brand-text" />
                {t('nav.privacy')}
            </span>
            <h1 className="mt-4 text-2xl text-ink sm:text-3xl">{t('privacy.indexHeading')}</h1>
            <p className="mt-2 font-sans text-muted">{t('privacy.selectGame')}</p>

            <h2 className="mb-3 mt-10 font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
                {t('home.gamesTitle')}
            </h2>
            <PolicyList items={games} />

            <h2 className="mb-3 mt-8 font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
                {t('home.appsTitle')}
            </h2>
            <PolicyList items={apps} />

            <h2 className="mb-3 mt-8 font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
                {t('privacyWeb.title')}
            </h2>
            <PolicyList items={[{ slug: 'web', nameKey: 'privacy.websiteItem' as const }]} />
        </div>
    )
}

function PolicyList({ items }: { items: { slug: string; nameKey: string }[] }) {
    const { t } = useTranslation()
    return (
        <ul className="space-y-3">
            {items.map(({ slug, nameKey }) => (
                <li key={slug}>
                    <Link
                        to={`/privacy/${slug}`}
                        className="group flex items-center justify-between rounded-2xl border border-line bg-surface px-5 py-4 text-ink transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md"
                    >
                        <span className="font-sans font-medium">{t(nameKey)}</span>
                        <ArrowRight className="size-5 text-faint transition-all group-hover:translate-x-1 group-hover:text-brand-text" />
                    </Link>
                </li>
            ))}
        </ul>
    )
}
