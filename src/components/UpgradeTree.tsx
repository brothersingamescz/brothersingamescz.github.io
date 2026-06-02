import { useTranslation } from 'react-i18next'
import { UPGRADE_GROUPS, type Upgrades } from '../lib/player'

export default function UpgradeTree({ upgrades }: { upgrades?: Upgrades }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {UPGRADE_GROUPS.map((group) => (
        <div key={group.tower}>
          <h3 className="mb-2 text-sm font-semibold text-slate-300">
            {t(`profile.towers.${group.tower}`)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              const unlocked = Boolean(upgrades?.[group.tower]?.[item])
              return (
                <span
                  key={item}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                    unlocked
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                      : 'border-slate-800 bg-slate-900 text-slate-600'
                  }`}
                >
                  <span aria-hidden>{unlocked ? '✓' : '🔒'}</span>
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
