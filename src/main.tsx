import './index.css'
// Self-hosted display + body fonts (no external font CDN at runtime; see index.css).
import '@fontsource/russo-one'
import '@fontsource-variable/space-grotesk'
import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
