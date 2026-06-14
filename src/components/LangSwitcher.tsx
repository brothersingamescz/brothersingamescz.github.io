import { useTranslation } from 'react-i18next'

export default function LangSwitcher() {
    const { i18n } = useTranslation()
    const current = i18n.language.startsWith('cs') ? 'cs' : 'en'

    return (
        <div className="flex items-center gap-1 text-sm">
            {(['en', 'cs'] as const).map((lang) => (
                <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        current === lang
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-100'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
