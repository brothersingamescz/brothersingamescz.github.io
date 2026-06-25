import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from '../components/icons'
import {
    MailLink,
    PolicyArticle,
    PolicyCard,
    PolicyHeader,
    PolicySection,
} from '../components/policyUi'

// Game-specific policies linked at the bottom of the website policy.
const GAME_POLICIES = [
    { slug: 'def-the-base', nameKey: 'games.defTheBase' as const },
    { slug: 'jumping-jello', nameKey: 'games.jumpingJello' as const },
]

const APP_POLICIES = [{ slug: 'birthday-reminder', nameKey: 'apps.birthdayReminder' as const }]

// Privacy policy for the website itself (sign-in, reading/deleting save data,
// hosting). Game data collection (ads, IAP, cloud save) lives in the per-game
// policies in PrivacyPolicy.tsx, linked at the bottom.
export default function WebsitePrivacy() {
    const { t } = useTranslation()

    return (
        <PolicyArticle>
            <PolicyHeader
                kicker={t('privacyWeb.title')}
                title={t('privacyWeb.heading')}
                lastUpdated={t('privacyWeb.lastUpdated')}
                intro={t('privacyWeb.intro')}
            />

            <section className="mb-8">
                <h2 className="mb-4 text-lg text-ink sm:text-xl">
                    {t('privacyWeb.servicesTitle')}
                </h2>
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
                        <PolicyCard
                            key={key}
                            name={t(`privacyWeb.${key}.name`)}
                            desc={t(`privacyWeb.${key}.desc`)}
                            href={href}
                            linkLabel={t('privacyWeb.policyLink')}
                        />
                    ))}
                </div>
            </section>

            <PolicySection title={t('privacyWeb.signInTitle')}>
                <p>{t('privacyWeb.signInDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyWeb.saveDataTitle')}>
                <p>{t('privacyWeb.saveDataDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyWeb.noTrackingTitle')}>
                <p>{t('privacyWeb.noTrackingDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyWeb.deletionTitle')}>
                <p>{t('privacyWeb.deletionDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyWeb.gamesTitle')}>
                <p>{t('privacyWeb.gamesDesc')}</p>
                <PolicyLinkList items={GAME_POLICIES} />
            </PolicySection>

            <PolicySection title={t('privacyWeb.appsTitle')}>
                <p>{t('privacyWeb.appsDesc')}</p>
                <PolicyLinkList items={APP_POLICIES} />
            </PolicySection>

            <PolicySection title={t('privacyWeb.contactTitle')}>
                <p>
                    <MailLink />
                </p>
            </PolicySection>
        </PolicyArticle>
    )
}

function PolicyLinkList({ items }: { items: { slug: string; nameKey: string }[] }) {
    const { t } = useTranslation()
    return (
        <ul className="space-y-2">
            {items.map(({ slug, nameKey }) => (
                <li key={slug}>
                    <Link
                        to={`/privacy/${slug}`}
                        className="group inline-flex items-center gap-1.5 font-medium text-brand-text transition-opacity hover:opacity-80"
                    >
                        {t(nameKey)}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </li>
            ))}
        </ul>
    )
}
