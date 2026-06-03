# Design: Merge Home + Dashboard — Remove Dashboard page

**Date:** 2026-06-03  
**Status:** Approved

## Summary

The Home page and Dashboard page are redundant — both show a list of games. This change merges them: the Dashboard page is removed and the Home page gains the richer, interactive game cards previously found on Dashboard. The per-game progress detail route moves from `/dashboard/:gameId` to `/games/:gameId`.

## Routing Changes

| Old URL | New URL | Behaviour |
|---|---|---|
| `/dashboard` | — | redirect → `/` (explicit route) |
| `/dashboard/:gameId` | — | redirect → `/` (catch-all, no public links yet) |
| `/games/:gameId` | new | GameDetail page (lazy, Firestore) |
| `/profile` | — | redirect → `/` (was already redirecting to `/dashboard`) |

### `spaRoutes` in `vite.config.ts`

Remove: `'dashboard'`, `'dashboard/def-the-base'`, `'dashboard/jumping-jello'`  
Add: `'games/def-the-base'`, `'games/jumping-jello'`

`'profile'` stays in `spaRoutes` so the old `/profile` path still returns HTTP 200 before the client-side redirect fires.

## Home Page (`src/pages/Home.tsx`)

Hero section (h1 + subtitle + description) is unchanged.

Games section below: replace `GameCard` with `GameCard` (renamed from `DashboardGameCard`) — each card links to `/games/:gameId`. The section heading (`home.gamesTitle` i18n key) stays.

## Component Changes

| Component | Action |
|---|---|
| `src/components/DashboardGameCard.tsx` | Rename to `GameCard.tsx`; update internal `Link to` from `/dashboard/${game.id}` → `/games/${game.id}` |
| `src/components/GameCard.tsx` (old) | Delete — replaced by renamed DashboardGameCard |

## Navigation (`src/components/Layout.tsx`)

Remove the "Dashboard" `<NavLink to="/dashboard">` entry. No other nav changes.

## Pages

| File | Action |
|---|---|
| `src/pages/Dashboard.tsx` | Delete |
| `src/pages/GameDetail.tsx` | No changes to file; only its route path changes |

## i18n Keys

Keys to **remove** from both `en` and `cs` `translation.json`:
- `dashboard.title`
- `dashboard.subtitle`

Keys to **keep** (still used by the renamed GameCard):
- `dashboard.viewProgress`
- `dashboard.comingSoon`

## App.tsx Route Tree (after)

```
/                   → Home
/games/:gameId      → GameDetail (lazy)
/privacy            → PrivacyIndex
/privacy/:game      → PrivacyPolicy
/account            → Account
/profile            → redirect → /
/dashboard          → redirect → /
/dashboard/:gameId  → redirect → /games/:gameId  (handled client-side by catch-all → /)
*                   → redirect → /
```

> Note: `/dashboard/:gameId` old links will land on `/` (not `/games/:gameId`) because the redirect is catch-all, not path-preserving. This is acceptable — there are no public links to these URLs yet.

## Out of Scope

- No changes to GameDetail page content or Firestore logic
- No redesign of Home hero or layout proportions
- No changes to PrivacyPolicy, Account, or Footer
