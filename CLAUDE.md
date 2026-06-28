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

For local dev against Firebase, copy `.env.example` to `.env.local` and fill in the `VITE_FB_*` values. These are **not secrets** (the Firebase web config is public by design); data is protected by Auth + Firestore rules. Each game writes to its **own** Firebase project, so the config is namespaced per project: `VITE_FB_DEF_THE_BASE_*` (primary) and `VITE_FB_JUMPING_JELLO_*` (secondary). See _Multi-project Firebase_ below.

## What this is

Marketing / privacy-policy / player-profile site for the BrothersInGames indie studio. Deployed to GitHub Pages (custom domain, `base: '/'`) on every push to `main` via `.github/workflows/deploy.yml`, which injects the `VITE_FB_*` secrets at build time.

Stack: React 19 + TypeScript + Vite 6 + Tailwind v4 + react-router-dom v7 + i18next + Firebase.

## Architecture

**Routing** — `src/App.tsx` defines all routes under a single `Layout` shell (`src/components/Layout.tsx`). The game-detail page (`/games/:gameId`) is `lazy()`-loaded so the heavy `firebase/firestore` SDK (plus the per-project auth it needs) only ships when a player opens it. Unknown paths redirect to `/`.

Routes:

- `/` — Home (studio landing; **Games** section + **Apps** section + **Support** band)
- `/support` — donation page (`Support.tsx`); a Ko-fi call-to-action only, no Firebase. Links to `/contact` for help requests.
- `/contact` — contact page (`Contact.tsx`); a bug/question/idea form (name, email, topic, message) posted to **Web3Forms** (hosted form-to-email relay, so the static site needs no backend) plus an email fallback, no Firebase. Reads a `?app=<id>` query param (set when an app/game deep-links its "Contact support" button) and tags the email subject + a hidden field with the source, resolved against `apps.ts`/`games.ts`.
- `/games/:gameId` — per-game progress detail (lazy; Firestore + per-project sign-in only here)
- `/apps/:appId` — per-app detail (`AppDetail.tsx`); non-game apps, no Firebase — just a marketing card + "coming soon" + link to the app's policy
- `/privacy` — index linking the per-game **and** per-app policies (split into Games/Apps sections)
- `/privacy/web` — the **website's own** privacy policy (`WebsitePrivacy.tsx`); static route, ranks above `:game`
- `/privacy/birthday-reminder` — the Birthday and Name Day Reminder **app** privacy policy (`AppPrivacyPolicy.tsx`); static route, ranks above `:game`
- `/privacy/:game` — per-game privacy policy (`PrivacyPolicy.tsx`)
- `/dashboard`, `/dashboard/:gameId`, `/account`, `/profile` — redirect to `/` (old bookmarks)

**GitHub Pages deep-linking (three coordinated pieces — read all three before touching any).** GitHub Pages has no server-side SPA rewrite, so:

1. `public/404.html` encodes the requested path into a `?/...` query and redirects to the index (the classic spa-github-pages trick).
2. The inline script in `index.html` decodes that query back into the real path.
3. The `spa-fallback` plugin in `vite.config.ts` copies `dist/index.html` into a real subdirectory for each route in the `spaRoutes` array, so direct hits return **HTTP 200**. This matters because the 404.html trick returns a 404 status, which bots that check status codes (e.g. Google Play Console verifying privacy URLs) reject. **When you add a new top-level route, add it to `spaRoutes` in `vite.config.ts`.** Dynamic segments (`:gameId`, `:game`) must be listed individually (e.g. `games/def-the-base`).

**Auth — global primary listener + per-project sessions.** `src/components/AuthProvider.tsx` owns one `onAuthStateChanged` listener on the **primary** project and feeds `AuthContext`; `src/hooks/useAuth.ts` exports `useAuth()`, `googleSignIn(auth)` / `signInWithGoogle()` (popup→redirect fallback), and `signOut()`. Because auth is per Firebase project (see _Multi-project Firebase_), the sign-in/out UI lives **on each game's detail page**, not in the header: `src/hooks/useGameAuth.ts` wraps the right project's session (`{ user, uid, status, signIn, signOut }`), and `src/components/AccountMenu.tsx` (rendered in `GameDetail`, above the banner since the banner clips overflow) shows who's signed in + a sign-out. There is no `/account` page and no header account menu — the header is just nav + language.

