import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't reset scroll on navigation, so a detail page opened from
// far down the Home page would inherit that scroll offset and render mid/bottom.
// Jump to the top on every pathname change. `behavior: 'instant'` overrides the
// global `scroll-behavior: smooth` (index.css) so navigation doesn't animate.
// In-page anchors (e.g. /#games) keep working - we ignore hash-only changes.
export default function ScrollToTop() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) return
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }, [pathname, hash])

    return null
}
