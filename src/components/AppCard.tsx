import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { App } from '../data/apps'
import { ArrowRight, GooglePlay } from './icons'

// Home card for a non-game app. Same visual language as GameCard but without the
// progress/dev machinery - shows a Google Play hint when the app is live.
export default function AppCard({ app }: { app: App }) {
    const { t } = useTranslation()

    return (
        <Link
            to={`/apps/${app.id}`}
            style={{ ['--pa' as string]: app.accent }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pa/50 hover:shadow-xl hover:shadow-pa/10"
        >
            <div className="relative aspect-16/10 overflow-hidden">
                {app.featureGraphic ? (
                    <img
                        src={app.featureGraphic}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className={`flex size-full items-center justify-center bg-linear-to-br ${app.gradient}`}
                    >
                        <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                            {app.emoji}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                {app.icon && (
                    <span className="absolute bottom-3 left-3 size-14 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                        <img src={app.icon} alt="" className="size-full object-cover" />
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg text-ink">{t(app.nameKey)}</h3>
                <p className="mt-1 text-sm text-muted">{t(app.taglineKey)}</p>

                <div className="mt-4 flex items-center justify-between">
                    {app.storeUrl ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-pa/10 px-3 py-1 text-xs font-semibold text-pa">
                            <GooglePlay className="size-3.5" />
                            Google Play
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-raised px-3 py-1 text-xs font-semibold text-muted">
                            {t('store.comingSoon')}
                        </span>
                    )}
                    <ArrowRight className="size-5 text-faint transition-all group-hover:translate-x-1 group-hover:text-pa" />
                </div>
            </div>
        </Link>
    )
}
