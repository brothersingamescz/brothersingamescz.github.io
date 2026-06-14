import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'
import type { JelloMission, JumpingJelloData } from '../lib/jumpingJello'
import { usePlayerData } from '../hooks/usePlayerData'

// Renders the Jumping Jello save data. Assumes the player is signed in to the
// Jumping Jello Firebase project — the auth gate (in GameDetail) resolves that
// project's uid and passes it in. Importing usePlayerData (which pulls
// `firebase/firestore`) keeps this whole subtree in the lazy game-detail chunk.
export default function JumpingJelloProfile({ game, uid }: { game: Game; uid: string }) {
    const { t } = useTranslation()
    const { data, error, remove } = usePlayerData<JumpingJelloData>(game, uid)

    async function handleDelete() {
        if (!window.confirm(t('profile.deleteConfirm'))) return
        await remove()
    }

    if (error) return <p className="text-red-400">{t('profile.loadError')}</p>

    if (data === undefined) return <p className="text-slate-400">{t('profile.loading')}</p>

    if (data === null) {
        return (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <p className="text-slate-300">{t('profile.empty')}</p>
            </div>
        )
    }

    const missions = data.missions ?? []
    const levelsUnlocked = missions.filter((m) => m.unlock).length
    const skins = data.skins ?? []
    const skinsUnlocked = skins.filter(Boolean).length

    return (
        <div className="space-y-6">
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
                    <Tile label={t('profile.jello.selectedSkin')} text={data.selectedSkin || '—'} />
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

            <div className="pt-2">
                <button
                    onClick={handleDelete}
                    className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
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
            className={`rounded-lg border border-slate-800 p-3 ${
                locked ? 'bg-slate-900/50 opacity-60' : 'bg-slate-900'
            }`}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                    {t('profile.jello.level')} {index + 1}
                </span>
                {mission.isInfinity ? (
                    <span
                        className="text-xs text-pink-400"
                        title={t('profile.jello.endless')}
                        aria-hidden
                    >
                        ∞
                    </span>
                ) : mission.maxSkins > 0 ? (
                    <span className="text-xs text-slate-500" title={t('profile.jello.skins')}>
                        🎨 {mission.skins}/{mission.maxSkins}
                    </span>
                ) : null}
            </div>

            {locked ? (
                <div className="mt-2 flex items-center gap-1.5 text-slate-600">
                    <span aria-hidden>🔒</span>
                    <span className="text-sm">{t('profile.jello.locked')}</span>
                </div>
            ) : mission.isInfinity ? (
                <div className="mt-2">
                    <div className="text-xl font-bold text-slate-100">
                        ∞ {mission.infinityCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">{t('profile.jello.endless')}</div>
                </div>
            ) : (
                <div className="mt-2">
                    <div className="text-sm font-semibold text-amber-300">
                        <span aria-hidden>⭐</span> {mission.stars}/{mission.maxStars}
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
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
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
            <h2 className="mb-3 text-lg font-semibold text-slate-100">{title}</h2>
            {children}
        </section>
    )
}

function TileGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
}

function Tile({ label, value, text }: { label: string; value?: number; text?: string }) {
    const display =
        text !== undefined ? text : value !== undefined ? Math.round(value).toLocaleString() : '—'
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1 text-xl font-bold text-slate-100">{display}</div>
        </div>
    )
}
