# brothersingamescz.github.io

Studio site for BrothersInGames.

## Stack

React 19 · Vite 6 · TypeScript · React Router 7 · Tailwind CSS 4 · i18next · pnpm 9

## Dev

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build
```

## Deploy

Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.

## i18n

Locale files are in `src/locales/{en,cs}/translation.json`. Language is auto-detected from the browser and persisted in `localStorage`.
