import { useTranslation } from 'react-i18next'

export default function LangSwitcher() {
    const { i18n } = useTranslation()
    const current = i18n.language.startsWith('cs') ? 'cs' : 'en'

    return (
        <div className="flex items-center rounded-lg border border-line bg-surface/60 p-0.5 text-xs font-semibold">
            {(['en', 'cs'] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    aria-pressed={current === lang}
                    className={`cursor-pointer rounded-md px-2 py-1 transition-colors ${
                        current === lang ? 'bg-brand text-brand-ink' : 'text-muted hover:text-ink'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
