import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { User } from 'firebase/auth'
import Avatar from './Avatar'

// Account dropdown for a game's detail page: shows who's signed in to that game's
// Firebase project and lets them sign out. Auth is per project (see useGameAuth),
// so there's no single global account — each game's detail renders its own. Only
// rendered when signed in; the signed-out state is handled by the sign-in prompt.
export default function AccountMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

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
                <span className="hidden max-w-40 truncate text-sm text-slate-300 sm:inline">
                    {name}
                </span>
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
                            <p className="truncate text-sm font-medium text-slate-100">
                                {user.displayName}
                            </p>
                        )}
                        <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                    <button
                        onClick={onSignOut}
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
