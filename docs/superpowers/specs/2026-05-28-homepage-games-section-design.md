# Design: Homepage games section + footer

**Date:** 2026-05-28
**Status:** Approved

## Context

The site currently has a minimal home page (welcome heading + subtitle) with no content about the studio's games. Two games exist — Def the Base and Jumping Jello — both currently unavailable on the Play Store. The goal is to make the home page useful and presentable now, with a clear path to enrich game cards when the games are published.

## Scope

- Improve Home page: hero + game cards
- Add Footer with contact email
- Add a `games.ts` data config so adding/updating a game is a one-liner
- No new routes (no `/games` page — redundant for 2 games shown on home)
- Navbar unchanged: Home · Privacy · EN/CS

## Out of scope

- Screenshots, store links, ratings — added later when games are live
- `/games` route — reconsidered once games are published

## Design

### `src/data/games.ts`

Single source of truth for game data. Each game has:

```ts
type Game = {
  id: string           // used as React key
  nameKey: string      // i18n key → translated name
  emoji: string        // temporary stand-in until real icon/screenshot
  storeUrl?: string    // undefined = show "Brzy/Coming soon" badge, no link
}
```

Initial data:
```ts
export const games: Game[] = [
  { id: 'def-the-base',   nameKey: 'games.defTheBase',   emoji: '🎮' },
  { id: 'jumping-jello',  nameKey: 'games.jumpingJello',  emoji: '🍮' },
]
```

When a game ships: add `storeUrl: 'https://play.google.com/...'`. The card automatically switches from badge to link.

### `src/pages/Home.tsx`

Two sections:
1. **Hero** — centered, full-height-ish. Studio name, tagline, short description. All text from i18n.
2. **Games grid** — 2-column grid of `GameCard` components rendered from `games` array.

### `src/components/GameCard.tsx`

New component. Props: `game: Game`. Renders:
- Emoji (large, centered)
- Translated game name
- If `storeUrl` present: Google Play badge linking out (`target="_blank"`)
- If no `storeUrl`: green "Brzy / Coming soon" badge, no link

Styling: `bg-slate-900 border border-slate-800 rounded-lg`, matches existing card style from PrivacyPolicy.

### `src/components/Footer.tsx`

Simple one-liner footer: `brothersingamescz@gmail.com` as a `mailto:` link. Centered, `text-slate-500`, `border-t border-slate-800`.

### `src/components/Layout.tsx`

Add `<Footer />` below `<Outlet />`.

### i18n keys

`privacy.games.defTheBase` / `privacy.games.jumpingJello` already exist in both locales. Move them to a top-level `games` namespace so they're not coupled to the privacy section, and update `PrivacyPolicy.tsx` + `PrivacyIndex.tsx` to use the new path.

Keys added:
```json
{
  "home": {
    "gamesTitle": "Hry / Games",
    "comingSoon": "Brzy"
  },
  "games": {
    "defTheBase": "Def the Base",
    "jumpingJello": "Jumping Jello"
  }
}
```

Keys removed from both locales: `privacy.games.defTheBase`, `privacy.games.jumpingJello`.

## Files changed

| File | Change |
|---|---|
| `src/data/games.ts` | New — game config |
| `src/components/GameCard.tsx` | New — card component |
| `src/components/Footer.tsx` | New — email footer |
| `src/pages/Home.tsx` | Rewrite — hero + game grid |
| `src/components/Layout.tsx` | Add `<Footer />` |
| `src/locales/en/translation.json` | Add `home.gamesTitle`, `home.comingSoon`, `games.*`; remove `privacy.games.*` |
| `src/locales/cs/translation.json` | Same in Czech |
| `src/pages/PrivacyPolicy.tsx` | Update key paths: `privacy.games.X` → `games.X` |
| `src/pages/PrivacyIndex.tsx` | Update key paths: `privacy.games.X` → `games.X` |

## Future: when a game ships

1. Open `src/data/games.ts`
2. Add `storeUrl: 'https://play.google.com/store/apps/details?id=...'`
3. Optionally add `imageUrl` field and update `GameCard` to show a screenshot

## Verification

- `pnpm dev` → home shows hero + two "Brzy" cards
- Switch to CS → all text in Czech
- Footer visible on all routes
- `pnpm build` → no TS errors
