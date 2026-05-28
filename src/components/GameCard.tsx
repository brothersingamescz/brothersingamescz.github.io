import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'

export default function GameCard({ game }: { game: Game }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <span className="mb-3 text-4xl">{game.emoji}</span>
      <p className="mb-3 font-semibold text-slate-100">{t(game.nameKey)}</p>
      {game.storeUrl ? (
        <a
          href={game.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Google Play
        </a>
      ) : (
        <span className="rounded bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
          {t('home.comingSoon')}
        </span>
      )}
    </div>
  )
}
