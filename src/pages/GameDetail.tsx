import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getGameById, type Game } from '../data/games'
import { useGameAuth, type GameAuth } from '../hooks/useGameAuth'
import AccountMenu from '../components/AccountMenu'
import GoogleSignInButton from '../components/GoogleSignInButton'
import DefTheBaseProfile from '../components/DefTheBaseProfile'
import JumpingJelloProfile from '../components/JumpingJelloProfile'
import ScreenshotGallery from '../components/ScreenshotGallery'
import { BackLink, FeatureList, ProductHero, SectionTitle, SpecBar } from '../components/productUi'
import { ShieldCheck } from '../components/icons'

// game id -> the component that renders that game's save data. Add an entry here
// when another game starts syncing its save to Firestore. The gate passes the
// game and the (project-specific) signed-in uid down.
const RENDERERS: Record<string, React.ComponentType<{ game: Game; uid: string }>> = {
    'def-the-base': DefTheBaseProfile,
    'jumping-jello': JumpingJelloProfile,
}

export default function GameDetail() {
    const { t } = useTranslation()
    const { gameId } = useParams()
    const game = getGameById(gameId)
    // Auth against this game's own Firebase project (per-project sign-in/out).
    const auth = useGameAuth(game?.firebaseProject)

    if (!game) return <Navigate to="/" replace />

    return (
        <div
            style={{ ['--pa' as string]: game.accent }}
            className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10"
        >
            <div className="mb-5">
                <BackLink />
            </div>

            <ProductHero
                name={t(game.nameKey)}
                tagline={t(game.taglineKey)}
                icon={game.icon}
                featureGraphic={game.featureGraphic}
                gradient={game.gradient}
                emoji={game.emoji}
                storeUrl={game.storeUrl}
                inDevelopment={game.inDevelopment}
            />

            {game.meta && <SpecBar meta={game.meta} />}

            <section className="mt-10 grid gap-8 md:grid-cols-[1.6fr_1fr]">
                <div>
                    <SectionTitle>{t('detail.aboutGame')}</SectionTitle>
                    <p className="font-sans leading-relaxed text-muted">{t(game.descriptionKey)}</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-5">
                    <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wider text-faint">
                        {t('detail.features')}
                    </h3>
                    <FeatureList items={game.featureKeys.map((k) => t(k))} />
                </div>
            </section>

            {game.screenshots?.length ? (
                <section className="mt-12">
                    <SectionTitle>{t('detail.screenshots')}</SectionTitle>
                    <ScreenshotGallery
                        shots={game.screenshots}
                        orientation="landscape"
                        name={t(game.nameKey)}
                    />
                </section>
            ) : game.inDevelopment ? (
                <WipPlaceholder />
            ) : null}

            {game.hasWebProfile && (
                <section className="mt-14">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="text-xl text-ink sm:text-2xl">{t('detail.yourProgress')}</h2>
                        {auth.user && <AccountMenu user={auth.user} onSignOut={auth.signOut} />}
                    </div>
                    <ProfileGate game={game} auth={auth} />
                </section>
            )}

            <div className="mt-14 border-t border-line pt-6">
                <Link
                    to={`/privacy/${game.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text transition-opacity hover:opacity-80"
                >
                    <ShieldCheck className="size-4" />
                    {t('detail.privacyLink')}
                </Link>
            </div>
        </div>
    )
}

// Placeholder gallery for a game that's still in development (no screenshots yet).
function WipPlaceholder() {
    const { t } = useTranslation()
    return (
        <section className="mt-12">
            <SectionTitle>{t('detail.screenshots')}</SectionTitle>
            <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-6">
                <p className="mb-5 font-sans text-sm text-muted">{t('detail.wipNote')}</p>
                <div className="no-scrollbar flex gap-4 overflow-hidden">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="aspect-video w-60 shrink-0 animate-pulse rounded-xl bg-raised"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

// Gates the game-specific data renderer behind sign-in. Auth is resolved once in
// GameDetail (against the game's own Firebase project) and passed in.
function ProfileGate({ game, auth }: { game: Game; auth: GameAuth }) {
    const { t } = useTranslation()
    const { uid, status, signIn } = auth

    if (status === 'loading') return <p className="text-muted">{t('profile.loading')}</p>
    if (status === 'needs-signin' || !uid) return <SignInPrompt game={game} signIn={signIn} />

    const Renderer = RENDERERS[game.id]
    return Renderer ? <Renderer game={game} uid={uid} /> : <Notice>{t('detail.noTracking')}</Notice>
}

function SignInPrompt({ game, signIn }: { game: Game; signIn: () => Promise<void> }) {
    const { t } = useTranslation()
    const [error, setError] = useState(false)

    async function handleSignIn() {
        setError(false)
        try {
            await signIn()
        } catch {
            setError(true)
        }
    }

    return (
        <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="mb-4 font-sans text-muted">
                {t('detail.signInPrompt', { game: t(game.nameKey) })}
            </p>
            <GoogleSignInButton onClick={handleSignIn} />
            {error && <p className="mt-3 text-sm text-danger">{t('profile.signInError')}</p>}
        </div>
    )
}

function Notice({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="font-sans text-muted">{children}</p>
        </div>
    )
}
