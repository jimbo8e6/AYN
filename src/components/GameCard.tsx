import Link from "next/link";
import type { Game } from "@/lib/games";
import StatusBadge from "./StatusBadge";

export default function GameCard({ game }: { game: Game }) {
  const year = game.released?.slice(0, 4);

  return (
    <article className="group relative">
      <Link
        href={`/games/${game.slug}`}
        className="pixel-frame-thin flex h-full flex-col gap-3 bg-panel p-5 transition-all duration-150 [--pixel-color:var(--color-edge)] group-hover:-translate-y-1 group-hover:bg-panel-raised group-hover:[--pixel-color:var(--color-purple-bright)]"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-purple/25 font-display text-sm text-purple-bright transition-colors group-hover:bg-btn-b group-hover:text-void"
          >
            {game.letter}
          </span>
          <StatusBadge status={game.status} />
        </div>

        <h3 className="font-display text-[0.8125rem] leading-relaxed text-ink transition-colors group-hover:text-btn-b">
          {game.title}
        </h3>

        <p className="text-xs text-ink-faint">
          {[game.developer, year].filter(Boolean).join(" · ")}
        </p>

        {game.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-dim">
            {game.excerpt}
          </p>
        )}

        {game.genre.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {game.genre.map((tag) => (
              <li
                key={tag}
                className="border border-edge px-1.5 py-0.5 text-[0.6875rem] text-ink-faint"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
}
