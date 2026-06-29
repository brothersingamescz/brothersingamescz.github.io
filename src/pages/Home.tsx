import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { games } from '../data/games'
import { apps } from '../data/apps'
import GameCard from '../components/GameCard'
import AppCard from '../components/AppCard'
import { ArrowRight, Check, Coffee, Heart, Sparkles } from '../components/icons'
import { KOFI_URL } from '../lib/links'

export default function Home() {
    const { t } = useTranslation()

    return (
        <div>
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section className="relative">
                {/* Full-width studio banner. The 3:1 artwork has soft blurred side
                   extensions baked in, so wide displays show the blur instead of
                   hard-cropping the scenes; the centre composition (Def the Base
                   tower defence, the BiG logo, the Jumping Jello jungle and a
                   birthday candle for the Reminder app) stays intact at every width.
                   Decorative only: the brand is also in the header and the h1 below. */}
                <div className="relative overflow-hidden">
                    <img
                        src="/images/main-background-org.jpg"
                        alt=""
                        aria-hidden
                        fetchPriority="high"
                        decoding="async"
                        className="h-56 w-full object-cover object-center sm:h-72 md:h-96 lg:h-112"
                    />
                    {/* Melt the banner into the page below. */}
                    <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-base to-transparent"
                    />
                </div>

                <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-12 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-10">
                    <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs font-semibold text-muted backdrop-blur-sm">
                        <Sparkles className="size-4 text-brand-text" />
                        {t('home.hero.eyebrow')}
                    </span>

                    <h1 className="mt-6 max-w-4xl animate-fade-up text-4xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
                        {t('home.hero.titleLead')}{' '}
                        <span className="text-gradient animate-gradient glow-brand">
                            {t('home.hero.titleAccent')}
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl animate-fade-up font-sans text-lg text-muted">
                        {t('home.hero.description')}
                    </p>

                    <div className="mt-9 flex animate-fade-up flex-wrap items-center justify-center gap-3">
                        <a
                            href="#games"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:brightness-110"
                        >
                            {t('home.hero.ctaGames')}
                            <ArrowRight className="size-4" />
                        </a>
                        <a
                            href="#apps"
                            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/50"
                        >
                            {t('home.hero.ctaApps')}
                        </a>
                    </div>

                    <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
                        {['free', 'noClutter', 'czechia'].map((k) => (
                            <li key={k} className="inline-flex items-center gap-1.5">
                                <Check className="size-4 text-accent" />
                                {t(`home.hero.badges.${k}`)}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Games ────────────────────────────────────────────────────── */}
            <section id="games" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
                <SectionHeader
                    kicker={t('home.gamesTitle')}
                    title={t('home.gamesHeading')}
                    subtitle={t('home.gamesSubtitle')}
                />
                <div className="grid gap-6 sm:grid-cols-2">
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </section>

            {/* ── Apps ─────────────────────────────────────────────────────── */}
            <section id="apps" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
                <SectionHeader
                    kicker={t('home.appsTitle')}
                    title={t('home.appsHeading')}
                    subtitle={t('home.appsSubtitle')}
                />
                <div className="grid gap-6 sm:grid-cols-2">
                    {apps.map((app) => (
                        <AppCard key={app.id} app={app} />
                    ))}
                </div>
            </section>

            {/* ── Support ──────────────────────────────────────────────────── */}
            <section id="support" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-sm sm:p-12">
                    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -left-16 -top-20 size-64 rounded-full bg-brand/15 blur-3xl" />
                        <div className="absolute -bottom-24 -right-10 size-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
                    </div>
                    <div className="mx-auto max-w-xl text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-base/60 px-3.5 py-1.5 text-xs font-semibold text-muted backdrop-blur-sm">
                            <Heart className="size-4 text-brand-text" />
                            {t('home.support.kicker')}
                        </span>
                        <h2 className="mt-4 text-2xl text-ink sm:text-3xl">
                            {t('home.support.heading')}
                        </h2>
                        <p className="mt-3 font-sans text-muted">{t('home.support.subtitle')}</p>
                        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to="/support"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:brightness-110"
                            >
                                <Heart className="size-4" />
                                {t('home.support.cta')}
                            </Link>
                            <a
                                href={KOFI_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-ink backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/50"
                            >
                                <Coffee className="size-4 text-brand-text" />
                                {t('home.support.kofiCta')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function SectionHeader({
    kicker,
    title,
    subtitle,
}: {
    kicker: string
    title: string
    subtitle: string
}) {
    return (
        <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-text">
                {kicker}
            </p>
            <h2 className="mt-2 text-2xl text-ink sm:text-3xl">{title}</h2>
            <p className="mt-2 font-sans text-muted">{subtitle}</p>
        </div>
    )
}
