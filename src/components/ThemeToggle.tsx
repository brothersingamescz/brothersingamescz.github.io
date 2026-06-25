import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { Moon, Sun } from './icons'

// Light/dark switch for the header. Shows the icon of the theme it will switch
// to. 44×44 hit area, visible focus ring (inherited from :focus-visible).
export default function ThemeToggle() {
    const { t } = useTranslation()
    const { theme, toggle } = useTheme()
    const next = theme === 'dark' ? 'light' : 'dark'

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={t(`nav.theme.${next}`)}
            title={t(`nav.theme.${next}`)}
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-surface/60 text-muted transition-colors hover:text-ink hover:border-brand/50"
        >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    )
}
