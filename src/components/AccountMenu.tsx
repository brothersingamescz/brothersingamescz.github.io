import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth, signOut } from '../hooks/useAuth'
import Avatar from './Avatar'

export default function AccountMenu() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Close the menu when the route changes (a menu item was clicked).
  useEffect(() => setOpen(false), [location.pathname])

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-slate-800" />
  }

  if (!user) {
    return (
      <Link
        to="/account"
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        {t('menu.signIn')}
      </Link>
    )
  }

  const name = user.displayName || user.email || ''

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-800"
      >
        <Avatar photoURL={user.photoURL} name={name} />
        <span className="hidden max-w-40 truncate text-sm text-slate-300 sm:inline">{name}</span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.25 4.42a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl shadow-black/40"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            {user.displayName && (
              <p className="truncate text-sm font-medium text-slate-100">{user.displayName}</p>
            )}
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <Link
            to="/dashboard"
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
          >
            {t('menu.dashboard')}
          </Link>
          <Link
            to="/account"
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
          >
            {t('menu.account')}
          </Link>
          <button
            onClick={() => signOut()}
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
          >
            {t('profile.signOut')}
          </button>
        </div>
      )}
    </div>
  )
}
