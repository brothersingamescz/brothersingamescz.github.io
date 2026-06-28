import { Outlet, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitcher from './LangSwitcher'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
    const { t } = useTranslation()

    return (
        <div className="flex min-h-dvh flex-col bg-base text-ink">
            <ScrollToTop />
            <header className="sticky top-0 z-40 border-b border-line bg-base/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                    <NavLink to="/" aria-label="BrothersInGames" className="shrink-0">
                        <Logo />
                    </NavLink>
                    <nav className="flex items-center gap-1 sm:gap-2">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-raised text-ink'
                                        : 'text-muted hover:bg-raised/60 hover:text-ink'
                                }`
                            }
                        >
                            {t('nav.home')}
                        </NavLink>
                        <NavLink
                            to="/privacy"
                            className={({ isActive }) =>
                                `hidden rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:inline-block ${
                                    isActive
                                        ? 'bg-raised text-ink'
                                        : 'text-muted hover:bg-raised/60 hover:text-ink'
                                }`
                            }
                        >
                            {t('nav.privacy')}
                        </NavLink>
                        <span className="mx-1 hidden h-5 w-px bg-line sm:block" aria-hidden />
                        <ThemeToggle />
                        <LangSwitcher />
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}
