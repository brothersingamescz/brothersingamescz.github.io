import { useTranslation } from 'react-i18next'
import { games } from '../data/games'
import GameCard from '../components/GameCard'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="mb-3 text-4xl font-bold text-slate-100">{t('home.welcome')}</h1>
        <p className="mb-2 text-lg font-medium text-indigo-400">{t('home.subtitle')}</p>
        <p className="max-w-md text-slate-400">{t('home.description')}</p>
      </div>
      <section>
        <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-slate-500">
          {t('home.gamesTitle')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  )
}
