import { useTranslation } from 'react-i18next'
import {
    ExtLink,
    MailLink,
    PolicyArticle,
    PolicyCard,
    PolicyHeader,
    PolicySection,
} from '../components/policyUi'

// Privacy policy for the Birthday and Name Day Reminder app. Its data stack
// (offline-first local storage, optional Google Drive appdata backup, Google
// AdMob + UMP consent, device permissions) is entirely different from the
// games' policies in PrivacyPolicy.tsx, so it gets its own page + i18n
// namespace (privacyApp.*), the same way WebsitePrivacy.tsx is separate.
// Static route /privacy/birthday-reminder.
export default function AppPrivacyPolicy() {
    const { t } = useTranslation()
    const appName = t('apps.birthdayReminder')

    return (
        <PolicyArticle>
            <PolicyHeader
                kicker={t('privacyApp.title')}
                title={appName}
                lastUpdated={t('privacyApp.lastUpdated')}
                intro={t('privacyApp.intro')}
            />

            <PolicySection title={t('privacyApp.controllerTitle')}>
                <p>{t('privacyApp.controllerDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.dataTitle')}>
                <p>{t('privacyApp.dataDesc')}</p>
            </PolicySection>

            <section className="mb-8">
                <h2 className="mb-4 text-lg text-ink sm:text-xl">
                    {t('privacyApp.permissionsTitle')}
                </h2>
                <div className="space-y-3">
                    {(['contacts', 'notifications', 'media', 'files'] as const).map((key) => (
                        <PolicyCard
                            key={key}
                            name={t(`privacyApp.permissions.${key}.name`)}
                            desc={t(`privacyApp.permissions.${key}.desc`)}
                        />
                    ))}
                </div>
            </section>

            <PolicySection title={t('privacyApp.driveTitle')}>
                <p>{t('privacyApp.driveDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.adsTitle')}>
                <p>{t('privacyApp.adsDesc')}</p>
            </PolicySection>

            <section className="mb-8">
                <h2 className="mb-4 text-lg text-ink sm:text-xl">
                    {t('privacyApp.thirdPartyTitle')}
                </h2>
                <div className="space-y-3">
                    {(['admob', 'googleAccount'] as const).map((key) => (
                        <PolicyCard
                            key={key}
                            name={t(`privacyApp.${key}.name`)}
                            desc={t(`privacyApp.${key}.desc`)}
                            href="https://policies.google.com/privacy"
                            linkLabel={t(`privacyApp.${key}.policy`)}
                        />
                    ))}
                    <ExtLink href="https://policies.google.com/technologies/partner-sites">
                        {t('privacyApp.partnerSites')}
                    </ExtLink>
                </div>
            </section>

            <PolicySection title={t('privacyApp.retentionTitle')}>
                <p>{t('privacyApp.retentionDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.securityTitle')}>
                <p>{t('privacyApp.securityDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.rightsTitle')}>
                <p>{t('privacyApp.rightsIntro')}</p>
                <ul className="list-disc space-y-1 pl-5">
                    {(
                        [
                            'access',
                            'rectification',
                            'erasure',
                            'withdraw',
                            'object',
                            'portability',
                            'complaint',
                        ] as const
                    ).map((key) => (
                        <li key={key}>{t(`privacyApp.rights.${key}`)}</li>
                    ))}
                </ul>
                <p>{t('privacyApp.rightsHow')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.childrenTitle')}>
                <p>{t('privacyApp.childrenDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.changesTitle')}>
                <p>{t('privacyApp.changesDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacyApp.contactTitle')}>
                <p>
                    <MailLink />
                </p>
            </PolicySection>
        </PolicyArticle>
    )
}
