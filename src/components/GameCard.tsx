import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'
import { ArrowRight } from './icons'

// Home card for a game. Uses the real feature graphic + icon when available,
// falling back to the gradient + emoji for games without artwork yet (Jumping
// Jello). The per-game accent (`--pa`) tints the hover ring and status chip.
export default function GameCard({ game }: { game: Game }) {
    const { t } = useTranslation()

    return (
        <Link
            to={`/games/${game.id}`}
            style={{ ['--pa' as string]: game.accent }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pa/50 hover:shadow-xl hover:shadow-pa/10"
        >
            <div className="relative aspect-16/10 overflow-hidden">
                {game.featureGraphic ? (
                    <img
                        src={game.featureGraphic}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className={`flex size-full items-center justify-center bg-linear-to-br ${game.gradient}`}
                    >
                        <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                            {game.emoji}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                {game.inDevelopment && (
                    <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        {t('store.inDevelopment')}
                    </span>
                )}

                {game.icon && (
                    <span className="absolute bottom-3 left-3 size-14 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                        <img src={game.icon} alt="" className="size-full object-cover" />
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg text-ink">{t(game.nameKey)}</h3>
                <p className="mt-1 text-sm text-muted">{t(game.taglineKey)}</p>

                <div className="mt-4 flex items-center justify-between">
                    {game.hasWebProfile && !game.inDevelopment ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-pa/10 px-3 py-1 text-xs font-semibold text-pa">
                            {t('dashboard.viewProgress')}
                        </span>
                    ) : game.inDevelopment ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-raised px-3 py-1 text-xs font-semibold text-muted">
                            {t('store.comingSoon')}
                        </span>
                    ) : (
                        <span />
                    )}
                    <ArrowRight className="size-5 text-faint transition-all group-hover:translate-x-1 group-hover:text-pa" />
                </div>
            </div>
        </Link>
    )
}
