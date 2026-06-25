import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { User } from 'firebase/auth'
import Avatar from './Avatar'
import { ChevronDown } from './icons'

// Account dropdown for a game's detail page: shows who's signed in to that game's
// Firebase project and lets them sign out. Auth is per project (see useGameAuth),
// so there's no single global account - each game's detail renders its own. Only
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
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2 transition-colors hover:bg-raised"
            >
                <Avatar photoURL={user.photoURL} name={name} />
                <span className="hidden max-w-40 truncate font-sans text-sm text-muted sm:inline">
                    {name}
                </span>
                <ChevronDown
                    className={`size-4 text-faint transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/20"
                >
                    <div className="border-b border-line px-4 py-3">
                        {user.displayName && (
                            <p className="truncate font-sans text-sm font-medium text-ink">
                                {user.displayName}
                            </p>
                        )}
                        <p className="truncate font-sans text-xs text-faint">{user.email}</p>
                    </div>
                    <button
                        onClick={onSignOut}
                        role="menuitem"
                        className="block w-full cursor-pointer px-4 py-2.5 text-left font-sans text-sm text-muted transition-colors hover:bg-raised hover:text-ink"
                    >
                        {t('profile.signOut')}
                    </button>
                </div>
            )}
        </div>
    )
}
