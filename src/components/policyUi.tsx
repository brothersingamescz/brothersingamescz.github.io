import { ExternalLink, ShieldCheck } from './icons'

// Shared scaffolding for the privacy-policy pages so they share one readable,
// on-brand article layout (and supply their own page padding now that the
// Layout shell is full-bleed).

export function PolicyArticle({ children }: { children: React.ReactNode }) {
    return <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">{children}</article>
}

export function PolicyHeader({
    kicker,
    title,
    lastUpdated,
    intro,
}: {
    kicker: string
    title: string
    lastUpdated?: string
    intro?: string
}) {
    return (
        <header className="mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                <ShieldCheck className="size-3.5 text-brand-text" />
                {kicker}
            </span>
            <h1 className="mt-4 text-2xl text-ink sm:text-3xl">{title}</h1>
            {lastUpdated && <p className="mt-2 font-sans text-xs text-faint">{lastUpdated}</p>}
            {intro && <p className="mt-6 font-sans leading-relaxed text-muted">{intro}</p>}
        </header>
    )
}

export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-8">
            <h2 className="mb-3 text-lg text-ink sm:text-xl">{title}</h2>
            <div className="space-y-3 font-sans leading-relaxed text-muted">{children}</div>
        </section>
    )
}

export function PolicyCard({
    name,
    desc,
    href,
    linkLabel,
}: {
    name: string
    desc: string
    href?: string
    linkLabel?: string
}) {
    return (
        <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="font-sans font-semibold text-ink">{name}</p>
            <p className="mt-1 font-sans text-sm text-muted">{desc}</p>
            {href && linkLabel && (
                <ExtLink href={href} className="mt-2">
                    {linkLabel}
                </ExtLink>
            )}
        </div>
    )
}

export function ExtLink({
    href,
    children,
    className = '',
}: {
    href: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-sm font-medium text-brand-text transition-opacity hover:opacity-80 ${className}`}
        >
            {children}
            <ExternalLink className="size-3.5" />
        </a>
    )
}

export function MailLink() {
    return (
        <a
            href="mailto:brothersingamescz@gmail.com"
            className="font-medium text-brand-text transition-opacity hover:opacity-80"
        >
            brothersingamescz@gmail.com
        </a>
    )
}
