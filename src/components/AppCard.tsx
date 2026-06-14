import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { App } from '../data/apps'

export default function AppCard({ app }: { app: App }) {
    const { t } = useTranslation()

    return (
        <Link
            to={`/apps/${app.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30"
        >
            <div
                className={`relative flex aspect-3/1 items-center justify-center bg-linear-to-br ${app.gradient}`}
            >
                <span className="text-5xl drop-shadow-lg transition-transform group-hover:scale-110">
                    {app.emoji}
                </span>
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-semibold text-slate-100">{t(app.nameKey)}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{t(app.taglineKey)}</p>
                <div className="mt-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                        {t('dashboard.comingSoon')}
                    </span>
                </div>
            </div>
        </Link>
    )
}
