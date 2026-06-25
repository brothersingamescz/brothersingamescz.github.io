import { useCallback, useEffect, useState } from 'react'

// Light/dark theme, class-based (.dark on <html>). The initial class is applied
// before paint by the inline bootstrap in index.html; this hook keeps React in
// sync, persists the user's explicit choice to localStorage, and - until the
// user picks a side - follows the OS preference live.
export type Theme = 'light' | 'dark'

function systemPrefersDark() {
    return (
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    )
}

function currentTheme(): Theme {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function apply(theme: Theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(currentTheme)

    // Follow the OS theme until the user makes an explicit choice.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => {
            if (localStorage.getItem('theme')) return
            const next: Theme = mq.matches ? 'dark' : 'light'
            apply(next)
            setThemeState(next)
        }
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    const setTheme = useCallback((next: Theme) => {
        apply(next)
        localStorage.setItem('theme', next)
        setThemeState(next)
    }, [])

    const toggle = useCallback(() => {
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark')
    }, [setTheme])

    return { theme, setTheme, toggle, systemPrefersDark }
}
