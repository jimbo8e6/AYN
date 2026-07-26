import type { Metadata } from "next";
import AlphabetNav from "@/components/AlphabetNav";
import GameCard from "@/components/GameCard";
import { getAllGames, getGamesByLetter } from "@/lib/games";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Every Super Nintendo game written up so far, in alphabetical order.",
};

export default function GamesPage() {
  const groups = getGamesByLetter();
  const total = getAllGames().length;
  const activeLetters = groups.map((group) => group.letter);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16">
      <header className="py-14">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Games</h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-ink-dim">
          Everything played and written up so far, in the only order that
          matters. {total === 0 ? "Nothing here yet." : null}
        </p>
        {total > 0 && (
          <p className="mt-4 font-display text-[0.625rem] text-purple-bright uppercase">
            {total} {total === 1 ? "entry" : "entries"}
          </p>
        )}
      </header>

      <AlphabetNav activeLetters={activeLetters} />

      {groups.length === 0 ? (
        <p className="py-20 text-center text-ink-dim">
          The first write-up is on its way. Check back shortly.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          {groups.map((group) => (
            <section key={group.letter} id={`letter-${group.letter}`}>
              <div className="flex items-center gap-4">
                <h2
                  aria-label={`Games beginning with ${group.letter}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center bg-purple font-display text-lg text-ink"
                >
                  {group.letter}
                </h2>
                <span
                  aria-hidden="true"
                  className="h-0.5 flex-1 bg-edge"
                />
                <span className="font-display text-[0.5625rem] text-ink-faint uppercase">
                  {group.games.length}
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.games.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
