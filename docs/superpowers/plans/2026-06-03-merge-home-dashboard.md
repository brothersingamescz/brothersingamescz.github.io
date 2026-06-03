# Merge Home + Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Dashboard list page and move its interactive game cards onto the Home page; rename the game-detail route from `/dashboard/:gameId` to `/games/:gameId`.

**Architecture:** The existing `DashboardGameCard` component becomes the sole `GameCard` component (link target updated to `/games/:gameId`). All `to="/dashboard"` references across the app are updated to `to="/"`. The `Dashboard` page and old simple `GameCard` component are deleted. `spaRoutes` in `vite.config.ts` is updated to reflect the new `/games/*` paths.

**Tech Stack:** React 19, TypeScript, react-router-dom v7, Tailwind v4, i18next, Vite 6

---

## File Map

| Action | File |
|---|---|
| Create | `src/components/GameCard.tsx` (replaces DashboardGameCard) |
| Delete | `src/components/DashboardGameCard.tsx` |
| Delete | `src/components/GameCard.tsx` (old simple version, replaced above) |
| Delete | `src/pages/Dashboard.tsx` |
| Modify | `src/pages/Home.tsx` |
| Modify | `src/pages/GameDetail.tsx` |
| Modify | `src/pages/Account.tsx` |
| Modify | `src/components/AccountMenu.tsx` |
| Modify | `src/components/Layout.tsx` |
| Modify | `src/App.tsx` |
| Modify | `vite.config.ts` |
| Modify | `src/locales/en/translation.json` |
| Modify | `src/locales/cs/translation.json` |

---

### Task 1: Create new GameCard component

**Files:**
- Create: `src/components/GameCard.tsx`

