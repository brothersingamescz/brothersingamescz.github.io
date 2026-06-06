// Shape of the Firestore document the Jumping Jello game writes per player.
// Path: jumping_jello/{uid}. Web reads it; the game writes it. Kept separate
// from player.ts (which mirrors Def the Base's save classes) because the two
// games have unrelated save formats.

// One level/mission entry. Missions 0–7 are normal levels (maxStars 10);
// 8–11 are endless levels (isInfinity, maxStars 0, infinityCount = best run).
export type JelloMission = {
  stars: number
  maxStars: number
  skins: number
  maxSkins: number
  sliderPercent: number // 0–100 level completion
  unlock: boolean
  isInfinity: boolean
  infinityCount: number
}

export type JumpingJelloData = {
  displayName?: string
  adsRemoved?: boolean
  selectedSkin?: string
  totalStars?: number
  missions?: JelloMission[]
  skins?: boolean[] // global skin unlocks
  savedAt?: string
}
