import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'
import type { JelloMission, JumpingJelloData } from '../lib/jumpingJello'
import { usePlayerData } from '../hooks/usePlayerData'
import { InfinityIcon, Lock, Sparkles, Star, Trash } from './icons'

// Renders the Jumping Jello save data. Assumes the player is signed in to the
// Jumping Jello Firebase project - the auth gate (in GameDetail) resolves that
// project's uid and passes it in. Importing usePlayerData (which pulls
// `firebase/firestore`) keeps this whole subtree in the lazy game-detail chunk.
export default function JumpingJelloProfile({ game, uid }: { game: Game; uid: string }) {
    const { t } = useTranslation()
    const { data, error, remove } = usePlayerData<JumpingJelloData>(game, uid)

    async function handleDelete() {
        if (!window.confirm(t('profile.deleteConfirm'))) return
        await remove()
    }

    if (error) return <p className="text-danger">{t('profile.loadError')}</p>

    if (data === undefined) return <p className="text-muted">{t('profile.loading')}</p>

    if (data === null) {
        return (
            <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="font-sans text-muted">{t('profile.empty')}</p>
            </div>
        )
    }

    const missions = data.missions ?? []
    const levelsUnlocked = missions.filter((m) => m.unlock).length
    const skins = data.skins ?? []
    const skinsUnlocked = skins.filter(Boolean).length

    return (
        <div className="space-y-8">
            <Card title={t('profile.jello.overviewTitle')}>
                <TileGrid>
                    <Tile label={t('profile.jello.stars')} value={data.totalStars} />
                    <Tile
                        label={t('profile.jello.levels')}
                        text={`${levelsUnlocked} / ${missions.length}`}
                    />
                    <Tile
                        label={t('profile.jello.skins')}
                        text={`${skinsUnlocked} / ${skins.length}`}
                    />
                    <Tile label={t('profile.jello.selectedSkin')} text={data.selectedSkin || '-'} />
                    <Tile
                        label={t('profile.jello.adsRemoved')}
                        text={t(data.adsRemoved ? 'profile.jello.yes' : 'profile.jello.no')}
                    />
                </TileGrid>
            </Card>

            <Card title={t('profile.jello.levelsTitle')}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {missions.map((mission, i) => (
                        <LevelTile key={i} index={i} mission={mission} />
                    ))}
                </div>
            </Card>

            <div className="pt-1">
                <button
                    onClick={handleDelete}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                >
                    <Trash className="size-4" />
                    {t('profile.delete')}
                </button>
            </div>
        </div>
    )
}

function LevelTile({ index, mission }: { index: number; mission: JelloMission }) {
    const { t } = useTranslation()
    const locked = !mission.unlock

    return (
        <div
            className={`rounded-2xl border border-line p-3.5 ${
                locked ? 'bg-surface/40 opacity-60' : 'bg-surface'
            }`}
        >
            <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-muted">
                    {t('profile.jello.level')} {index + 1}
                </span>
                {mission.isInfinity ? (
                    <InfinityIcon
                        className="size-4 text-pink-400"
                        label={t('profile.jello.endless')}
                    />
                ) : mission.maxSkins > 0 ? (
                    <span className="inline-flex items-center gap-1 font-sans text-xs text-faint">
                        <Sparkles className="size-3.5" />
                        {mission.skins}/{mission.maxSkins}
                    </span>
                ) : null}
            </div>

            {locked ? (
                <div className="mt-2 flex items-center gap-1.5 text-faint">
                    <Lock className="size-4" />
                    <span className="font-sans text-sm">{t('profile.jello.locked')}</span>
                </div>
            ) : mission.isInfinity ? (
                <div className="mt-2">
                    <div className="font-sans text-xl font-bold tabular-nums text-ink">
                        ∞ {mission.infinityCount.toLocaleString()}
                    </div>
                    <div className="font-sans text-xs text-faint">{t('profile.jello.endless')}</div>
                </div>
            ) : (
                <div className="mt-2">
                    <div className="flex items-center gap-1 font-sans text-sm font-semibold text-amber-400">
                        <Star className="size-4" />
                        {mission.stars}/{mission.maxStars}
                    </div>
                    <ProgressBar percent={mission.sliderPercent} />
                </div>
            )}
        </div>
    )
}

function ProgressBar({ percent }: { percent: number }) {
    const clamped = Math.max(0, Math.min(100, percent))
    return (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-raised">
            <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-pink-500"
                style={{ width: `${clamped}%` }}
            />
        </div>
    )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h3 className="mb-3 text-lg text-ink">{title}</h3>
            {children}
        </section>
    )
}

function TileGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
}

function Tile({ label, value, text }: { label: string; value?: number; text?: string }) {
    const display =
        text !== undefined ? text : value !== undefined ? Math.round(value).toLocaleString() : '-'
    return (
        <div className="rounded-2xl border border-line bg-surface p-3.5">
            <div className="font-sans text-xs text-faint">{label}</div>
            <div className="mt-1 font-sans text-xl font-bold tabular-nums text-ink">{display}</div>
        </div>
    )
}
