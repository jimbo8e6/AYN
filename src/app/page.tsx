import Link from "next/link";
import AccentRule from "@/components/AccentRule";
import GameCard from "@/components/GameCard";
import { countPlayed, getLatestGames } from "@/lib/games";
import { LIBRARY_TARGET, siteConfig } from "@/lib/site";

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
            <span className="mt-1 block">A&#8211;X</span>
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
              href="#the-goal"
              className="border border-line px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-shell-light"
            >
              Read the goal
            </a>
          </div>
        </div>
      </section>

      {/* The goal --------------------------------------------------- */}
      <section id="the-goal" className="border-b border-line bg-shell-light">
        {/* Same max-w-5xl gutter as every other section, with the prose held to
            a comfortable measure inside it, so headings stay left-aligned
            down the whole page. */}
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="rule-heading">The goal</h2>
          <AccentRule className="mt-4" />

          <div className="mt-10 max-w-2xl space-y-7 font-serif text-xl leading-relaxed text-body">
            <p>
              My goal is to play, and deep dive into every English speaking
              Super Nintendo game in alphabetical order. A very demanding goal
              it may be, but the SNES will forever be my favourite console and
              there are far too many games I’ve never touched.
            </p>
            <p>
              I may have been an 80s baby, but I was very much a 90s kid, and
              the SNES is lucky enough to be an objectively brilliant console,
              and also a rose tinted nostalgia phenomenon all rolled into one.
            </p>
            <p>
              I aim to complete each game I play that can be completed, with a
              couple of caveats:
            </p>

            <ol className="ml-6 list-decimal space-y-5 marker:text-muted">
              <li>
                If it can’t be completed (a sports title for example) I will
                play as much of it as possible/bearable to give a well rounded
                description of the game.
              </li>
              <li>
                If it’s broken, with terrible controls and just all round an
                awful game, I’ll play as much of it as I can, but I will pack it
                in if it’s doing my head in.
              </li>
            </ol>

            <p>
              I’ll make sure to make it clear whether a game has been completed,
              or played.
            </p>
            <p>
              Each game will have my own personal thoughts, a look at the box
              and whether it sells the game accurately, some information about
              the people that worked on the game, and a look at the reviews from
              publications of the time.
            </p>
            <p>
              No set schedule, no expectations, just a fun journey that I’m
              taking myself on.
            </p>
            <p>
              If you want to support me in this ridiculous idea, I ask that you
              follow and support everyone at Studio Channel 84, because I
              wouldn’t have had the fire to push through this without all of
              them!
            </p>
            <p>
              Check them all out at{" "}
              <a
                href="https://channel84.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-deep underline decoration-1 underline-offset-4 transition-colors hover:text-red-deep"
              >
                channel84.co.uk
              </a>{" "}
              and tell them I sent you.
            </p>
            <p>
              See you in 2066 when I finish this stupid, stupid idea.
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
                / {LIBRARY_TARGET.toLocaleString("en-GB")}
              </span>
            </p>

            <div
              className="mt-6 h-2 w-full bg-shell-dark"
              role="img"
              aria-label={`${played} of ${LIBRARY_TARGET} games written up, ${percent} per cent complete`}
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
