import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const games = [
  { slug: 'def-the-base', nameKey: 'privacy.games.defTheBase' as const },
  { slug: 'jumping-jello', nameKey: 'privacy.games.jumpingJello' as const },
]

export default function PrivacyIndex() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-100">{t('nav.privacy')}</h1>
      <p className="mb-8 text-slate-400">{t('privacy.selectGame')}</p>
      <ul className="space-y-3">
        {games.map(({ slug, nameKey }) => (
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
    </div>
  )
}
