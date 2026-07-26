import type { Metadata } from "next";
import AccentRule from "@/components/AccentRule";
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
    <div className="pb-20">
      <header className="mx-auto max-w-5xl px-6 pt-20 pb-14">
        <p className="eyebrow">The library</p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">Games</h1>
        <AccentRule className="mt-8" width="w-32" />
        <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-body">
          Everything played and written up so far, in the only order that
          matters.
          {total === 0 ? " Nothing here yet." : null}
        </p>
        {total > 0 && (
          <p className="mt-6 text-sm text-muted">
            {total} {total === 1 ? "entry" : "entries"}
          </p>
        )}
      </header>

      <AlphabetNav activeLetters={activeLetters} />

      {groups.length === 0 ? (
        <p className="mx-auto max-w-5xl px-6 py-24 text-center font-serif text-lg text-body">
          The first write-up is on its way. Check back shortly.
        </p>
      ) : (
        <div className="mx-auto mt-16 flex max-w-5xl flex-col gap-20 px-6">
          {groups.map((group) => (
            <section key={group.letter} id={`letter-${group.letter}`}>
              <div className="flex items-baseline gap-5 border-b border-line pb-4">
                <h2
                  aria-label={`Games beginning with ${group.letter}`}
                  className="text-5xl font-light tracking-tight text-ink"
                >
                  {group.letter}
                </h2>
                <span className="text-sm text-muted">
                  {group.games.length}{" "}
                  {group.games.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.games.map((game, index) => (
                  <GameCard key={game.slug} game={game} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
