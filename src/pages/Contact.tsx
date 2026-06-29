import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { apps } from '../data/apps'
import { games } from '../data/games'
import { BackLink } from '../components/productUi'
import { Check, ChevronDown, Send } from '../components/icons'

// Static "contact us" page: a bug/question/idea form that posts to Web3Forms (a
// hosted form-to-email relay, so the static GitHub Pages site needs no backend),
// plus a direct email fallback. No Firebase. The access key is public by design.
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = '7cfc8611-03ce-4c84-b7ce-dd3f9bdc39df'
const CONTACT_EMAIL = 'brothersingamescz@gmail.com'

// Stable (locale-independent) topic values so the email subject and triage stay
// consistent regardless of the visitor's UI language; the dropdown shows the
// translated label.
const TOPICS = [
    { value: 'Bug', key: 'bug' },
    { value: 'Question', key: 'question' },
    { value: 'Idea', key: 'idea' },
    { value: 'Other', key: 'other' },
] as const

type SourceInfo = { id: string; name: string; known: boolean }

// Maps a `?app=<id>` query param (set when an app/game deep-links here, e.g. from
// its "Contact support" button) to a display name, looking across the app and game
// registries. Unknown ids are still passed through to the email so the source is
// never lost; only known ids get a user-facing badge.
function resolveSource(id: string | null, t: TFunction): SourceInfo | null {
    if (!id) return null
    const app = apps.find((a) => a.id === id)
    if (app) return { id, name: t(app.nameKey), known: true }
    const game = games.find((g) => g.id === id)
    if (game) return { id, name: t(game.nameKey), known: true }
    return { id, name: id, known: false }
}

type SourceOption = { value: string; label: string; source: SourceInfo | null }

// Options for the picker shown when there is no `?app=` deep-link. Built from the
// same registries as resolveSource so a manual choice produces the exact same
// subject `(Name)` suffix and `from_app` field as arriving via /contact?app=<id>.
// Order matches the visitor-facing list: games, apps, the website, then a neutral
// default that carries no source (identical to the old no-param behaviour).
function sourceOptions(t: TFunction): SourceOption[] {
    const product = (id: string, name: string): SourceOption => ({
        value: id,
        label: name,
        source: { id, name, known: true },
    })
    return [
        ...games.map((g) => product(g.id, t(g.nameKey))),
        ...apps.map((a) => product(a.id, t(a.nameKey))),
        product('website', t('contact.sources.website')),
        { value: '', label: t('contact.sources.general'), source: null },
    ]
}

