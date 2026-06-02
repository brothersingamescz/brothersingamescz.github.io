// Shape of the Firestore document the Def the Base game writes per player.
// Path: def_the_base/{uid}. Web reads it; the game writes it. See the Unity
// data contract for the field-by-field mapping from the in-game save classes.

export type Upgrades = Record<string, Record<string, boolean>>

export type PlayerData = {
  displayName?: string
  score?: {
    best: number
    bestWave: number
    lastScore: number
    kills: number
    structuresBuilt: number
    gold: number
  }
  state?: {
    currentWave: number
    metal: number
    mainHallHealth: number
    difficulty: string
    adGold: number
  }
  missions?: boolean[]
  upgrades?: Upgrades
}

// Upgrade tree grouped by tower. Keys match the nested keys in `upgrades`.
// Labels are resolved via i18n: profile.towers.<tower> and profile.upgrades.<item>.
export const UPGRADE_GROUPS: { tower: string; items: string[] }[] = [
  { tower: 'minigun', items: ['tier23', 'tier45', 'hp', 'dmg'] },
  { tower: 'rocket', items: ['tier2', 'tier34', 'hp', 'dmg'] },
  { tower: 'quarry', items: ['tier2', 'tier34', 'hp', 'metal'] },
  { tower: 'wall', items: ['tier23', 'tier45', 'hp1', 'hp2'] },
  { tower: 'shield', items: ['tier2', 'tier34', 'hp', 'shield', 'plus', 'max'] },
]