- [ ] **Step 1: Write `src/components/GameCard.tsx`**

  This is the current `DashboardGameCard` with the link target changed from `/dashboard/${game.id}` to `/games/${game.id}`.

  ```tsx
  import { Link } from 'react-router-dom'
  import { useTranslation } from 'react-i18next'
  import type { Game } from '../data/games'

  export default function GameCard({ game }: { game: Game }) {
    const { t } = useTranslation()

    return (
      <Link
        to={`/games/${game.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30"
      >
        <div
          className={`relative flex aspect-video items-center justify-center bg-linear-to-br ${game.gradient}`}
        >
          <span className="text-6xl drop-shadow-lg transition-transform group-hover:scale-110">
            {game.emoji}
          </span>
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-slate-100">{t(game.nameKey)}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{t(game.taglineKey)}</p>
          <div className="mt-4">
            {game.hasWebProfile ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                {t('dashboard.viewProgress')}
                <span aria-hidden>→</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                {t('dashboard.comingSoon')}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/GameCard.tsx
  git commit -m "feat: add interactive GameCard component (replaces DashboardGameCard)"
  ```

---

### Task 2: Update Home page

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Replace the old GameCard import with the new one**

  Replace the entire content of `src/pages/Home.tsx`:

  ```tsx
  import { useTranslation } from 'react-i18next'
  import { games } from '../data/games'
  import GameCard from '../components/GameCard'

  export default function Home() {
    const { t } = useTranslation()

    return (
      <div>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-100">{t('home.welcome')}</h1>
          <p className="mb-2 text-lg font-medium text-indigo-400">{t('home.subtitle')}</p>
          <p className="max-w-md text-slate-400">{t('home.description')}</p>
        </div>
        <section>
          <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-slate-500">
            {t('home.gamesTitle')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </div>
    )
  }
  ```

  The only change vs. the current file is the import: `DashboardGameCard` → `GameCard` (pointing to the new component), and the JSX usage `<GameCard>` (was `<GameCard>` already — same name, different import).

- [ ] **Step 2: Delete old simple GameCard and DashboardGameCard**

  ```bash
  # Windows PowerShell
  Remove-Item src/components/DashboardGameCard.tsx
  ```

  The old `src/components/GameCard.tsx` is overwritten by the new file in Task 1.

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  pnpm build
  ```

  Expected: build succeeds with no TS errors. If `DashboardGameCard` import errors appear, confirm the old file was deleted.

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/Home.tsx src/components/DashboardGameCard.tsx
  git commit -m "feat: use interactive GameCard on Home page"
  ```

---

### Task 3: Update App.tsx routes

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update routes**

  Replace the entire content of `src/App.tsx`:

  ```tsx
  import { lazy, Suspense } from 'react'
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
  import AuthProvider from './components/AuthProvider'
  import Layout from './components/Layout'
  import Home from './pages/Home'
  import Account from './pages/Account'
  import PrivacyIndex from './pages/PrivacyIndex'
  import PrivacyPolicy from './pages/PrivacyPolicy'

  // Lazy-loaded so the heavy `firebase/firestore` SDK only ships when a player
  // opens a game's progress detail. Auth ships globally (the header needs it).
  const GameDetail = lazy(() => import('./pages/GameDetail'))

  export default function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="privacy" element={<PrivacyIndex />} />
              <Route path="privacy/:game" element={<PrivacyPolicy />} />
              <Route
                path="games/:gameId"
                element={
                  <Suspense fallback={null}>
                    <GameDetail />
                  </Suspense>
                }
              />
              <Route path="account" element={<Account />} />
              {/* Old routes kept as redirects for existing links/bookmarks. */}
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="dashboard/:gameId" element={<Navigate to="/" replace />} />
              <Route path="profile" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )
  }
  ```

- [ ] **Step 2: Verify build**

  ```bash
  pnpm build
  ```

  Expected: no errors. The `Dashboard` import is gone — if TS complains, ensure `src/pages/Dashboard.tsx` still exists (it will be deleted in Task 9).

- [ ] **Step 3: Commit**

  ```bash
  git add src/App.tsx
  git commit -m "feat: rename /dashboard/:gameId to /games/:gameId, redirect old paths"
  ```

---

### Task 4: Update GameDetail.tsx

**Files:**
- Modify: `src/pages/GameDetail.tsx`

Two references to `/dashboard` need updating:
1. `if (!game) return <Navigate to="/dashboard" replace />` — unknown gameId fallback
2. `<Link to="/dashboard">` — the back arrow in the Banner

- [ ] **Step 1: Update the Navigate fallback (line 19)**

  Change:
  ```tsx
  if (!game) return <Navigate to="/dashboard" replace />
  ```
  To:
  ```tsx
  if (!game) return <Navigate to="/" replace />
  ```

- [ ] **Step 2: Update the back link in Banner (line 42)**

  Change:
  ```tsx
  <Link
    to="/dashboard"
    className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
  >
    <span aria-hidden>←</span> {t('detail.back')}
  </Link>
  ```
  To:
  ```tsx
  <Link
    to="/"
    className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
  >
    <span aria-hidden>←</span> {t('detail.back')}
  </Link>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/GameDetail.tsx
  git commit -m "fix: update GameDetail back link and fallback redirect to /"
  ```

---

### Task 5: Update Account.tsx and AccountMenu.tsx

**Files:**
- Modify: `src/pages/Account.tsx`
- Modify: `src/components/AccountMenu.tsx`

- [ ] **Step 1: Update Account.tsx back link (line 73–77)**

  Change:
  ```tsx
  <Link
    to="/dashboard"
    className="text-sm text-indigo-400 transition-colors hover:text-indigo-300"
  >
    {t('account.backToDashboard')}
  </Link>
  ```
  To:
  ```tsx
  <Link
    to="/"
    className="text-sm text-indigo-400 transition-colors hover:text-indigo-300"
  >
    {t('account.backToDashboard')}
  </Link>
  ```

- [ ] **Step 2: Update AccountMenu.tsx dashboard link (line 86–90)**

  Change:
  ```tsx
  <Link
    to="/dashboard"
    role="menuitem"
    className="block px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
  >
    {t('menu.dashboard')}
  </Link>
  ```
  To:
  ```tsx
  <Link
    to="/"
    role="menuitem"
    className="block px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
  >
    {t('menu.dashboard')}
  </Link>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/Account.tsx src/components/AccountMenu.tsx
  git commit -m "fix: update dashboard links in Account and AccountMenu to /"
  ```

---

### Task 6: Update Layout.tsx — remove Dashboard nav link

**Files:**
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Remove the Dashboard NavLink (lines 27–34)**

  Delete these lines from `src/components/Layout.tsx`:
  ```tsx
  <NavLink
    to="/dashboard"
    className={({ isActive }) =>
      `text-sm transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-100'}`
    }
  >
    {t('nav.dashboard')}
  </NavLink>
  ```

  The nav should now only contain: Home, Privacy Policy, LangSwitcher, AccountMenu.

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/Layout.tsx
  git commit -m "feat: remove Dashboard nav link from Layout"
  ```

---

### Task 7: Update vite.config.ts spaRoutes

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Update the spaRoutes array**

  Replace:
  ```ts
  const spaRoutes = [
    'privacy',
    'privacy/def-the-base',
    'privacy/jumping-jello',
    'dashboard',
    'dashboard/def-the-base',
    'dashboard/jumping-jello',
    'account',
    'profile',
  ]
  ```
  With:
  ```ts
  const spaRoutes = [
    'privacy',
    'privacy/def-the-base',
    'privacy/jumping-jello',
    'games/def-the-base',
    'games/jumping-jello',
    'account',
    'profile',
    'dashboard',
  ]
  ```

  Notes:
  - `games/def-the-base` and `games/jumping-jello` added so direct GitHub Pages hits return HTTP 200.
  - `dashboard` kept so the old URL also gets HTTP 200 before the client-side redirect fires.
  - `dashboard/def-the-base` and `dashboard/jumping-jello` removed (catch-all handles them; no bot verification needed on these).

- [ ] **Step 2: Verify build generates correct dist folders**

  ```bash
  pnpm build
  ```

  Expected: `dist/games/def-the-base/index.html` and `dist/games/jumping-jello/index.html` present; `dist/dashboard/index.html` present; `dist/dashboard/def-the-base/` absent.

  Check with:
  ```bash
  # PowerShell
  Get-ChildItem dist -Recurse -Filter index.html | Select-Object FullName
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add vite.config.ts
  git commit -m "feat: update spaRoutes for /games/* paths"
  ```

---

### Task 8: Update i18n files

**Files:**
- Modify: `src/locales/en/translation.json`
- Modify: `src/locales/cs/translation.json`

Changes per file:
- Remove `nav.dashboard`
- Remove `dashboard.title` and `dashboard.subtitle` (keep `viewProgress` and `comingSoon`)
- Update `detail.back` text (no longer mentions dashboard)
- Update `account.backToDashboard` text
- Update `menu.dashboard` text

- [ ] **Step 1: Update `src/locales/en/translation.json`**

  Apply these targeted edits:

  **`nav` section** — remove `"dashboard"` key:
  ```json
  "nav": {
    "home": "Home",
    "privacy": "Privacy Policy"
  },
  ```

  **`dashboard` section** — remove `title` and `subtitle`, keep the rest:
  ```json
  "dashboard": {
    "viewProgress": "View progress",
    "comingSoon": "Coming soon"
  },
  ```

  **`detail.back`** — change value:
  ```json
  "back": "Back",
  ```

  **`account.backToDashboard`** — change value:
  ```json
  "backToDashboard": "Back to games"
  ```

  **`menu.dashboard`** — change value:
  ```json
  "dashboard": "My games",
  ```

- [ ] **Step 2: Update `src/locales/cs/translation.json`**

  Apply the same structural changes with Czech text:

  **`nav` section** — remove `"dashboard"` key:
  ```json
  "nav": {
    "home": "Domů",
    "privacy": "Zásady ochrany osobních údajů"
  },
  ```

  **`dashboard` section** — remove `title` and `subtitle`:
  ```json
  "dashboard": {
    "viewProgress": "Zobrazit postup",
    "comingSoon": "Brzy"
  },
  ```

  **`detail.back`** — change value:
  ```json
  "back": "Zpět",
  ```

  **`account.backToDashboard`** — change value:
  ```json
  "backToDashboard": "Zpět na hry"
  ```

  **`menu.dashboard`** — change value:
  ```json
  "dashboard": "Moje hry",
  ```

- [ ] **Step 3: Verify build**

  ```bash
  pnpm build
  ```

  Expected: no TypeScript or runtime-key errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/locales/en/translation.json src/locales/cs/translation.json
  git commit -m "feat: update i18n — remove dashboard page keys, update back links"
  ```

---

### Task 9: Delete Dashboard.tsx

**Files:**
- Delete: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Delete the file**

  ```bash
  # PowerShell
  Remove-Item src/pages/Dashboard.tsx
  ```

- [ ] **Step 2: Final build check**

  ```bash
  pnpm build
  ```

  Expected: clean build, zero TypeScript errors. No remaining imports of `Dashboard` anywhere (App.tsx was already updated in Task 3).

- [ ] **Step 3: Smoke test with dev server**

  ```bash
  pnpm dev
  ```

  Manually verify:
  - `/` shows hero + interactive game cards with gradient cover art and hover effects
  - Clicking a card with `hasWebProfile` navigates to `/games/def-the-base`
  - The back arrow on the game detail page returns to `/`
  - Nav bar shows only: BrothersInGames logo | Home | Privacy Policy | LangSwitcher | AccountMenu
  - `/dashboard` redirects to `/`
  - `/profile` redirects to `/`
  - AccountMenu dropdown (when signed in) "My games" link goes to `/`

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/Dashboard.tsx
  git commit -m "feat: remove Dashboard page (merged into Home)"
  ```