export default function Contact() {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const source = resolveSource(searchParams.get('app'), t)

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="mb-5">
                <BackLink />
            </div>

            <header className="mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                    <Send className="size-3.5 text-brand-text" />
                    {t('contact.title')}
                </span>
                <h1 className="mt-4 text-2xl text-ink sm:text-3xl">{t('contact.heading')}</h1>
                <p className="mt-4 font-sans leading-relaxed text-muted">{t('contact.intro')}</p>
                {source?.known && (
                    <p className="mt-4 inline-block rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
                        {t('contact.fromApp', { app: source.name })}
                    </p>
                )}
            </header>

            <ContactForm lockedSource={source} />

            <p className="mt-6 font-sans text-sm text-muted">
                {t('contact.emailAlt')}{' '}
                <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-brand-text transition-opacity hover:opacity-80"
                >
                    {CONTACT_EMAIL}
                </a>
                .
            </p>
        </div>
    )
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function ContactForm({ lockedSource }: { lockedSource: SourceInfo | null }) {
    const { t } = useTranslation()
    const [status, setStatus] = useState<FormStatus>('idle')
    const [topic, setTopic] = useState<string>(TOPICS[0].value)
    const [sourceValue, setSourceValue] = useState('')
    const options = sourceOptions(t)
    // Deep-linked via ?app= -> the source is fixed (its badge shows in the header).
    // Otherwise the visitor picks it below so every report still names a product.
    const source = lockedSource ?? options.find((o) => o.value === sourceValue)?.source ?? null

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget // capture before await (React nulls currentTarget)
        setStatus('submitting')
        try {
            const res = await fetch(WEB3FORMS_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
            })
            const data = await res.json()
            if (data.success) {
                form.reset()
                setTopic(TOPICS[0].value)
                setSourceValue('')
                setStatus('success')
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15 text-accent">
                    <Check className="size-6" />
                </span>
                <h2 className="mt-4 font-sans text-lg font-semibold text-ink">
                    {t('contact.successTitle')}
                </h2>
                <p className="mt-1.5 font-sans text-sm text-muted">{t('contact.success')}</p>
                <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-text transition-opacity hover:opacity-80"
                >
                    {t('contact.sendAnother')}
                </button>
            </div>
        )
    }

    const submitting = status === 'submitting'
    const subject = `[${topic}] BrothersInGames contact${source ? ` (${source.name})` : ''}`

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
            <input type="hidden" name="subject" value={subject} />
            {source && <input type="hidden" name="from_app" value={source.name} />}
            {/* Web3Forms honeypot: bots tick it, humans never see it. */}
            <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
            />

            <Field
                id="contact-name"
                name="name"
                label={t('contact.name')}
                placeholder={t('contact.namePlaceholder')}
                autoComplete="name"
                required={false}
            />
            <Field
                id="contact-email"
                name="email"
                type="email"
                label={t('contact.email')}
                placeholder={t('contact.emailPlaceholder')}
                autoComplete="email"
            />

            {!lockedSource && (
                <div>
                    <label
                        htmlFor="contact-source"
                        className="mb-1.5 block font-sans text-sm font-medium text-ink"
                    >
                        {t('contact.sourceLabel')}
                    </label>
                    <div className="relative">
                        <select
                            id="contact-source"
                            value={sourceValue}
                            onChange={(e) => setSourceValue(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-line bg-surface px-4 py-3 pr-10 font-sans text-[1rem] text-ink transition-colors hover:border-faint/50 focus:border-brand"
                        >
                            {options.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                    </div>
                </div>
            )}

            <div>
                <label
                    htmlFor="contact-topic"
                    className="mb-1.5 block font-sans text-sm font-medium text-ink"
                >
                    {t('contact.topicLabel')}
                </label>
                <div className="relative">
                    <select
                        id="contact-topic"
                        name="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-line bg-surface px-4 py-3 pr-10 font-sans text-[1rem] text-ink transition-colors hover:border-faint/50 focus:border-brand"
                    >
                        {TOPICS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {t(`contact.topics.${o.key}`)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                </div>
            </div>

            <div>
                <label
                    htmlFor="contact-message"
                    className="mb-1.5 block font-sans text-sm font-medium text-ink"
                >
                    {t('contact.message')}{' '}
                    <span aria-hidden="true" className="text-danger">
                        *
                    </span>
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    required
                    aria-required="true"
                    rows={5}
                    placeholder={t('contact.messagePlaceholder')}
                    className="w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 font-sans text-[1rem] text-ink placeholder:text-faint transition-colors hover:border-faint/50 focus:border-brand"
                />
            </div>

            {status === 'error' && (
                <p role="alert" className="font-sans text-sm text-danger">
                    {t('contact.error')}{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline">
                        {CONTACT_EMAIL}
                    </a>
                    .
                </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-brand/25 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Spinner />
                            {t('contact.sending')}
                        </>
                    ) : (
                        <>
                            <Send className="size-4" />
                            {t('contact.send')}
                        </>
                    )}
                </button>
                <p className="font-sans text-xs text-faint">
                    {t('contact.privacyNote')}{' '}
                    <Link
                        to="/privacy/web"
                        className="text-brand-text transition-opacity hover:opacity-80"
                    >
                        {t('contact.privacyLink')}
                    </Link>
                    .
                </p>
            </div>
        </form>
    )
}

function Field({
    id,
    name,
    label,
    placeholder,
    type = 'text',
    autoComplete,
    required = true,
}: {
    id: string
    name: string
    label: string
    placeholder: string
    type?: string
    autoComplete?: string
    required?: boolean
}) {
    const { t } = useTranslation()
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block font-sans text-sm font-medium text-ink">
                {label}{' '}
                {required ? (
                    <span aria-hidden="true" className="text-danger">
                        *
                    </span>
                ) : (
                    <span className="font-normal text-faint">({t('contact.optional')})</span>
                )}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                aria-required={required}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 font-sans text-[1rem] text-ink placeholder:text-faint transition-colors hover:border-faint/50 focus:border-brand"
            />
        </div>
    )
}

function Spinner() {
    return (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="3"
            />
            <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    )
}
