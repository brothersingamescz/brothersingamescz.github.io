import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'
import type { PlayerData } from '../lib/player'
import { usePlayerData } from '../hooks/usePlayerData'
import UpgradeTree from './UpgradeTree'

// Renders the Def the Base save data. Assumes the player is signed in — the
// auth gate (in GameDetail) resolves the project-specific uid and passes it in.
// Importing usePlayerData (which pulls `firebase/firestore`) keeps this whole
// subtree in the lazy game-detail chunk.
export default function DefTheBaseProfile({ game, uid }: { game: Game; uid: string }) {
    const { t } = useTranslation()
    const { data, error, remove } = usePlayerData<PlayerData>(game, uid)

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

    const missionsDone = data.missions?.filter(Boolean).length ?? 0
    const missionsTotal = data.missions?.length ?? 0

    return (
        <div className="space-y-6">
            <Card title={t('profile.scoreTitle')}>
                <TileGrid>
                    <Tile label={t('profile.score.best')} value={data.score?.best} />
                    <Tile label={t('profile.score.bestWave')} value={data.score?.bestWave} />
                    <Tile label={t('profile.score.lastScore')} value={data.score?.lastScore} />
                    <Tile label={t('profile.score.kills')} value={data.score?.kills} />
                    <Tile
                        label={t('profile.score.structuresBuilt')}
                        value={data.score?.structuresBuilt}
                    />
                    <Tile label={t('profile.score.gold')} value={data.score?.gold} />
                </TileGrid>
            </Card>

            <Card title={t('profile.stateTitle')}>
                <TileGrid>
                    <Tile label={t('profile.state.currentWave')} value={data.state?.currentWave} />
                    <Tile
                        label={t('profile.state.difficulty')}
                        text={
                            data.state?.difficulty
                                ? t(
                                      `profile.difficulty.${data.state.difficulty}`,
                                      data.state.difficulty
                                  )
                                : undefined
                        }
                    />
                    <Tile label={t('profile.state.metal')} value={data.state?.metal} />
                    <Tile
                        label={t('profile.state.mainHallHealth')}
                        value={data.state?.mainHallHealth}
                    />
                    <Tile label={t('profile.state.adGold')} value={data.state?.adGold} />
                    <Tile
                        label={t('profile.missions')}
                        text={`${missionsDone} / ${missionsTotal}`}
                    />
                </TileGrid>
            </Card>

            <Card title={t('profile.upgradesTitle')}>
                <UpgradeTree upgrades={data.upgrades} />
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
