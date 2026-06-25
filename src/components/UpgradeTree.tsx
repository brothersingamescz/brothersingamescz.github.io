import { useTranslation } from 'react-i18next'
import { UPGRADE_GROUPS, type Upgrades } from '../lib/player'
import { Check, Lock } from './icons'

export default function UpgradeTree({ upgrades }: { upgrades?: Upgrades }) {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            {UPGRADE_GROUPS.map((group) => (
                <div key={group.tower}>
                    <h4 className="mb-2 font-sans text-sm font-semibold text-muted">
                        {t(`profile.towers.${group.tower}`)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => {
                            const unlocked = Boolean(upgrades?.[group.tower]?.[item])
                            return (
                                <span
                                    key={item}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs ${
                                        unlocked
                                            ? 'border-pa/40 bg-pa/10 text-pa'
                                            : 'border-line bg-surface text-faint'
                                    }`}
                                >
                                    {unlocked ? (
                                        <Check className="size-3.5" />
                                    ) : (
                                        <Lock className="size-3.5" />
                                    )}
                                    {t(`profile.upgrades.${item}`)}
                                </span>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
