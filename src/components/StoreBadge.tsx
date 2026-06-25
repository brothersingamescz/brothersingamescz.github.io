import { useTranslation } from 'react-i18next'
import { GooglePlay } from './icons'

// "Get it on Google Play" pill. When no storeUrl exists yet (game still in
// development) it renders a non-interactive "coming soon" variant instead of a
// dead link. Sizes: md (detail hero) and sm (cards).
export default function StoreBadge({
    storeUrl,
    size = 'md',
}: {
    storeUrl?: string
    size?: 'sm' | 'md'
}) {
    const { t } = useTranslation()

    const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
    const icon = size === 'sm' ? 'size-4' : 'size-5'

    if (!storeUrl) {
        return (
            <span
                className={`inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 font-medium text-faint ${pad}`}
            >
                <GooglePlay className={icon} />
                {t('store.comingSoon')}
            </span>
        )
    }

    return (
        <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2 rounded-xl border border-line bg-surface font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md ${pad}`}
        >
            <GooglePlay className={icon} />
            <span className="flex flex-col items-start leading-tight">
                <span className="text-[0.6rem] font-normal text-muted">{t('store.getOn')}</span>
                <span className="-mt-0.5">Google Play</span>
            </span>
        </a>
    )
}
