// The studio "BiG" mark. Two solid-background variants ship in /public/images/
// /logos; we show the white-on-black tile in dark mode and the black-on-white
// tile in light mode. The swap is pure CSS (`dark:` variants) so there's no
// flash or JS dependency. Rendered as a rounded app-style tile + wordmark.
export default function Logo({ wordmark = true }: { wordmark?: boolean }) {
    return (
        <span className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center overflow-hidden rounded-lg ring-1 ring-line">
                <img
                    src="/images/logos/logo-big-black-and-white.png"
                    alt=""
                    width={32}
                    height={32}
                    className="size-full object-cover dark:hidden"
                />
                <img
                    src="/images/logos/logo-big-white-and-black.png"
                    alt=""
                    width={32}
                    height={32}
                    className="hidden size-full object-cover dark:block"
                />
            </span>
            {wordmark && (
                <span className="font-display text-base leading-none tracking-tight text-ink">
                    BrothersInGames
                </span>
            )}
        </span>
    )
}
