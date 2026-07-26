import Link from "next/link";
import GameCard from "@/components/GameCard";
import { countPlayed, getLatestGames } from "@/lib/games";
import { LIBRARY_TARGET, siteConfig } from "@/lib/site";

const PILLARS = [
  {
    label: "The Game",
    accent: "text-btn-a",
    bar: "bg-btn-a",
    body: "Played properly, not sampled for ten minutes. How it controls, where it drags, what it was actually trying to do, and whether any of it still holds up on the other side of thirty years.",
  },
  {
    label: "The People",
    accent: "text-btn-x",
    bar: "bg-btn-x",
    body: "Who built it, and what else they touched. The staff behind the tiny sprite scrolls — composers, directors, artists, and the studios that quietly made half the library before disappearing.",
  },
  {
    label: "The Press",
    accent: "text-btn-y",
    bar: "bg-btn-y",
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
      <section className="scanlines relative overflow-hidden border-b-2 border-edge bg-deep">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-purple/25 blur-[100px]"
        />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:py-28">
          <p className="font-display text-[0.625rem] tracking-widest text-console-dim uppercase">
            A 16-bit undertaking
          </p>

          <h1 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-5xl">
            <span className="block text-console-dim">SUPER</span>
            <span className="mt-3 block text-purple-bright">A&#8211;Z</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-dim">
            {siteConfig.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/games"
              className="pixel-lift bg-btn-b px-6 py-3.5 font-display text-[0.6875rem] text-void uppercase transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Start &gt;
            </Link>
            <a
              href="#the-quest"
              className="pixel-frame-thin bg-panel-raised px-6 py-3.5 font-display text-[0.6875rem] text-ink uppercase transition-colors hover:text-btn-b [--pixel-color:var(--color-purple)]"
            >
              The plan
            </a>
          </div>
        </div>
      </section>

      {/* The quest -------------------------------------------------- */}
      <section id="the-quest" className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-display text-base text-btn-b uppercase sm:text-lg">
          The quest
        </h2>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-dim">
          <p>
            The plan is simple to describe and faintly ridiculous to attempt:
            play <strong className="text-ink">every game</strong> released for
            the Super Nintendo, in alphabetical order, and write properly about
            each one.
          </p>
          <p>
            Not a list. Not a ranking. No tier charts. Every game gets the same
            treatment regardless of whether it is a stone-cold classic or a
            licensed platformer nobody has thought about since 1994 &mdash;
            because the forgotten ones are usually where the interesting
            stories are hiding.
          </p>
          <p>
            Starting at <strong className="text-ink">A</strong>, finishing at{" "}
            <strong className="text-ink">Z</strong>, however long that takes.
          </p>
        </div>

        {/* Progress readout */}
        <div className="pixel-frame mt-12 bg-panel p-6 [--pixel-color:var(--color-edge)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-[0.5625rem] text-ink-faint uppercase">
                Progress
              </p>
              <p className="mt-3 font-display text-xl text-purple-bright">
                {played}
                <span className="text-ink-faint">
                  {" / "}~{LIBRARY_TARGET.toLocaleString("en-GB")}
                </span>
              </p>
            </div>
            <p className="font-display text-[0.625rem] text-btn-b">
              {percent}%
            </p>
          </div>

          <div
            className="mt-5 h-4 w-full bg-void"
            role="img"
            aria-label={`${played} of roughly ${LIBRARY_TARGET} games written up, ${percent} per cent complete`}
          >
            <div
              className="h-full bg-btn-y"
              style={{ width: `${Math.max(Number(percent), 0.6)}%` }}
            />
          </div>

          <p className="mt-4 text-xs text-ink-faint">
            Comfortably within the margin of error of not having started.
          </p>
        </div>
      </section>

      {/* What each write-up covers ---------------------------------- */}
      <section className="border-y-2 border-edge bg-deep">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <h2 className="font-display text-base text-btn-b uppercase sm:text-lg">
            Every entry, three ways
          </h2>
          <p className="mt-4 max-w-2xl text-ink-dim">
            Each game gets the same three passes, so the write-ups stay
            comparable from A right through to Z.
          </p>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.label}
                className="pixel-frame-thin flex flex-col bg-panel [--pixel-color:var(--color-edge)]"
              >
                <span aria-hidden="true" className={`h-1.5 w-full ${pillar.bar}`} />
                <div className="p-6">
                  <h3
                    className={`font-display text-xs uppercase ${pillar.accent}`}
                  >
                    {pillar.label}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-dim">
                    {pillar.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest ----------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-base text-btn-b uppercase sm:text-lg">
            Latest write-ups
          </h2>
          <Link
            href="/games"
            className="font-display text-[0.625rem] text-purple-bright uppercase transition-colors hover:text-btn-b"
          >
            All games &gt;
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink-dim">
            Nothing published yet. The first entry is on its way.
          </p>
        )}
      </section>

      {/* Contact prompt --------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-5 pb-8">
        <div className="pixel-frame bg-panel p-8 text-center [--pixel-color:var(--color-purple)]">
          <h2 className="font-display text-xs text-ink uppercase">
            Got something to add?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-dim">
            Corrections, magazine scans, first-hand memories of shipping one of
            these things &mdash; all very welcome.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-block bg-purple px-6 py-3 font-display text-[0.625rem] text-ink uppercase transition-colors hover:bg-btn-b hover:text-void"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
