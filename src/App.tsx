import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './components/AuthProvider'
import Layout from './components/Layout'
import Home from './pages/Home'
import AppDetail from './pages/AppDetail'
import AppPrivacyPolicy from './pages/AppPrivacyPolicy'
import PrivacyIndex from './pages/PrivacyIndex'
import PrivacyPolicy from './pages/PrivacyPolicy'
import WebsitePrivacy from './pages/WebsitePrivacy'

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
                        {/* Static routes rank above the dynamic :game one in React Router. */}
                        <Route path="privacy/web" element={<WebsitePrivacy />} />
                        <Route path="privacy/birthday-reminder" element={<AppPrivacyPolicy />} />
                        <Route path="privacy/:game" element={<PrivacyPolicy />} />
                        <Route path="apps/:appId" element={<AppDetail />} />
                        <Route
                            path="games/:gameId"
                            element={
                                <Suspense fallback={null}>
                                    <GameDetail />
                                </Suspense>
                            }
                        />
                        {/* Old routes kept as redirects for existing links/bookmarks. */}
                        <Route path="account" element={<Navigate to="/" replace />} />
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
