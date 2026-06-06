import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Game-specific policies linked at the bottom of the website policy.
const GAME_POLICIES = [
  { slug: 'def-the-base', nameKey: 'games.defTheBase' as const },
  { slug: 'jumping-jello', nameKey: 'games.jumpingJello' as const },
]

// Privacy policy for the website itself (sign-in, reading/deleting save data,
// hosting). Game data collection (ads, IAP, cloud save) lives in the per-game
// policies in PrivacyPolicy.tsx, linked at the bottom.
export default function WebsitePrivacy() {
  const { t } = useTranslation()

  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-100">{t('privacyWeb.title')}</h1>
      <p className="mb-8 text-sm text-slate-500">{t('privacyWeb.lastUpdated')}</p>

      <p className="mb-8 text-slate-300">{t('privacyWeb.intro')}</p>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">{t('privacyWeb.servicesTitle')}</h2>
        <div className="space-y-3">
          {(
            [
              { key: 'firebase', href: 'https://policies.google.com/privacy' },
              {
                key: 'github',
                href: 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement',
              },
            ] as const
          ).map(({ key, href }) => (
            <div key={key} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="font-medium text-slate-100">{t(`privacyWeb.${key}.name`)}</p>
              <p className="mt-1 text-sm text-slate-400">{t(`privacyWeb.${key}.desc`)}</p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-indigo-400 hover:underline"
              >
                {t('privacyWeb.policyLink')} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <Section title={t('privacyWeb.signInTitle')}>
        <p className="text-slate-400">{t('privacyWeb.signInDesc')}</p>
      </Section>

      <Section title={t('privacyWeb.saveDataTitle')}>
        <p className="text-slate-400">{t('privacyWeb.saveDataDesc')}</p>
      </Section>

      <Section title={t('privacyWeb.noTrackingTitle')}>
        <p className="text-slate-400">{t('privacyWeb.noTrackingDesc')}</p>
      </Section>

      <Section title={t('privacyWeb.deletionTitle')}>
        <p className="text-slate-400">{t('privacyWeb.deletionDesc')}</p>
      </Section>

      <Section title={t('privacyWeb.gamesTitle')}>
        <p className="mb-3 text-slate-400">{t('privacyWeb.gamesDesc')}</p>
        <ul className="space-y-2">
          {GAME_POLICIES.map(({ slug, nameKey }) => (
            <li key={slug}>
              <Link to={`/privacy/${slug}`} className="text-indigo-400 hover:underline">
                {t(nameKey)} →
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('privacyWeb.contactTitle')}>
        <a href="mailto:brothersingamescz@gmail.com" className="text-indigo-400 hover:underline">
          brothersingamescz@gmail.com
        </a>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-lg font-semibold text-slate-100">{title}</h2>
      {children}
    </section>
  )
}
