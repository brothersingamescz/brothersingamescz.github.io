import { useTranslation } from 'react-i18next'

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
        <article className="mx-auto max-w-2xl">
            <h1 className="mb-1 text-2xl font-bold text-slate-100">
                {t('privacyApp.title')} — {appName}
            </h1>
            <p className="mb-8 text-sm text-slate-500">{t('privacyApp.lastUpdated')}</p>

            <p className="mb-8 text-slate-300">{t('privacyApp.intro')}</p>

            <Section title={t('privacyApp.controllerTitle')}>
                <p className="text-slate-400">{t('privacyApp.controllerDesc')}</p>
            </Section>

            <Section title={t('privacyApp.dataTitle')}>
                <p className="text-slate-400">{t('privacyApp.dataDesc')}</p>
            </Section>

            <section className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-slate-100">
                    {t('privacyApp.permissionsTitle')}
                </h2>
                <div className="space-y-3">
                    {(['contacts', 'notifications', 'media', 'files'] as const).map((key) => (
                        <div
                            key={key}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                        >
                            <p className="font-medium text-slate-100">
                                {t(`privacyApp.permissions.${key}.name`)}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {t(`privacyApp.permissions.${key}.desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Section title={t('privacyApp.driveTitle')}>
                <p className="text-slate-400">{t('privacyApp.driveDesc')}</p>
            </Section>

            <Section title={t('privacyApp.adsTitle')}>
                <p className="text-slate-400">{t('privacyApp.adsDesc')}</p>
            </Section>

            <section className="mb-6">
                <h2 className="mb-4 text-lg font-semibold text-slate-100">
                    {t('privacyApp.thirdPartyTitle')}
                </h2>
                <div className="space-y-3">
                    {(['admob', 'googleAccount'] as const).map((key) => (
                        <div
                            key={key}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                        >
                            <p className="font-medium text-slate-100">
                                {t(`privacyApp.${key}.name`)}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {t(`privacyApp.${key}.desc`)}
                            </p>
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-sm text-indigo-400 hover:underline"
                            >
                                {t(`privacyApp.${key}.policy`)} →
                            </a>
                        </div>
                    ))}
                    <a
                        href="https://policies.google.com/technologies/partner-sites"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-indigo-400 hover:underline"
                    >
                        {t('privacyApp.partnerSites')} →
                    </a>
                </div>
            </section>

            <Section title={t('privacyApp.retentionTitle')}>
                <p className="text-slate-400">{t('privacyApp.retentionDesc')}</p>
            </Section>

            <Section title={t('privacyApp.securityTitle')}>
                <p className="text-slate-400">{t('privacyApp.securityDesc')}</p>
            </Section>

            <Section title={t('privacyApp.rightsTitle')}>
                <p className="mb-3 text-slate-400">{t('privacyApp.rightsIntro')}</p>
                <ul className="mb-3 list-disc space-y-1 pl-5 text-slate-400">
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
                <p className="text-slate-400">{t('privacyApp.rightsHow')}</p>
            </Section>

            <Section title={t('privacyApp.childrenTitle')}>
                <p className="text-slate-400">{t('privacyApp.childrenDesc')}</p>
            </Section>

            <Section title={t('privacyApp.changesTitle')}>
                <p className="text-slate-400">{t('privacyApp.changesDesc')}</p>
            </Section>

            <Section title={t('privacyApp.contactTitle')}>
                <a
                    href="mailto:brothersingamescz@gmail.com"
                    className="text-indigo-400 hover:underline"
                >
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
