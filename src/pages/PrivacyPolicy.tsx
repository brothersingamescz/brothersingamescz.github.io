import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const GAME_CONFIGS = {
    'def-the-base': { nameKey: 'games.defTheBase' as const, hasIAP: false },
    'jumping-jello': { nameKey: 'games.jumpingJello' as const, hasIAP: true },
}

type GameSlug = keyof typeof GAME_CONFIGS

export default function PrivacyPolicy() {
    const { game } = useParams<{ game: string }>()
    const { t } = useTranslation()

    if (!game || !(game in GAME_CONFIGS)) {
        return <Navigate to="/privacy" replace />
    }

    const config = GAME_CONFIGS[game as GameSlug]
    const gameName = t(config.nameKey)

    return (
        <article className="mx-auto max-w-2xl">
            <h1 className="mb-1 text-2xl font-bold text-slate-100">
                {t('privacy.title')} — {gameName}
            </h1>
            <p className="mb-8 text-sm text-slate-500">{t('privacy.lastUpdated')}</p>

            <p className="mb-8 text-slate-300">{t('privacy.intro', { gameName })}</p>

            <section className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-slate-100">
                    {t('privacy.thirdPartyTitle')}
                </h2>
                <div className="space-y-3">
                    {(
                        [
                            {
                                key: 'levelPlay',
                                href: 'https://unity.com/legal/game-player-and-app-user-privacy-policy',
                            },
                            { key: 'googlePlay', href: 'https://policies.google.com/privacy' },
                            { key: 'firebase', href: 'https://policies.google.com/privacy' },
                        ] as const
                    ).map(({ key, href }) => (
                        <div
                            key={key}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                        >
                            <p className="font-medium text-slate-100">{t(`privacy.${key}.name`)}</p>
                            <p className="mt-1 text-sm text-slate-400">
                                {t(`privacy.${key}.desc`)}
                            </p>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-sm text-indigo-400 hover:underline"
                            >
                                {t(`privacy.${key}.policy`)} →
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <Section title={t('privacy.saveDataTitle')}>
                <p className="text-slate-400">{t('privacy.saveDataDesc')}</p>
            </Section>

            <Section title={t('privacy.advertisingTitle')}>
                <p className="text-slate-400">{t('privacy.advertisingDesc')}</p>
            </Section>

            {config.hasIAP && (
                <Section title={t('privacy.purchasesTitle')}>
                    <p className="text-slate-400">{t('privacy.purchasesDesc')}</p>
                    <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm text-indigo-400 hover:underline"
                    >
                        {t('privacy.googlePlay.policy')} →
                    </a>
                </Section>
            )}

            <Section title={t('privacy.deletionTitle')}>
                <p className="mb-3 text-slate-400">{t('privacy.deletionIntro')}</p>

                <h3 className="mb-1 font-medium text-slate-200">
                    {t('privacy.deletionGpgsTitle')}
                </h3>
                <ol className="mb-4 list-decimal space-y-1 pl-5 text-slate-400">
                    <li>{t('privacy.deletionGpgsStep1')}</li>
                    <li>{t('privacy.deletionGpgsStep2', { gameName })}</li>
                    <li>{t('privacy.deletionGpgsStep3')}</li>
                </ol>

                <h3 className="mb-1 font-medium text-slate-200">{t('privacy.deletionWebTitle')}</h3>
                <p className="mb-4 text-slate-400">{t('privacy.deletionWebDesc', { gameName })}</p>

                <p className="mb-3 text-slate-400">{t('privacy.deletionOutcome')}</p>
                <p className="text-slate-400">
                    {t('privacy.deletionContact')}{' '}
                    <a
                        href="mailto:brothersingamescz@gmail.com"
                        className="text-indigo-400 hover:underline"
                    >
                        brothersingamescz@gmail.com
                    </a>
                </p>
            </Section>

            <Section title={t('privacy.contactTitle')}>
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
