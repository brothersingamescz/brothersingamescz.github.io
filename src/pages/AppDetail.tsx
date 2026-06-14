import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAppById, type App } from '../data/apps'

// Detail page for a non-game app. Apps have no web profile / Firebase, so this
// is just a banner + a "coming soon" notice + a link to the app's privacy
// policy. Not lazy-loaded (no firebase to keep out of the bundle).
export default function AppDetail() {
    const { t } = useTranslation()
    const { appId } = useParams()
    const app = getAppById(appId)

    if (!app) return <Navigate to="/" replace />

    return (
        <div className="mx-auto max-w-3xl">
            <Banner app={app} />
            <div className="mt-8">
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <p className="text-slate-300">{t('detail.comingSoon')}</p>
                </div>
            </div>
        </div>
    )
}

function Banner({ app }: { app: App }) {
    const { t } = useTranslation()
    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${app.gradient} p-6 sm:p-8`}
        >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
                >
                    <span aria-hidden>←</span> {t('detail.back')}
                </Link>
                <div className="mt-4 flex items-center gap-4">
                    <span className="text-5xl drop-shadow">{app.emoji}</span>
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">
                            {t(app.nameKey)}
                        </h1>
                        <p className="text-sm text-white/80">{t(app.taglineKey)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
