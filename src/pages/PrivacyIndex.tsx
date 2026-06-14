import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const games = [
    { slug: 'def-the-base', nameKey: 'games.defTheBase' as const },
    { slug: 'jumping-jello', nameKey: 'games.jumpingJello' as const },
]

const apps = [{ slug: 'birthdays-beyond', nameKey: 'apps.birthdaysBeyond' as const }]

export default function PrivacyIndex() {
    const { t } = useTranslation()

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-2 text-2xl font-bold text-slate-100">{t('nav.privacy')}</h1>
            <p className="mb-8 text-slate-400">{t('privacy.selectGame')}</p>

            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
                {t('home.gamesTitle')}
            </h2>
            <PolicyList items={games} />

            <h2 className="mb-3 mt-8 text-xs font-medium uppercase tracking-widest text-slate-500">
                {t('home.appsTitle')}
            </h2>
            <PolicyList items={apps} />
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
                        className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-5 py-4 text-slate-100 transition-colors hover:border-indigo-600 hover:bg-slate-800"
                    >
                        <span>{t(nameKey)}</span>
                        <span className="text-slate-500">→</span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}