**Firebase module split — Firestore stays lazy.** The global auth header needs `firebase/auth` on every page, so that goes in `src/lib/firebase.ts`. `firebase/firestore` lives in `src/lib/firestore.ts` and is imported only via `src/hooks/usePlayerData.ts`, keeping it out of the main bundle. Verify the split with the bundle output: `firebase/firestore`'s endpoint (`firestore.googleapis.com`) should appear only in the `GameDetail` chunk.

**Multi-project Firebase — auth & data are per project.** Each game's Unity build writes its save to a **separate Firebase project**, so the website talks to more than one. `src/lib/firebase.ts` holds the **primary** project (Def the Base), used for the global header sign-in. Secondary projects (currently Jumping Jello) are configured in `src/lib/firebaseProjects.ts` and initialized lazily as named apps via `appFor(key)` / `authFor(key)` — only on that game's (lazy) detail route. A `Game` gets `firebaseProject?: FirebaseProjectKey` (omitted = primary).

Because Firebase Auth — and therefore the player **UID** — is per project, the global session can't read another project's Firestore (a token from project A fails project B's rules, and the same Google account has a different UID in each). So each game signs in against **its own** project: `src/hooks/useGameAuth.ts` returns `{ uid, status, signIn }` for a game's project (primary games delegate to the global `useAuth()`; secondary games own a listener + sign-in). `GameDetail`'s gate resolves this and passes `game` + the project-specific `uid` to the renderer; `usePlayerData(game, uid)` then reads `{game.firestoreCollection}/{uid}` from `dbFor(game.firebaseProject)`. **Adding a game on a new project:** add its config to `firebaseProjects.ts`, its env vars (6×, namespaced) to `.env.example` + `deploy.yml`, and `firebaseProject` to its `games.ts` entry. In that project's Firebase console, enable Google sign-in, add the site's domain to **Authorized domains**, and deploy a Firestore rule for its collection.

**Player data hook** — `src/hooks/usePlayerData.ts` (`usePlayerData(game, uid)`) reads (and can delete) the Firestore document at `{game.firestoreCollection}/{uid}` in that game's project (`dbFor(game.firebaseProject)`); the `uid` comes from the game's own session (see `useGameAuth`). States: `undefined` = loading, `null` = document not found, `T` = data. The Unity game **writes** the document; this site only **reads** it (and lets the player delete it). Each project's `firestore.rules` restricts a player to their own document and is deployed manually via the Firebase console, not by CI.

**The data contract** — each web-profile game has its own save-shape type mirroring its Unity save classes: `src/lib/player.ts` (`PlayerData`, `UPGRADE_GROUPS`) for Def the Base, `src/lib/jumpingJello.ts` (`JumpingJelloData`, `JelloMission`) for Jumping Jello. If a game's save format changes, its type changes with it. For Def the Base the `UPGRADE_GROUPS` keys must match both the nested keys in the `upgrades` map and the i18n keys (`profile.towers.<tower>`, `profile.upgrades.<item>`).

**Game registry** — `src/data/games.ts` is the single source of truth for all games. Each `Game` entry has:

- `id` — URL slug (e.g. `def-the-base`)
- `nameKey` / `taglineKey` — i18n keys
- `emoji` + `gradient` — cover-art placeholder until real artwork exists (Tailwind `bg-linear-to-br` gradient)
- `storeUrl` — add to flip the homepage card from "coming soon" to a store link
- `hasWebProfile` + `firestoreCollection` — controls whether **this site reads/renders** a game's save data (Def the Base and Jumping Jello today). Website-only; what each game's Unity build actually ships is in _Per-game services & data flow_ below.
- `firebaseProject` — set when the game's save lives in a **secondary** Firebase project (see _Multi-project Firebase_); omitted = primary.

When a game gains web save-data support, add `hasWebProfile: true, firestoreCollection: 'collection_name'` (plus `firebaseProject` if it's on a new project) to its entry in `games.ts`, add a renderer component (e.g. `src/components/DefTheBaseProfile.tsx`) that takes `{ game, uid }` and calls `usePlayerData(game, uid)`, and register it in the `RENDERERS` map in `src/pages/GameDetail.tsx`. If it's on a new Firebase project, also follow the _Multi-project Firebase_ steps. Per-game privacy policy variants are configured separately in `GAME_CONFIGS` inside `src/pages/PrivacyPolicy.tsx`.

**App registry (non-game)** — `src/data/apps.ts` is the parallel source of truth for non-game **apps** (currently Birthday and Name Day Reminder). Kept deliberately separate from `games.ts`: apps carry **none** of the Firebase / web-profile / per-project-auth machinery — an `App` is just `{ id, nameKey, taglineKey, emoji, gradient, storeUrl? }`. They render on Home's **Apps** section via `src/components/AppCard.tsx` (links to `/apps/:id`, "coming soon" badge) and have a detail page `src/pages/AppDetail.tsx` (banner + "coming soon" + link to the policy). i18n lives under `apps.*` (name) and `apps.taglines.*`. **Adding an app:** add an entry to `apps.ts`, its name/tagline to both locales, and — if it ships a privacy policy — a dedicated page on a static `/privacy/<id>` route (see _App privacy policy_ below) plus `apps/<id>` and `privacy/<id>` in `spaRoutes`.

**App privacy policy.** Birthday and Name Day Reminder's data stack is unrelated to the games' (offline-first local storage, optional **Google Drive `drive.appdata`** backup of text records only, **Google AdMob** + UMP consent for EU/EEA, device permissions), so it gets its **own** page `src/pages/AppPrivacyPolicy.tsx` on the static route `/privacy/birthday-reminder` (ranks above `:game`), with its own i18n namespace `privacyApp.*` — the same pattern as `WebsitePrivacy.tsx`. It is **not** part of `GAME_CONFIGS`/`privacy.*`. Controller defaults: BrothersInGames · brothersingamescz@gmail.com · Czech Republic.

**Per-game services & data flow (drives the privacy policy).** Both games' Unity builds ship the same stack, so `src/pages/PrivacyPolicy.tsx` and the `privacy.*` i18n keys must disclose all of it:

- **Ads** — Unity LevelPlay (ironSource mediation, incl. Unity Ads); collects the device advertising ID.
- **Cloud save — two stores.** Google Play Games (Saved Games), linked to the player's Google account, _and_ a copy the game writes to Firebase Cloud Firestore. This website reads only the Firestore copy (after Firebase Auth Google sign-in) and can delete it.
- **Auth** — Firebase Authentication (Google), used both in-game (to write Firestore) and on the website (to read it).
- **In-app purchases** — Jumping Jello only (`hasIAP` in `GAME_CONFIGS`): Unity IAP via Google Play Billing.

Two deletion paths follow: the Google Play Games app (Saved Games, both games) and the website's "Delete my data" button (Firestore copy, web-profile games only), plus an email fallback. Keep this section, the `Game` entry, and `GAME_CONFIGS` in sync whenever a game's shipped SDKs change.

**Website privacy policy.** Separate from the per-game policies above, `src/pages/WebsitePrivacy.tsx` (`/privacy/web`, reached from the `/privacy` index — the footer links **Support · Contact · Privacy**, not the website policy directly) is the **site's own** policy — sign-in, the save-data copy the site reads/deletes, GitHub Pages hosting, the **Web3Forms** contact form on `/contact`, no analytics/ads. Its i18n keys live under `privacyWeb.*` (kept apart from the per-game `privacy.*`). It's the URL to set as each Firebase project's OAuth-consent-screen privacy link.

**i18n** — All user-facing text is keyed and resolved with `useTranslation`/`t()`. Two locales (`en`, `cs`) in `src/locales/*/translation.json` that **must stay in sync** — add every new string to both files. Detection order is localStorage then navigator (`src/i18n.ts`). Taglines are under `games.taglines.*` (not nested under `games.<name>`) so that `t(game.nameKey)` keeps returning a plain string.

**Styling** — Tailwind v4 via the `@tailwindcss/vite` plugin (CSS-first; there is no `tailwind.config`). Use `bg-linear-to-*` for gradients (v4 renamed `bg-gradient-to-*`). Dark slate theme with indigo accents.
