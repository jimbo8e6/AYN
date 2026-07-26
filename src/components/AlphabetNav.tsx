import { ALPHABET } from "@/lib/games";

/**
 * The A–Z strip on the games index. Letters with write-ups behind them are
 * lit and jump to that section; the rest sit dim as a visible measure of how
 * much of the alphabet is still to go.
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
      className="sticky top-[4.625rem] z-30 -mx-5 border-y-2 border-edge bg-deep/95 px-5 py-3 backdrop-blur-md"
    >
      <ul className="flex flex-wrap justify-center gap-1">
        {ALPHABET.map((letter) => {
          const enabled = active.has(letter);

          return (
            <li key={letter}>
              {enabled ? (
                <a
                  href={`#letter-${letter}`}
                  className="flex h-7 w-7 items-center justify-center bg-purple/25 font-display text-[0.625rem] text-purple-bright transition-colors hover:bg-btn-b hover:text-void"
                >
                  {letter}
                </a>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center font-display text-[0.625rem] text-ink-faint/40"
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
