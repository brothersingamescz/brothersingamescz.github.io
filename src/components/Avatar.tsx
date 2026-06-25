import { useState } from 'react'

function initialsFrom(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase()
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase()
}

// Google profile photo with a graceful initials fallback (photos can fail to
// load - hotlink protection, expired URLs). `referrerPolicy` helps them load.
export default function Avatar({
    photoURL,
    name,
    size = 'h-8 w-8',
    textClassName = 'text-xs',
}: {
    photoURL: string | null
    name: string
    size?: string
    textClassName?: string
}) {
    const [broken, setBroken] = useState(false)

    if (photoURL && !broken) {
        return (
            <img
                src={photoURL}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setBroken(true)}
                className={`${size} rounded-full border border-line object-cover`}
            />
        )
    }

    return (
        <span
            className={`${size} ${textClassName} flex items-center justify-center rounded-full bg-brand font-semibold text-brand-ink`}
        >
            {initialsFrom(name)}
        </span>
    )
}
