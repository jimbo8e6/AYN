import { INDEX_LETTERS, letterAnchor, letterLabel } from "@/lib/games";

/**
 * The #, A–Z strip on the games index. Buckets with write-ups behind them are
 * live and jump to that section; the rest sit faint as a visible measure of
 * how much of the alphabet is still to go.
 */
export default function AlphabetNav({
  activeLetters,
}: {
  activeLetters: string[];
}) {
  const active = new Set(activeLetters);

  return (
    <nav
      aria-label="Jump to letter"
      className="sticky top-[4.5rem] z-30 border-y border-line bg-shell/95 py-3 backdrop-blur-sm"
    >
      <ul className="flex flex-wrap justify-center gap-x-1 gap-y-1">
        {INDEX_LETTERS.map((letter) => {
          const enabled = active.has(letter);

          return (
            <li key={letter}>
              {enabled ? (
                <a
                  href={`#${letterAnchor(letter)}`}
                  aria-label={`Jump to games beginning with ${letterLabel(letter)}`}
                  className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-surface"
                >
                  {letter}
                </a>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center text-sm font-light text-line"
                >
                  {letter}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
