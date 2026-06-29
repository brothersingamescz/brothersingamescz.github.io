import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BackLink } from '../components/productUi'
import { ArrowRight, Check, Coffee, ExternalLink, Heart, Smartphone } from '../components/icons'
import { KOFI_URL } from '../lib/links'

// Static donation page: a Ko-fi call-to-action (financial support only). The
// "contact us" form lives on its own /contact page; a link points there for
// anyone who landed here looking for help rather than to donate.
const FUND_ITEMS = ['develop', 'fix', 'run', 'assets'] as const

export default function Support() {
    const { t } = useTranslation()

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-5">
                <BackLink />
            </div>

            <header className="mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                    <Heart className="size-3.5 text-brand-text" />
                    {t('support.title')}
                </span>
                <h1 className="mt-4 text-2xl text-ink sm:text-3xl">{t('support.heading')}</h1>
                <p className="mt-4 font-sans leading-relaxed text-muted">{t('support.intro')}</p>
            </header>

            {/* ── Ko-fi donation ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand/15 blur-3xl"
                />
                <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand-text">
                        <Coffee className="size-4" />
                        {t('support.kofi.title')}
                    </span>
                    <p className="mt-4 max-w-prose font-sans leading-relaxed text-muted">
                        {t('support.kofi.desc')}
                    </p>

                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {FUND_ITEMS.map((k) => (
                            <li key={k} className="flex items-start gap-2.5">
                                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                                    <Check className="size-3.5" />
                                </span>
                                <span className="font-sans text-sm text-muted">
                                    {t(`support.funds.items.${k}`)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Two ways to give: tap the button (same device) or scan the
                        QR with a phone (e.g. reading on a desktop). */}
                    <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex flex-col items-start gap-3">
                            <a
                                href={KOFI_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:brightness-110"
                            >
                                <Coffee className="size-4" />
                                {t('support.kofi.cta')}
                                <ExternalLink className="size-4" />
                            </a>
                            <p className="font-sans text-xs text-faint">{t('support.kofi.note')}</p>
                        </div>

                        <div
                            aria-hidden
                            className="flex items-center gap-3 sm:flex-col sm:self-stretch"
                        >
                            <span className="h-px flex-1 bg-line sm:h-auto sm:w-px" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-faint">
                                {t('support.qr.or')}
                            </span>
                            <span className="h-px flex-1 bg-line sm:h-auto sm:w-px" />
                        </div>

                        <div className="flex shrink-0 flex-col items-center gap-2.5">
                            <div className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-black/5">
                                <img
                                    src="/images/buy-us-a-coffe-QR.jpg"
                                    alt={t('support.qr.alt')}
                                    width={176}
                                    height={176}
                                    loading="lazy"
                                    className="size-40 sm:size-44"
                                />
                            </div>
                            <p className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted">
                                <Smartphone className="size-3.5" />
                                {t('support.qr.caption')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <p className="mt-8 font-sans text-sm text-muted">
                {t('support.contactLink')}{' '}
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 font-medium text-brand-text transition-opacity hover:opacity-80"
                >
                    {t('support.contactLinkCta')}
                    <ArrowRight className="size-3.5" />
                </Link>
            </p>
        </div>
    )
}
