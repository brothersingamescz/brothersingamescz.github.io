import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    ExtLink,
    MailLink,
    PolicyArticle,
    PolicyCard,
    PolicyHeader,
    PolicySection,
} from '../components/policyUi'

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
        <PolicyArticle>
            <PolicyHeader
                kicker={t('privacy.title')}
                title={gameName}
                lastUpdated={t('privacy.lastUpdated')}
                intro={t('privacy.intro', { gameName })}
            />

            <section className="mb-8">
                <h2 className="mb-4 text-lg text-ink sm:text-xl">{t('privacy.thirdPartyTitle')}</h2>
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
                        <PolicyCard
                            key={key}
                            name={t(`privacy.${key}.name`)}
                            desc={t(`privacy.${key}.desc`)}
                            href={href}
                            linkLabel={t(`privacy.${key}.policy`)}
                        />
                    ))}
                </div>
            </section>

            <PolicySection title={t('privacy.saveDataTitle')}>
                <p>{t('privacy.saveDataDesc')}</p>
            </PolicySection>

            <PolicySection title={t('privacy.advertisingTitle')}>
                <p>{t('privacy.advertisingDesc')}</p>
            </PolicySection>

            {config.hasIAP && (
                <PolicySection title={t('privacy.purchasesTitle')}>
                    <p>{t('privacy.purchasesDesc')}</p>
                    <ExtLink href="https://policies.google.com/privacy">
                        {t('privacy.googlePlay.policy')}
                    </ExtLink>
                </PolicySection>
            )}

            <PolicySection title={t('privacy.deletionTitle')}>
                <p>{t('privacy.deletionIntro')}</p>

                <h3 className="pt-1 font-sans font-semibold text-ink">
                    {t('privacy.deletionGpgsTitle')}
                </h3>
                <ol className="list-decimal space-y-1 pl-5">
                    <li>{t('privacy.deletionGpgsStep1')}</li>
                    <li>{t('privacy.deletionGpgsStep2', { gameName })}</li>
                    <li>{t('privacy.deletionGpgsStep3')}</li>
                </ol>

                <h3 className="pt-2 font-sans font-semibold text-ink">
                    {t('privacy.deletionWebTitle')}
                </h3>
                <p>{t('privacy.deletionWebDesc', { gameName })}</p>

                <p>{t('privacy.deletionOutcome')}</p>
                <p>
                    {t('privacy.deletionContact')} <MailLink />
                </p>
            </PolicySection>

            <PolicySection title={t('privacy.contactTitle')}>
                <p>
                    <MailLink />
                </p>
            </PolicySection>
        </PolicyArticle>
    )
}
