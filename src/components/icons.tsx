// Small, consistent inline icon set (Lucide-style, 24×24, 1.75 stroke,
// currentColor) so the UI never relies on emoji as structural icons and every
// glyph adapts to the theme. Decorative by default (aria-hidden); pass a label
// where an icon stands alone as a control.
type IconProps = {
    className?: string
    label?: string
}

function base(label?: string) {
    return {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.75,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': label ? undefined : true,
        role: label ? 'img' : undefined,
        'aria-label': label,
    }
}

export function Sun({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    )
}

export function Moon({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    )
}

export function ArrowRight({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    )
}

export function ArrowLeft({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
    )
}

export function ChevronLeft({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M15 6l-6 6 6 6" />
        </svg>
    )
}

export function ChevronRight({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    )
}

export function ChevronDown({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M6 9l6 6 6-6" />
        </svg>
    )
}

export function ExternalLink({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
    )
}

export function Sparkles({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M12 3l1.9 4.8L18.7 9.7 13.9 11.6 12 16.4 10.1 11.6 5.3 9.7 10.1 7.8 12 3Z" />
            <path d="M19 14l.8 2L22 16.8 20 17.6 19.2 19.6 18.4 17.6 16.4 16.8 18.4 16 19 14Z" />
        </svg>
    )
}

export function ShieldCheck({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M12 3l7 3v5c0 4.5-3 8.3-7 9.5-4-1.2-7-5-7-9.5V6l7-3Z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    )
}

export function Trash({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
        </svg>
    )
}

export function Lock({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    )
}

export function Check({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}

export function Star({ className, label }: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden={!label}
            aria-label={label}
            role={label ? 'img' : undefined}
        >
            <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6.1 21.3l1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
        </svg>
    )
}

export function InfinityIcon({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M6.5 8.5a3.5 3.5 0 1 0 0 7c2 0 3-1.5 5.5-3.5S15.5 8.5 17.5 8.5a3.5 3.5 0 1 1 0 7c-2 0-3-1.5-5.5-3.5S8.5 8.5 6.5 8.5Z" />
        </svg>
    )
}

export function Heart({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
        </svg>
    )
}

export function Coffee({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z" />
            <path d="M6 2v2M10 2v2M14 2v2" />
        </svg>
    )
}

export function Smartphone({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <rect x="5" y="2" width="14" height="20" rx="2.5" />
            <path d="M12 18h.01" />
        </svg>
    )
}

export function Send({ className, label }: IconProps) {
    return (
        <svg className={className} {...base(label)}>
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9 22 2Z" />
        </svg>
    )
}

// Google Play "play triangle" glyph for store badges. Uses brand colours, not
// currentColor, so it stays recognisable on any background.
export function GooglePlay({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M3.6 2.3c-.3.3-.5.7-.5 1.3v16.8c0 .6.2 1 .5 1.3l.1.1L13 12.1v-.2L3.7 2.2l-.1.1Z"
                fill="#00D3FF"
            />
            <path
                d="M16.3 15.3 13 12.1v-.2l3.3-3.2.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2-.1-.2Z"
                fill="#FFCE00"
            />
            <path d="M16.4 15.2 13 12 3.6 21.7c.4.4 1 .4 1.7.1l11.1-6.6Z" fill="#FF3D44" />
            <path d="M16.4 8.8 5.3 2.2C4.6 1.8 4 1.9 3.6 2.3L13 12l3.4-3.2Z" fill="#00F076" />
        </svg>
    )
}
