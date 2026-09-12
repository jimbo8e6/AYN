import type { Metadata } from "next";
import Link from "next/link";
import AccentRule from "@/components/AccentRule";
import { getAllGames } from "@/lib/games";
import { LIBRARY_TARGET } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stats",
  description: "Running tallies, averages, and breakdowns for the Super A-Z project.",
};

function avg(total: number, count: number): string {
  return count > 0 ? (total / count).toFixed(2) : "—";
}

export default function StatsPage() {
  const games = getAllGames();
  const scored = games.filter((g) => g.score !== undefined);
  const played = games.filter((g) => g.status === "played");
  const upcoming = games.filter((g) => g.status === "upcoming");

  const totalScore = scored.reduce((s, g) => s + (g.score ?? 0), 0);
  const overallAvg = avg(totalScore, scored.length);

  // Score distribution 1–10
  const dist: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) dist[i] = 0;
  for (const g of scored) if (g.score !== undefined) dist[g.score]++;
  const distMax = Math.max(...Object.values(dist), 1);

  // Highest / lowest game
  const sortedByScore = [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const highestGame = sortedByScore[0];
  const lowestGame = sortedByScore[sortedByScore.length - 1];

  // By genre
  type Bucket = { count: number; total: number; scoredCount: number };
  const genreMap = new Map<string, Bucket>();
  for (const g of played) {
    for (const genre of g.genre) {
      const b = genreMap.get(genre) ?? { count: 0, total: 0, scoredCount: 0 };
      b.count++;
      if (g.score !== undefined) { b.total += g.score; b.scoredCount++; }
      genreMap.set(genre, b);
    }
  }
  const genreList = [...genreMap.entries()]
    .map(([genre, b]) => ({ genre, ...b, avg: b.scoredCount > 0 ? b.total / b.scoredCount : null }))
    .sort((a, b) => b.count - a.count);
  const scoredGenres = genreList.filter((g) => g.avg !== null).sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));
  const highestGenre = scoredGenres[0];
  const lowestGenre = scoredGenres[scoredGenres.length - 1];

  // By developer
  const devMap = new Map<string, Bucket>();
  for (const g of played) {
    if (!g.developer) continue;
    const b = devMap.get(g.developer) ?? { count: 0, total: 0, scoredCount: 0 };
    b.count++;
    if (g.score !== undefined) { b.total += g.score; b.scoredCount++; }
    devMap.set(g.developer, b);
  }
  const devList = [...devMap.entries()]
    .map(([dev, b]) => ({ dev, ...b }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // By publisher
  const pubMap = new Map<string, Bucket>();
  for (const g of played) {
    if (!g.publisher) continue;
    const b = pubMap.get(g.publisher) ?? { count: 0, total: 0, scoredCount: 0 };
    b.count++;
    if (g.score !== undefined) { b.total += g.score; b.scoredCount++; }
    pubMap.set(g.publisher, b);
  }
  const pubList = [...pubMap.entries()]
    .map(([pub, b]) => ({ pub, ...b }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // By letter
  const letterMap = new Map<string, Bucket>();
  for (const g of played) {
    const b = letterMap.get(g.letter) ?? { count: 0, total: 0, scoredCount: 0 };
    b.count++;
    if (g.score !== undefined) { b.total += g.score; b.scoredCount++; }
    letterMap.set(g.letter, b);
  }
  const letterList = [...letterMap.entries()]
    .map(([letter, b]) => ({ letter, ...b }))
    .sort((a, b) => {
      if (a.letter === "#") return -1;
      if (b.letter === "#") return 1;
      return a.letter.localeCompare(b.letter);
    });

  // By region
  const regionMap = new Map<string, number>();
  for (const g of played) {
    if (!g.region) continue;
    regionMap.set(g.region, (regionMap.get(g.region) ?? 0) + 1);
  }
  const regionList = [...regionMap.entries()].sort((a, b) => b[1] - a[1]);

  // By year
  const yearMap = new Map<string, number>();
  for (const g of played) {
    if (!g.released) continue;
    const year = g.released.slice(0, 4);
    yearMap.set(year, (yearMap.get(year) ?? 0) + 1);
  }
  const yearList = [...yearMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20">
      <header className="pt-20 pb-14">
        <p className="eyebrow">By the numbers</p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">Stats</h1>
        <AccentRule className="mt-8" width="w-32" />
        <p className="mt-8 max-w-2xl font-serif text-xl leading-relaxed text-body">
          A running tally of everything covered so far.
        </p>
      </header>

      {/* Overview */}
      <section>
        <h2 className="rule-heading">Overview</h2>
        <AccentRule className="mt-4" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Reviewed", value: played.length },
            { label: "Still to play", value: LIBRARY_TARGET - played.length },
            { label: "Overall average", value: overallAvg === "—" ? "—" : `${overallAvg}/10` },
            { label: "Total on the list", value: LIBRARY_TARGET },
          ].map(({ label, value }) => (
            <div key={label} className="border border-line bg-surface p-6">
              <p className="text-3xl font-light tracking-tight text-ink">{value}</p>
              <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
            </div>
          ))}
        </div>

        {(highestGame || lowestGame) && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {highestGame && (
              <div className="border border-line bg-surface p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Highest rated</p>
                <Link href={`/games/${highestGame.slug}`} className="mt-2 block text-xl font-light text-ink underline decoration-btn-yellow decoration-2 underline-offset-4 hover:text-btn-red">
                  {highestGame.title}
                </Link>
                <p className="mt-1 text-3xl font-light tracking-tight text-ink">
                  {highestGame.score}<span className="text-lg text-muted">/10</span>
                </p>
              </div>
            )}
            {lowestGame && (
              <div className="border border-line bg-surface p-6">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Lowest rated</p>
                <Link href={`/games/${lowestGame.slug}`} className="mt-2 block text-xl font-light text-ink underline decoration-btn-yellow decoration-2 underline-offset-4 hover:text-btn-red">
                  {lowestGame.title}
                </Link>
                <p className="mt-1 text-3xl font-light tracking-tight text-ink">
                  {lowestGame.score}<span className="text-lg text-muted">/10</span>
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Score distribution */}
      {scored.length > 0 && (
        <section className="mt-16">
          <h2 className="rule-heading">Score distribution</h2>
          <AccentRule className="mt-4" />
          <div className="mt-8 border border-line bg-surface p-6 sm:p-8">
            <div className="flex items-end gap-1 sm:gap-2">
              {Object.entries(dist).map(([score, count]) => {
                const BAR_MAX = 120;
                const barPx = count > 0 ? Math.max(Math.round((count / distMax) * BAR_MAX), 8) : 2;
                return (
                  <div key={score} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] text-muted sm:text-xs">{count > 0 ? count : ""}</span>
                    <div
                      className="w-full"
                      style={{
                        height: `${barPx}px`,
                        backgroundColor: count > 0 ? "var(--color-ink)" : "var(--color-shell-dark)",
                      }}
                    />
                    <span className="mt-1 text-[10px] font-semibold text-muted sm:text-xs">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* By genre */}
      <section className="mt-16">
        <h2 className="rule-heading">By genre</h2>
        <AccentRule className="mt-4" />

        {highestGenre && lowestGenre && highestGenre.genre !== lowestGenre.genre && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border border-line bg-surface p-6">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Highest rated genre</p>
              <p className="mt-2 text-2xl font-light text-ink">{highestGenre.genre}</p>
              <p className="mt-1 text-sm text-muted">
                avg {highestGenre.avg?.toFixed(2)}/10 across {highestGenre.scoredCount} {highestGenre.scoredCount === 1 ? "game" : "games"}
              </p>
            </div>
            <div className="border border-line bg-surface p-6">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Lowest rated genre</p>
              <p className="mt-2 text-2xl font-light text-ink">{lowestGenre.genre}</p>
              <p className="mt-1 text-sm text-muted">
                avg {lowestGenre.avg?.toFixed(2)}/10 across {lowestGenre.scoredCount} {lowestGenre.scoredCount === 1 ? "game" : "games"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 divide-y divide-line border border-line bg-surface">
          {genreList.map(({ genre, count, avg: gAvg, scoredCount }) => (
            <div key={genre} className="flex items-center justify-between px-6 py-3">
              <span className="font-serif text-body">{genre}</span>
              <span className="flex gap-4 text-sm text-muted">
                <span>{count} {count === 1 ? "game" : "games"}</span>
                {gAvg !== null && scoredCount > 0 && (
                  <span className="tabular-nums">avg {gAvg.toFixed(2)}/10</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* By developer */}
      <section className="mt-16">
        <h2 className="rule-heading">By developer</h2>
        <AccentRule className="mt-4" />
        <div className="mt-6 divide-y divide-line border border-line bg-surface">
          {devList.map(({ dev, count, total, scoredCount }) => (
            <div key={dev} className="flex items-center justify-between px-6 py-3">
              <span className="font-serif text-body">{dev}</span>
              <span className="flex gap-4 text-sm text-muted">
                <span>{count} {count === 1 ? "game" : "games"}</span>
                {scoredCount > 0 && <span className="tabular-nums">avg {avg(total, scoredCount)}/10</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* By publisher */}
      <section className="mt-16">
        <h2 className="rule-heading">By publisher</h2>
        <AccentRule className="mt-4" />
        <div className="mt-6 divide-y divide-line border border-line bg-surface">
          {pubList.map(({ pub, count, total, scoredCount }) => (
            <div key={pub} className="flex items-center justify-between px-6 py-3">
              <span className="font-serif text-body">{pub}</span>
              <span className="flex gap-4 text-sm text-muted">
                <span>{count} {count === 1 ? "game" : "games"}</span>
                {scoredCount > 0 && <span className="tabular-nums">avg {avg(total, scoredCount)}/10</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* By letter */}
      <section className="mt-16">
        <h2 className="rule-heading">By letter</h2>
        <AccentRule className="mt-4" />
        <div className="mt-6 divide-y divide-line border border-line bg-surface">
          {letterList.map(({ letter, count, total, scoredCount }) => (
            <div key={letter} className="flex items-center justify-between px-6 py-3">
              <span className="font-semibold text-ink">{letter}</span>
              <span className="flex gap-4 text-sm text-muted">
                <span>{count} {count === 1 ? "game" : "games"}</span>
                {scoredCount > 0 && <span className="tabular-nums">avg {avg(total, scoredCount)}/10</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* By release year */}
      {yearList.length > 0 && (
        <section className="mt-16">
          <h2 className="rule-heading">By release year</h2>
          <AccentRule className="mt-4" />
          <div className="mt-6 divide-y divide-line border border-line bg-surface">
            {yearList.map(([year, count]) => (
              <div key={year} className="flex items-center justify-between px-6 py-3">
                <span className="font-serif text-body">{year}</span>
                <span className="text-sm text-muted">{count} {count === 1 ? "game" : "games"}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* By region */}
      {regionList.length > 0 && (
        <section className="mt-16">
          <h2 className="rule-heading">By region</h2>
          <AccentRule className="mt-4" />
          <div className="mt-6 divide-y divide-line border border-line bg-surface">
            {regionList.map(([region, count]) => (
              <div key={region} className="flex items-center justify-between px-6 py-3">
                <span className="font-serif text-body">{region}</span>
                <span className="text-sm text-muted">{count} {count === 1 ? "game" : "games"}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
