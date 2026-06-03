import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getGameById, type Game } from '../data/games'
import { useAuth, signInWithGoogle } from '../hooks/useAuth'
import DefTheBaseProfile from '../components/DefTheBaseProfile'

// game id -> the component that renders that game's save data. Only Def the Base
// has a web profile today; add an entry here when another game starts syncing.
const RENDERERS: Record<string, React.ComponentType> = {
  'def-the-base': DefTheBaseProfile,
}

export default function GameDetail() {
  const { t } = useTranslation()
  const { gameId } = useParams()
  const game = getGameById(gameId)

  if (!game) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-3xl">
      <Banner game={game} />
      <div className="mt-8">
        {game.hasWebProfile ? (
          <ProfileGate game={game} />
        ) : (
          <Notice>{t('detail.noTracking')}</Notice>
        )}
      </div>
    </div>
  )
}

function Banner({ game }: { game: Game }) {
  const { t } = useTranslation()
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${game.gradient} p-6 sm:p-8`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> {t('detail.back')}
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-5xl drop-shadow">{game.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{t(game.nameKey)}</h1>
            <p className="text-sm text-white/80">{t(game.taglineKey)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Gates the game-specific data renderer behind sign-in.
function ProfileGate({ game }: { game: Game }) {
  const { t } = useTranslation()
  const { user, loading } = useAuth()

  if (loading) return <p className="text-slate-400">{t('profile.loading')}</p>
  if (!user) return <SignInPrompt game={game} />

  const Renderer = RENDERERS[game.id]
  return Renderer ? <Renderer /> : <Notice>{t('detail.noTracking')}</Notice>
}

function SignInPrompt({ game }: { game: Game }) {
  const { t } = useTranslation()
  const [error, setError] = useState(false)

  async function handleSignIn() {
    setError(false)
    try {
      await signInWithGoogle()
    } catch {
      setError(true)
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <p className="mb-4 text-slate-300">{t('detail.signInPrompt', { game: t(game.nameKey) })}</p>
      <button
        onClick={handleSignIn}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-500"
      >
        {t('detail.signInHere')}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{t('profile.signInError')}</p>}
    </div>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <p className="text-slate-300">{children}</p>
    </div>
  )
}
