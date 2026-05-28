# Homepage games section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a games grid to the home page, a shared Footer, and clean up i18n key structure.

**Architecture:** Game data lives in a single `src/data/games.ts` config. `GameCard` reads from it and renders a "Brzy/Coming soon" badge or a Play Store link depending on whether `storeUrl` is set. Footer is a standalone component added to Layout. No test framework is set up — TypeScript compilation (`pnpm build`) and visual check (`pnpm dev`) serve as verification.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, react-i18next, Vite 6

---

### Task 1: Refactor i18n — move game names to top-level `games` namespace

**Files:**
- Modify: `src/locales/en/translation.json`
- Modify: `src/locales/cs/translation.json`

- [ ] **Step 1: Update English locale**

Replace the content of `src/locales/en/translation.json`:

```json
{
  "nav": {
    "home": "Home",
    "privacy": "Privacy Policy"
  },
  "home": {
    "welcome": "Welcome",
    "subtitle": "Games by BrothersInGames",
    "description": "Independent game development studio.",
    "gamesTitle": "Games",
    "comingSoon": "Coming soon"
  },
  "games": {
    "defTheBase": "Def the Base",
    "jumpingJello": "Jumping Jello"
  },
  "privacy": {
    "title": "Privacy Policy",
    "lastUpdated": "Last updated: May 2026",
    "intro": "{{gameName}} does not collect personal data directly. The following third-party services are used in the game and may collect data under their own terms.",
    "thirdPartyTitle": "Third-party services",
    "unityAds": {
      "name": "Unity Ads",
      "desc": "Collects your device's advertising ID to serve ads.",
      "policy": "Privacy policy"
    },
    "googlePlay": {
      "name": "Google Play Games Services",
      "desc": "Links your save data to your Google account for cloud sync.",
      "policy": "Privacy policy"
    },
    "saveDataTitle": "Save data",
    "saveDataDesc": "Your game progress is saved locally on your device. If you use Google Play Games, it can optionally sync to Google's cloud storage.",
    "advertisingTitle": "Advertising",
    "advertisingDesc": "Unity Ads uses your advertising ID to show ads. To opt out, go to Settings → Google → Ads on your device.",
    "purchasesTitle": "In-app purchases",
    "purchasesDesc": "Purchases go through Google Play. Google may retain your purchase history.",
    "deletionTitle": "Deleting your data",
    "deletionIntro": "To delete cloud save data:",
    "deletionStep1": "Open the Google Play Games app",
    "deletionStep2": "Find {{gameName}}",
    "deletionStep3": "Tap the three-dot menu → \"Delete Play Games data\"",
    "deletionOutcome": "That removes all cloud-synced progress, scores, and upgrades permanently. Local data is deleted when you uninstall. Advertising data resets under Settings → Google → Ads.",
    "deletionContact": "To request data deletion:",
    "contactTitle": "Contact",
    "selectGame": "Select a game to view its privacy policy"
  }
}
```

- [ ] **Step 2: Update Czech locale**

Replace the content of `src/locales/cs/translation.json`:

```json
{
  "nav": {
    "home": "Domů",
    "privacy": "Zásady ochrany osobních údajů"
  },
  "home": {
    "welcome": "Vítejte",
    "subtitle": "Hry od BrothersInGames",
    "description": "Nezávislé herní studio.",
    "gamesTitle": "Hry",
    "comingSoon": "Brzy"
  },
  "games": {
    "defTheBase": "Def the Base",
    "jumpingJello": "Jumping Jello"
  },
  "privacy": {
    "title": "Zásady ochrany osobních údajů",
    "lastUpdated": "Poslední aktualizace: květen 2026",
    "intro": "{{gameName}} přímo neshromažďuje osobní údaje. Níže jsou uvedeny služby třetích stran používané ve hře, které mohou shromažďovat data podle vlastních podmínek.",
    "thirdPartyTitle": "Služby třetích stran",
    "unityAds": {
      "name": "Unity Ads",
      "desc": "Shromažďuje reklamní ID vašeho zařízení pro zobrazování reklam.",
      "policy": "Zásady ochrany osobních údajů"
    },
    "googlePlay": {
      "name": "Herní služby Google Play",
      "desc": "Propojuje vaše uložené hry s vaším účtem Google pro synchronizaci v cloudu.",
      "policy": "Zásady ochrany osobních údajů"
    },
    "saveDataTitle": "Ukládání dat",
    "saveDataDesc": "Váš herní postup je uložen lokálně v zařízení. Pokud používáte Herní služby Google Play, může být volitelně synchronizován do cloudového úložiště Google.",
    "advertisingTitle": "Reklama",
    "advertisingDesc": "Unity Ads používá vaše reklamní ID k zobrazování reklam. Chcete-li se odhlásit, přejděte na Nastavení → Google → Reklamy ve svém zařízení.",
    "purchasesTitle": "Nákupy v aplikaci",
    "purchasesDesc": "Nákupy jsou zpracovávány přes Google Play. Google může uchovávat historii vašich nákupů.",
    "deletionTitle": "Smazání vašich dat",
    "deletionIntro": "Jak smazat cloudové zálohy:",
    "deletionStep1": "Otevřete aplikaci Herní služby Google Play",
    "deletionStep2": "Najděte hru {{gameName}}",
    "deletionStep3": "Klepněte na menu se třemi tečkami → \"Smazat data z Herních služeb Google Play\"",
    "deletionOutcome": "Tím trvale odstraníte veškerý cloudový postup, skóre a vylepšení. Lokální data jsou smazána po odinstalování hry. Reklamní data lze resetovat v části Nastavení → Google → Reklamy.",
    "deletionContact": "Žádosti o smazání dat zasílejte na:",
    "contactTitle": "Kontakt",
    "selectGame": "Vyberte hru pro zobrazení zásad ochrany osobních údajů"
  }
}
```

