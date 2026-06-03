import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth, signInWithGoogle, signOut } from '../hooks/useAuth'
import Avatar from '../components/Avatar'

export default function Account() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const [error, setError] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const redirect = params.get('redirect')

  // After a successful sign-in, bounce back to where the user came from.
  useEffect(() => {
    if (user && redirect) navigate(redirect, { replace: true })
  }, [user, redirect, navigate])

  async function handleSignIn() {
    setError(false)
    try {
      await signInWithGoogle()
    } catch {
      setError(true)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">{t('account.title')}</h1>

      {loading && <p className="text-slate-400">{t('profile.loading')}</p>}

      {!loading && !user && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-1 text-lg font-semibold text-slate-100">{t('account.signInTitle')}</h2>
          <p className="mb-5 text-sm text-slate-400">{t('account.signInPrompt')}</p>
          <button
            onClick={handleSignIn}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {t('profile.signIn')}
          </button>
          {error && <p className="mt-3 text-sm text-red-400">{t('profile.signInError')}</p>}
        </div>
      )}

      {!loading && user && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-4">
            <Avatar
              photoURL={user.photoURL}
              name={user.displayName || user.email || ''}
              size="h-14 w-14"
              textClassName="text-lg"
            />
            <div className="min-w-0">
              {user.displayName && (
                <p className="truncate font-medium text-slate-100">{user.displayName}</p>
              )}
              <p className="truncate text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => signOut()}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
            >
              {t('profile.signOut')}
            </button>
            <Link
              to="/"
              className="text-sm text-indigo-400 transition-colors hover:text-indigo-300"
            >
              {t('account.backToDashboard')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
