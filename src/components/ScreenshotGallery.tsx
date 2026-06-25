import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Shot } from '../data/games'
import { ChevronLeft, ChevronRight } from './icons'

// Horizontal scroll-snap screenshot strip with a click-to-zoom lightbox.
// `orientation` switches tile shape so phone (portrait) and gameplay (landscape)
// captures both look right. Images lazy-load and reserve their aspect ratio to
// avoid layout shift.
export default function ScreenshotGallery({
    shots,
    orientation,
    name,
}: {
    shots: Shot[]
    orientation: 'portrait' | 'landscape'
    name: string
}) {
    const { t } = useTranslation()
    const [open, setOpen] = useState<number | null>(null)

    const tile =
        orientation === 'portrait'
            ? 'w-44 aspect-[9/19] sm:w-52'
            : 'w-72 aspect-video sm:w-80 md:w-[22rem]'

    const close = useCallback(() => setOpen(null), [])
    const go = useCallback(
        (dir: number) => setOpen((i) => (i === null ? i : (i + dir + shots.length) % shots.length)),
        [shots.length]
    )

    useEffect(() => {
        if (open === null) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') close()
            else if (e.key === 'ArrowRight') go(1)
            else if (e.key === 'ArrowLeft') go(-1)
        }
        document.addEventListener('keydown', onKey)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = prevOverflow
        }
    }, [open, close, go])

    return (
        <>
            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                {shots.map((shot, i) => (
                    <button
                        key={shot.src}
                        type="button"
                        onClick={() => setOpen(i)}
                        className={`group relative shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-2xl border border-line bg-raised ${tile}`}
                        aria-label={t(shot.captionKey)}
                    >
                        <img
                            src={shot.src}
                            alt={`${name} - ${t(shot.captionKey)}`}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {t(shot.captionKey)}
                        </span>
                    </button>
                ))}
            </div>

            {open !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t(shots[open]!.captionKey)}
                    onClick={close}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 p-4 backdrop-blur-sm"
                >
                    <img
                        src={shots[open]!.src}
                        alt={`${name} - ${t(shots[open]!.captionKey)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
                    />
                    <p className="text-sm font-medium text-white/90">
                        {t(shots[open]!.captionKey)}
                    </p>

                    <button
                        type="button"
                        onClick={close}
                        aria-label={t('gallery.close')}
                        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                        >
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>

                    {shots.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    go(-1)
                                }}
                                aria-label={t('gallery.prev')}
                                className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                            >
                                <ChevronLeft className="size-6" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    go(1)
                                }}
                                aria-label={t('gallery.next')}
                                className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                            >
                                <ChevronRight className="size-6" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    )
}
