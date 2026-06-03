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
