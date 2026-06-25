import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAppById } from '../data/apps'
import ScreenshotGallery from '../components/ScreenshotGallery'
import { BackLink, FeatureList, ProductHero, SectionTitle, SpecBar } from '../components/productUi'
import { ShieldCheck } from '../components/icons'

// Detail page for a non-game app. Apps have no web profile / Firebase, so this
// is a pure marketing page: hero + about + feature gallery + a link to the app's
// own privacy policy. Not lazy-loaded (no firebase to keep out of the bundle).
export default function AppDetail() {
    const { t } = useTranslation()
    const { appId } = useParams()
    const app = getAppById(appId)

    if (!app) return <Navigate to="/" replace />

    return (
        <div
            style={{ ['--pa' as string]: app.accent }}
            className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10"
        >
            <div className="mb-5">
                <BackLink />
            </div>

            <ProductHero
                name={t(app.nameKey)}
                tagline={t(app.taglineKey)}
                icon={app.icon}
                featureGraphic={app.featureGraphic}
                gradient={app.gradient}
                emoji={app.emoji}
                storeUrl={app.storeUrl}
            />

            {app.meta && <SpecBar meta={app.meta} />}

            <section className="mt-10 grid gap-8 md:grid-cols-[1.6fr_1fr]">
                <div>
                    <SectionTitle>{t('detail.aboutApp')}</SectionTitle>
                    <p className="font-sans leading-relaxed text-muted">{t(app.descriptionKey)}</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-5">
                    <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wider text-faint">
                        {t('detail.features')}
                    </h3>
                    <FeatureList items={app.featureKeys.map((k) => t(k))} />
                </div>
            </section>

            {app.screenshots?.length ? (
                <section className="mt-12">
                    <SectionTitle>{t('detail.screenshots')}</SectionTitle>
                    <ScreenshotGallery
                        shots={app.screenshots}
                        orientation="portrait"
                        name={t(app.nameKey)}
                    />
                </section>
            ) : null}

            <div className="mt-14 border-t border-line pt-6">
                <Link
                    to={app.privacyPath}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text transition-opacity hover:opacity-80"
                >
                    <ShieldCheck className="size-4" />
                    {t('detail.privacyLink')}
                </Link>
            </div>
        </div>
    )
}
