import Link from "next/link";
import type { Game } from "@/lib/games";
import StatusBadge from "./StatusBadge";

/** Cards cycle a top rule through the four button colours. */
const ACCENTS = ["bg-btn-red", "bg-btn-yellow", "bg-btn-blue", "bg-btn-green"];

export default function GameCard({
  game,
  index = 0,
}: {
  game: Game;
  index?: number;
}) {
  const year = game.released?.slice(0, 4);

  return (
    <article className="group h-full">
      <Link
        href={`/games/${game.slug}`}
        className="flex h-full flex-col border border-line bg-surface transition-shadow duration-200 hover:shadow-lg"
      >
        <span
          aria-hidden="true"
          className={`h-[3px] w-full ${ACCENTS[index % ACCENTS.length]}`}
        />

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <span
              aria-hidden="true"
              className="text-3xl font-light text-line transition-colors group-hover:text-ink"
            >
              {game.letter}
            </span>
            <StatusBadge status={game.status} />
          </div>

          <h3 className="text-xl leading-snug font-normal tracking-tight text-ink">
            {game.title}
          </h3>

          <p className="text-xs tracking-wide text-muted uppercase">
            {[game.developer, year].filter(Boolean).join(" · ")}
          </p>

          {game.excerpt && (
            <p className="line-clamp-3 font-serif text-[0.9375rem] leading-relaxed text-body">
              {game.excerpt}
            </p>
          )}

          {game.genre.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-xs text-muted">
              {game.genre.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
