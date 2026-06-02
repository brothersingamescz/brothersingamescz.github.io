import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Routes that need their own index.html so GitHub Pages returns HTTP 200
// on direct access (bots like Google Play Console check HTTP status codes).
// `:gameId` is dynamic, so list the concrete games (same as privacy/:game).
// 'profile' stays for the client-side redirect to /dashboard.
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

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-fallback',
      closeBundle() {
        for (const route of spaRoutes) {
          const dir = join('dist', route)
          mkdirSync(dir, { recursive: true })
          copyFileSync(join('dist', 'index.html'), join(dir, 'index.html'))
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
  },
})
