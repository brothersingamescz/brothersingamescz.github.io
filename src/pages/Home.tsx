import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-3 text-4xl font-bold text-slate-100">{t('home.welcome')}</h1>
      <p className="mb-2 text-lg font-medium text-indigo-400">{t('home.subtitle')}</p>
      <p className="max-w-md text-slate-400">{t('home.description')}</p>
    </div>
  )
}
