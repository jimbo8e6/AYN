import Link from "next/link";
import AccentRule from "@/components/AccentRule";
import GameCard from "@/components/GameCard";
import { countPlayed, getLatestGames } from "@/lib/games";
import { LIBRARY_TARGET, siteConfig } from "@/lib/site";

const PILLARS = [
  {
    label: "The Game",
    bar: "bg-btn-red",
    body: "Played properly, not sampled for ten minutes. How it controls, where it drags, what it was actually trying to do, and whether any of it still holds up on the other side of thirty years.",
  },
  {
    label: "The People",
    bar: "bg-btn-blue",
    body: "Who built it, and what else they touched. The staff behind the tiny sprite scrolls — composers, directors, artists, and the studios that quietly made half the library before disappearing.",
  },
  {
    label: "The Press",
    bar: "bg-btn-green",
    body: "What the magazines of the day made of it. Super Play, Nintendo Power, Mean Machines, EGM — the scores, the hype, and the reviews that read very differently with hindsight.",
  },
];

export default function HomePage() {
  const latest = getLatestGames(3);
  const played = countPlayed();
  const percent = ((played / LIBRARY_TARGET) * 100).toFixed(2);

  return (
    <>
      {/* Hero ------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="eyebrow">A 16-bit undertaking</p>

          <h1 className="display mt-8 text-6xl sm:text-8xl">
            <span className="block text-muted">Super</span>
            <span className="mt-1 block">A&#8211;Z</span>
          </h1>

          <AccentRule className="mt-10" width="w-40" />

          <p className="mt-8 max-w-xl font-serif text-2xl leading-snug text-body">
            {siteConfig.tagline}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/games"
              className="bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-surface transition-opacity hover:opacity-80"
            >
              Browse the games
            </Link>
            <a
              href="#the-quest"
              className="border border-line px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-shell-light"
            >
              Read the plan
            </a>
          </div>
        </div>
      </section>

      {/* The quest -------------------------------------------------- */}
      <section id="the-quest" className="border-b border-line bg-shell-light">
        {/* Same max-w-5xl gutter as every other section, with the prose held to
            a comfortable measure inside it, so headings stay left-aligned
            down the whole page. */}
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="rule-heading">The quest</h2>
          <AccentRule className="mt-4" />

          <div className="mt-10 max-w-2xl space-y-7 font-serif text-xl leading-relaxed text-body">
            <p>
              The plan is simple to describe and faintly ridiculous to attempt:
              play <strong className="font-semibold text-ink">every game</strong>{" "}
              released for the Super Nintendo, in alphabetical order, and write
              properly about each one.
            </p>
            <p>
              Not a list. Not a ranking. No tier charts. Every game gets the
              same treatment regardless of whether it is a stone-cold classic or
              a licensed platformer nobody has thought about since 1994 &mdash;
              because the forgotten ones are usually where the interesting
              stories are hiding.
            </p>
            <p>
              Starting at <strong className="font-semibold text-ink">A</strong>,
              finishing at <strong className="font-semibold text-ink">Z</strong>,
              however long that takes.
            </p>
          </div>

          {/* Progress readout */}
          <div className="mt-14 max-w-2xl border border-line bg-surface p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="eyebrow">Progress</p>
              <p className="text-sm font-semibold text-muted">{percent}%</p>
            </div>

            <p className="mt-4 text-4xl font-light tracking-tight text-ink">
              {played}
              <span className="text-2xl text-muted">
                {" "}
                / ~{LIBRARY_TARGET.toLocaleString("en-GB")}
              </span>
            </p>

            <div
              className="mt-6 h-2 w-full bg-shell-dark"
              role="img"
              aria-label={`${played} of roughly ${LIBRARY_TARGET} games written up, ${percent} per cent complete`}
            >
              <div
                className="h-full bg-btn-green"
                style={{ width: `${Math.max(Number(percent), 0.5)}%` }}
              />
            </div>

            <p className="mt-5 text-sm text-muted">
              Comfortably within the margin of error of not having started.
            </p>
          </div>
        </div>
      </section>

      {/* What each write-up covers ---------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="rule-heading">Every entry, three ways</h2>
          <AccentRule className="mt-4" />
          <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-body">
            Each game gets the same three passes, so the write-ups stay
            comparable from A right through to Z.
          </p>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.label}
                className="flex flex-col border border-line bg-surface"
              >
                <span aria-hidden="true" className={`h-[3px] w-full ${pillar.bar}`} />
                <div className="p-7">
                  <h3 className="text-xl font-normal tracking-tight text-ink">
                    {pillar.label}
                  </h3>
                  <p className="mt-4 font-serif leading-relaxed text-body">
                    {pillar.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest ----------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2 className="rule-heading">Latest write-ups</h2>
            <AccentRule className="mt-4" />
          </div>
          <Link
            href="/games"
            className="text-sm font-medium text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            All games
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((game, index) => (
              <GameCard key={game.slug} game={game} index={index} />
            ))}
          </div>
        ) : (
          <p className="mt-10 font-serif text-lg text-body">
            Nothing published yet. The first entry is on its way.
          </p>
        )}
      </section>

      {/* Contact prompt --------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="border border-line bg-surface p-10 text-center sm:p-14">
          <h2 className="text-3xl font-light tracking-tight text-ink">
            Got something to add?
          </h2>
          <p className="mx-auto mt-5 max-w-md font-serif text-lg leading-relaxed text-body">
            Corrections, magazine scans, first-hand memories of shipping one of
            these things &mdash; all very welcome.
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-block bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-surface transition-opacity hover:opacity-80"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
