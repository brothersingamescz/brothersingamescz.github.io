import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'

export default function GameCard({ game }: { game: Game }) {
    const { t } = useTranslation()

    return (
        <Link
            to={`/games/${game.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30"
        >
            <div
                className={`relative flex aspect-3/1 items-center justify-center bg-linear-to-br ${game.gradient}`}
            >
                <span className="text-5xl drop-shadow-lg transition-transform group-hover:scale-110">
                    {game.emoji}
                </span>
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-semibold text-slate-100">{t(game.nameKey)}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{t(game.taglineKey)}</p>
                <div className="mt-4">
                    {game.hasWebProfile ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                            {t('dashboard.viewProgress')}
                            <span aria-hidden>→</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                            {t('dashboard.comingSoon')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
