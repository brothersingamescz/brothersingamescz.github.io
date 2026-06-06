import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-slate-800 py-6 text-center text-sm text-slate-500">
      <a
        href="mailto:brothersingamescz@gmail.com"
        className="transition-colors hover:text-slate-400"
      >
        brothersingamescz@gmail.com
      </a>
      <span aria-hidden className="text-slate-700">
        ·
      </span>
      <Link to="/privacy/web" className="transition-colors hover:text-slate-400">
        {t('privacyWeb.title')}
      </Link>
    </footer>
  )
}
