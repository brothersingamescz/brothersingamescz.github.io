import { useTranslation } from 'react-i18next'
import { games } from '../data/games'
import DashboardGameCard from '../components/DashboardGameCard'

export default function Dashboard() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{t('dashboard.title')}</h1>
        <p className="mt-1 text-slate-400">{t('dashboard.subtitle')}</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        {games.map((game) => (
          <DashboardGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
