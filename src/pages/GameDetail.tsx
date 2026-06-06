import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getGameById, type Game } from '../data/games'
import { useGameAuth, type GameAuth } from '../hooks/useGameAuth'
import AccountMenu from '../components/AccountMenu'
import GoogleSignInButton from '../components/GoogleSignInButton'
import DefTheBaseProfile from '../components/DefTheBaseProfile'
import JumpingJelloProfile from '../components/JumpingJelloProfile'

// game id -> the component that renders that game's save data. Add an entry here
// when another game starts syncing its save to Firestore. The gate passes the
// game and the (project-specific) signed-in uid down.
const RENDERERS: Record<string, React.ComponentType<{ game: Game; uid: string }>> = {
  'def-the-base': DefTheBaseProfile,
  'jumping-jello': JumpingJelloProfile,
}

export default function GameDetail() {
  const { t } = useTranslation()
  const { gameId } = useParams()
  const game = getGameById(gameId)
  // Auth against this game's own Firebase project (per-project sign-in/out).
  const auth = useGameAuth(game?.firebaseProject)

  if (!game) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-3xl">
      {/* Per-game account menu (sign out). Sits above the banner because the
          banner clips overflow and would cut off the dropdown. */}
      {game.hasWebProfile && auth.user && (
        <div className="mb-3 flex justify-end">
          <AccountMenu user={auth.user} onSignOut={auth.signOut} />
        </div>
      )}
      <Banner game={game} />
      <div className="mt-8">
        {game.hasWebProfile ? (
          <ProfileGate game={game} auth={auth} />
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

// Gates the game-specific data renderer behind sign-in. Auth is resolved once in
// GameDetail (against the game's own Firebase project) and passed in.
function ProfileGate({ game, auth }: { game: Game; auth: GameAuth }) {
  const { t } = useTranslation()
  const { uid, status, signIn } = auth

  if (status === 'loading') return <p className="text-slate-400">{t('profile.loading')}</p>
  if (status === 'needs-signin' || !uid) return <SignInPrompt game={game} signIn={signIn} />

  const Renderer = RENDERERS[game.id]
  return Renderer ? <Renderer game={game} uid={uid} /> : <Notice>{t('detail.noTracking')}</Notice>
}

function SignInPrompt({ game, signIn }: { game: Game; signIn: () => Promise<void> }) {
  const { t } = useTranslation()
  const [error, setError] = useState(false)

  async function handleSignIn() {
    setError(false)
    try {
      await signIn()
    } catch {
      setError(true)
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
      <p className="mb-4 text-slate-300">{t('detail.signInPrompt', { game: t(game.nameKey) })}</p>
      <GoogleSignInButton onClick={handleSignIn} />
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
