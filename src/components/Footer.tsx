import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

export default function Footer() {
    const { t } = useTranslation()
    return (
        <footer className="mt-20 border-t border-line">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
                <div className="flex flex-col items-center gap-2 sm:items-start">
                    <Logo />
                    <p className="text-sm text-faint">{t('footer.tagline')}</p>
                </div>
                <div className="flex flex-col items-center gap-3 text-sm sm:items-end">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                        <Link to="/privacy" className="text-muted transition-colors hover:text-ink">
                            {t('nav.privacy')}
                        </Link>
                        <Link
                            to="/privacy/web"
                            className="text-muted transition-colors hover:text-ink"
                        >
                            {t('privacyWeb.title')}
                        </Link>
                        <a
                            href="mailto:brothersingamescz@gmail.com"
                            className="text-muted transition-colors hover:text-ink"
                        >
                            brothersingamescz@gmail.com
                        </a>
                    </div>
                    <p className="text-xs text-faint">
                        © {new Date().getFullYear()} BrothersInGames · {t('footer.madeIn')}
                    </p>
                </div>
            </div>
        </footer>
    )
}
