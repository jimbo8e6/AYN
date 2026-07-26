import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MagazineReviews from "@/components/MagazineReviews";
import StatusBadge from "@/components/StatusBadge";
import { formatReleased, getAllGames, getGame } from "@/lib/games";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGames().map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) return { title: "Not found" };

  const description =
    game.excerpt ??
    `A deep dive into ${game.title} for the Super Nintendo — the game, the people who made it, and what the magazines said at the time.`;

  return {
    title: game.title,
    description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: {
      type: "article",
      title: game.title,
      description,
      url: `/games/${game.slug}`,
    },
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) notFound();

  const all = getAllGames();
  const index = all.findIndex((entry) => entry.slug === game.slug);
  const previous = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;

  const facts = [
    { label: "Developer", value: game.developer },
    { label: "Publisher", value: game.publisher },
    { label: "Released", value: formatReleased(game.released) },
    { label: "Region", value: game.region },
    { label: "Players", value: game.players },
    { label: "Genre", value: game.genre.join(", ") || undefined },
    { label: "Played on", value: game.playedOn },
  ].filter((fact): fact is { label: string; value: string } =>
    Boolean(fact.value),
  );

  return (
    <article className="mx-auto max-w-3xl px-5 pb-16">
      <nav className="pt-8" aria-label="Breadcrumb">
        <Link
          href="/games"
          className="font-display text-[0.625rem] text-ink-faint uppercase transition-colors hover:text-btn-b"
        >
          &lt; All games
        </Link>
      </nav>

      {/* Title block ------------------------------------------------ */}
      <header className="mt-8 border-b-2 border-edge pb-10">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center bg-purple font-display text-lg text-ink"
          >
            {game.letter}
          </span>
          <StatusBadge status={game.status} />
        </div>

        <h1 className="mt-6 font-display text-xl leading-relaxed text-ink sm:text-2xl">
          {game.title}
        </h1>

        {game.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-ink-dim">
            {game.excerpt}
          </p>
        )}
      </header>

      {/* Spec sheet ------------------------------------------------- */}
      {facts.length > 0 && (
        <dl className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-l-2 border-purple pl-4"
            >
              <dt className="font-display text-[0.5625rem] text-ink-faint uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Body ------------------------------------------------------- */}
      <div className="article mt-14">
        <Markdown remarkPlugins={[remarkGfm]}>{game.content}</Markdown>
      </div>

      {/* Verdict ---------------------------------------------------- */}
      {(game.verdict || typeof game.score === "number") && (
        <section className="pixel-frame mt-14 bg-panel p-7 [--pixel-color:var(--color-btn-b)]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <h2 className="font-display text-xs text-btn-b uppercase">
              The verdict
            </h2>
            {typeof game.score === "number" && (
              <p className="font-display text-2xl text-ink">
                {game.score}
                <span className="text-sm text-ink-faint">/10</span>
              </p>
            )}
          </div>
          {game.verdict && (
            <p className="mt-5 leading-relaxed text-ink-dim">{game.verdict}</p>
          )}
        </section>
      )}

      <MagazineReviews reviews={game.magazineReviews} />

      {/* Prev / next ------------------------------------------------ */}
      {(previous || next) && (
        <nav
          aria-label="Alphabetical navigation"
          className="mt-16 grid gap-4 border-t-2 border-edge pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/games/${previous.slug}`}
              className="pixel-frame-thin bg-panel p-5 transition-colors hover:bg-panel-raised [--pixel-color:var(--color-edge)] hover:[--pixel-color:var(--color-purple-bright)]"
            >
              <span className="font-display text-[0.5625rem] text-ink-faint uppercase">
                &lt; Previous
              </span>
              <span className="mt-3 block font-display text-[0.6875rem] leading-relaxed text-ink">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/games/${next.slug}`}
              className="pixel-frame-thin bg-panel p-5 text-right transition-colors hover:bg-panel-raised [--pixel-color:var(--color-edge)] hover:[--pixel-color:var(--color-purple-bright)]"
            >
              <span className="font-display text-[0.5625rem] text-ink-faint uppercase">
                Next &gt;
              </span>
              <span className="mt-3 block font-display text-[0.6875rem] leading-relaxed text-ink">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