---

### Task 2: Update components using old `privacy.games.*` keys

**Files:**
- Modify: `src/pages/PrivacyIndex.tsx`
- Modify: `src/pages/PrivacyPolicy.tsx`

- [ ] **Step 1: Update `PrivacyIndex.tsx`** — change `privacy.games.X` → `games.X`

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const games = [
  { slug: 'def-the-base', nameKey: 'games.defTheBase' as const },
  { slug: 'jumping-jello', nameKey: 'games.jumpingJello' as const },
]

export default function PrivacyIndex() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-100">{t('nav.privacy')}</h1>
      <p className="mb-8 text-slate-400">{t('privacy.selectGame')}</p>
      <ul className="space-y-3">
        {games.map(({ slug, nameKey }) => (
          <li key={slug}>
            <Link
              to={`/privacy/${slug}`}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-5 py-4 text-slate-100 transition-colors hover:border-indigo-600 hover:bg-slate-800"
            >
              <span>{t(nameKey)}</span>
              <span className="text-slate-500">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Update `PrivacyPolicy.tsx`** — change `privacy.games.X` → `games.X`

```tsx
import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const GAME_CONFIGS = {
  'def-the-base': { nameKey: 'games.defTheBase' as const, hasIAP: false },
  'jumping-jello': { nameKey: 'games.jumpingJello' as const, hasIAP: true },
}

type GameSlug = keyof typeof GAME_CONFIGS

export default function PrivacyPolicy() {
  const { game } = useParams<{ game: string }>()
  const { t } = useTranslation()

  if (!game || !(game in GAME_CONFIGS)) {
    return <Navigate to="/privacy" replace />
  }

  const config = GAME_CONFIGS[game as GameSlug]
  const gameName = t(config.nameKey)

  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-100">
        {t('privacy.title')} — {gameName}
      </h1>
      <p className="mb-8 text-sm text-slate-500">{t('privacy.lastUpdated')}</p>

      <p className="mb-8 text-slate-300">{t('privacy.intro', { gameName })}</p>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">{t('privacy.thirdPartyTitle')}</h2>
        <div className="space-y-3">
          {(
            [
              { key: 'unityAds', href: 'https://unity.com/legal/privacy-policy' },
              { key: 'googlePlay', href: 'https://policies.google.com/privacy' },
            ] as const
          ).map(({ key, href }) => (
            <div key={key} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="font-medium text-slate-100">{t(`privacy.${key}.name`)}</p>
              <p className="mt-1 text-sm text-slate-400">{t(`privacy.${key}.desc`)}</p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-indigo-400 hover:underline"
              >
                {t(`privacy.${key}.policy`)} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <Section title={t('privacy.saveDataTitle')}>
        <p className="text-slate-400">{t('privacy.saveDataDesc')}</p>
      </Section>

      <Section title={t('privacy.advertisingTitle')}>
        <p className="text-slate-400">{t('privacy.advertisingDesc')}</p>
      </Section>

      {config.hasIAP && (
        <Section title={t('privacy.purchasesTitle')}>
          <p className="text-slate-400">{t('privacy.purchasesDesc')}</p>
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-indigo-400 hover:underline"
          >
            {t('privacy.googlePlay.policy')} →
          </a>
        </Section>
      )}

      <Section title={t('privacy.deletionTitle')}>
        <p className="mb-3 text-slate-400">{t('privacy.deletionIntro')}</p>
        <ol className="mb-3 list-decimal space-y-1 pl-5 text-slate-400">
          <li>{t('privacy.deletionStep1')}</li>
          <li>{t('privacy.deletionStep2', { gameName })}</li>
          <li>{t('privacy.deletionStep3')}</li>
        </ol>
        <p className="mb-3 text-slate-400">{t('privacy.deletionOutcome')}</p>
        <p className="text-slate-400">
          {t('privacy.deletionContact')}{' '}
          <a href="mailto:brothersingamescz@gmail.com" className="text-indigo-400 hover:underline">
            brothersingamescz@gmail.com
          </a>
        </p>
      </Section>

      <Section title={t('privacy.contactTitle')}>
        <a href="mailto:brothersingamescz@gmail.com" className="text-indigo-400 hover:underline">
          brothersingamescz@gmail.com
        </a>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-lg font-semibold text-slate-100">{title}</h2>
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:\Users\petra\source\repos\brothersingamescz.github.io
pnpm build
```

Expected: `✓ built in X.XXs` — no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/locales/ src/pages/PrivacyIndex.tsx src/pages/PrivacyPolicy.tsx
git commit -m "refactor: move game name i18n keys to top-level games namespace"
```

---

### Task 3: Create game data config

**Files:**
- Create: `src/data/games.ts`

- [ ] **Step 1: Create `src/data/games.ts`**

```ts
export type Game = {
  id: string
  nameKey: 'games.defTheBase' | 'games.jumpingJello'
  emoji: string
  storeUrl?: string
}

export const games: Game[] = [
  { id: 'def-the-base', nameKey: 'games.defTheBase', emoji: '🎮' },
  { id: 'jumping-jello', nameKey: 'games.jumpingJello', emoji: '🍮' },
]
```

> When a game ships: add `storeUrl: 'https://play.google.com/store/apps/details?id=...'` to the matching entry. The card switches automatically from badge to link.

- [ ] **Step 2: Verify TypeScript is happy**

```bash
pnpm build
```

Expected: `✓ built in X.XXs`

---

### Task 4: Create `GameCard` and `Footer` components

**Files:**
- Create: `src/components/GameCard.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create `src/components/GameCard.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import type { Game } from '../data/games'

export default function GameCard({ game }: { game: Game }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <span className="mb-3 text-4xl">{game.emoji}</span>
      <p className="mb-3 font-semibold text-slate-100">{t(game.nameKey)}</p>
      {game.storeUrl ? (
        <a
          href={game.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Google Play
        </a>
      ) : (
        <span className="rounded bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
          {t('home.comingSoon')}
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-6 text-center">
      <a
        href="mailto:brothersingamescz@gmail.com"
        className="text-sm text-slate-500 transition-colors hover:text-slate-400"
      >
        brothersingamescz@gmail.com
      </a>
    </footer>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
pnpm build
```

Expected: `✓ built in X.XXs`

---

### Task 5: Rewrite `Home.tsx` and wire Footer into `Layout.tsx`

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Rewrite `src/pages/Home.tsx`**

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

- [ ] **Step 2: Update `src/components/Layout.tsx`** — add Footer import and render it below `<main>`

```tsx
import { Outlet, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitcher from './LangSwitcher'
import Footer from './Footer'

export default function Layout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <NavLink to="/" className="font-bold tracking-tight text-indigo-400">
            BrothersInGames
          </NavLink>
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-100'}`
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-100'}`
              }
            >
              {t('nav.privacy')}
            </NavLink>
            <LangSwitcher />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Final build**

```bash
pnpm build
```

Expected: `✓ built in X.XXs` — no errors.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

Open `http://localhost:5173`. Verify:
- Home: hero visible, two game cards below with "Coming soon" / "Brzy" badge
- Switch EN↔CS: all text changes including badge and section title
- Footer with email visible on `/`, `/privacy`, `/privacy/def-the-base`
- `/privacy` rozcestník shows correct game names (Def the Base, Jumping Jello)

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: add games section to home page and footer"
```

- [ ] **Step 6: Push**

```bash
git push
```

GitHub Actions deploys automatically to `https://brothersingamescz.github.io`.
