# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (CI uses pnpm 9 with `--frozen-lockfile`).

- `pnpm dev` — start the Vite dev server
- `pnpm build` — `tsc -b` (TS project-references build) then `vite build`; also runs the `spa-fallback` plugin (see below)
- `pnpm lint` — ESLint over the repo
- `pnpm format` — Prettier write
- `pnpm preview` — serve the production build locally

There is no test runner configured.

For local dev against Firebase, copy `.env.example` to `.env.local` and fill in the `VITE_FB_*` values. These are **not secrets** (the Firebase web config is public by design); data is protected by Auth + Firestore rules.

## What this is

Marketing / privacy-policy / player-profile site for the BrothersInGames indie studio. Deployed to GitHub Pages (custom domain, `base: '/'`) on every push to `main` via `.github/workflows/deploy.yml`, which injects the `VITE_FB_*` secrets at build time.

Stack: React 19 + TypeScript + Vite 6 + Tailwind v4 + react-router-dom v7 + i18next + Firebase.

## Architecture

**Routing** — `src/App.tsx` defines all routes under a single `Layout` shell (`src/components/Layout.tsx`). The game-detail page (`/dashboard/:gameId`) is `lazy()`-loaded so the heavy `firebase/firestore` SDK only ships when a player opens it. Unknown paths redirect to `/`.

Routes:
- `/` — Home (studio landing, game cards)
- `/dashboard` — player game dashboard (game list, cover-art cards)
- `/dashboard/:gameId` — per-game progress detail (lazy; Firestore only here)
- `/account` — sign-in / account page
- `/privacy` / `/privacy/:game` — privacy policies
- `/profile` — redirects to `/dashboard` (old bookmarks)

**GitHub Pages deep-linking (three coordinated pieces — read all three before touching any).** GitHub Pages has no server-side SPA rewrite, so:
1. `public/404.html` encodes the requested path into a `?/...` query and redirects to the index (the classic spa-github-pages trick).
2. The inline script in `index.html` decodes that query back into the real path.
3. The `spa-fallback` plugin in `vite.config.ts` copies `dist/index.html` into a real subdirectory for each route in the `spaRoutes` array, so direct hits return **HTTP 200**. This matters because the 404.html trick returns a 404 status, which bots that check status codes (e.g. Google Play Console verifying privacy URLs) reject. **When you add a new top-level route, add it to `spaRoutes` in `vite.config.ts`.** Dynamic segments (`:gameId`, `:game`) must be listed individually (e.g. `dashboard/def-the-base`).

**Auth — single listener via context.** `src/components/AuthProvider.tsx` owns one `onAuthStateChanged` listener and feeds `AuthContext`. `src/hooks/useAuth.ts` exports `useAuth()` (the hook), `signInWithGoogle()` (popup→redirect fallback), and `signOut()`. `<AuthProvider>` wraps the entire `<Routes>` tree in `App.tsx`. This avoids duplicate listeners when multiple components (header, account page, game detail) all need the auth state.

**Firebase module split — Firestore stays lazy.** The global auth header needs `firebase/auth` on every page, so that goes in `src/lib/firebase.ts`. `firebase/firestore` lives in `src/lib/firestore.ts` and is imported only via `src/hooks/usePlayerData.ts`, keeping it out of the main bundle. Verify the split with the bundle output: `firebase/firestore`'s endpoint (`firestore.googleapis.com`) should appear only in the `GameDetail` chunk.

**Player data hook** — `src/hooks/usePlayerData.ts` reads (and can delete) a Firestore document at `{collection}/{uid}`. States: `undefined` = loading, `null` = document not found, `T` = data. The Unity game **writes** the document; this site only **reads** it (and lets the player delete it). `firestore.rules` restricts each player to their own document and is deployed manually via the Firebase console, not by CI.

**The data contract** — `src/lib/player.ts` (`PlayerData`, `UPGRADE_GROUPS`) mirrors the Unity game's save classes. If the game's save format changes, this type and the upgrade-group keys must change with it; the `UPGRADE_GROUPS` keys must match both the nested keys in the `upgrades` map and the i18n keys (`profile.towers.<tower>`, `profile.upgrades.<item>`).

**Game registry** — `src/data/games.ts` is the single source of truth for all games. Each `Game` entry has:
- `id` — URL slug (e.g. `def-the-base`)
- `nameKey` / `taglineKey` — i18n keys
- `emoji` + `gradient` — cover-art placeholder until real artwork exists (Tailwind `bg-linear-to-br` gradient)
- `storeUrl` — add to flip the homepage card from "coming soon" to a store link
- `hasWebProfile` + `firestoreCollection` — controls whether **this site reads/renders** a game's save data (currently only Def the Base). This flag is website-only; what each game's Unity build actually ships is in *Per-game services & data flow* below.

When a game gains web save-data support, add `hasWebProfile: true, firestoreCollection: 'collection_name'` to its entry in `games.ts`, add a renderer component (e.g. `src/components/DefTheBaseProfile.tsx`), and register it in the `RENDERERS` map in `src/pages/GameDetail.tsx`. Per-game privacy policy variants are configured separately in `GAME_CONFIGS` inside `src/pages/PrivacyPolicy.tsx`.

**Per-game services & data flow (drives the privacy policy).** Both games' Unity builds ship the same stack, so `src/pages/PrivacyPolicy.tsx` and the `privacy.*` i18n keys must disclose all of it:
- **Ads** — Unity LevelPlay (ironSource mediation, incl. Unity Ads); collects the device advertising ID.
- **Cloud save — two stores.** Google Play Games (Saved Games), linked to the player's Google account, *and* a copy the game writes to Firebase Cloud Firestore. This website reads only the Firestore copy (after Firebase Auth Google sign-in) and can delete it.
- **Auth** — Firebase Authentication (Google), used both in-game (to write Firestore) and on the website (to read it).
- **In-app purchases** — Jumping Jello only (`hasIAP` in `GAME_CONFIGS`): Unity IAP via Google Play Billing.

Two deletion paths follow: the Google Play Games app (Saved Games, both games) and the website's "Delete my data" button (Firestore copy, web-profile games only), plus an email fallback. Keep this section, the `Game` entry, and `GAME_CONFIGS` in sync whenever a game's shipped SDKs change.

**i18n** — All user-facing text is keyed and resolved with `useTranslation`/`t()`. Two locales (`en`, `cs`) in `src/locales/*/translation.json` that **must stay in sync** — add every new string to both files. Detection order is localStorage then navigator (`src/i18n.ts`). Taglines are under `games.taglines.*` (not nested under `games.<name>`) so that `t(game.nameKey)` keeps returning a plain string.

**Styling** — Tailwind v4 via the `@tailwindcss/vite` plugin (CSS-first; there is no `tailwind.config`). Use `bg-linear-to-*` for gradients (v4 renamed `bg-gradient-to-*`). Dark slate theme with indigo accents.
