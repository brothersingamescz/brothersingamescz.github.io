import { Outlet, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitcher from './LangSwitcher'
import Footer from './Footer'

export default function Layout() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
                    <NavLink to="/" className="font-bold tracking-tight text-indigo-400">
                        BrothersInGames
                    </NavLink>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `text-sm transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-100'}`
                            }
                        >
                            {t('nav.home')}
                        </NavLink>
                        <NavLink
                            to="/privacy"
                            className={({ isActive }) =>
                                `hidden text-sm transition-colors sm:inline ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-100'}`
                            }
                        >
                            {t('nav.privacy')}
                        </NavLink>
                        <LangSwitcher />
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-5xl px-4 py-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
