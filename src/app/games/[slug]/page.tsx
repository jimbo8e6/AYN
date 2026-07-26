import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AccentRule from "@/components/AccentRule";
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
  ].filter((fact): fact is { label: string; value: string } =>
    Boolean(fact.value),
  );

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20">
      <nav className="pt-10" aria-label="Breadcrumb">
        <Link
          href="/games"
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink"
        >
          All games
        </Link>
      </nav>

      {/* Title block ------------------------------------------------ */}
      <header className="mt-10 border-b border-line pb-12">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="text-sm font-semibold tracking-[0.12em] text-muted uppercase"
          >
            {game.letter}
          </span>
          <span aria-hidden="true" className="h-px w-6 bg-line" />
          <StatusBadge status={game.status} />
        </div>

        <h1 className="display mt-7 text-4xl sm:text-5xl">{game.title}</h1>

        <AccentRule className="mt-8" width="w-28" />

        {game.excerpt && (
          <p className="mt-8 font-serif text-xl leading-relaxed text-body">
            {game.excerpt}
          </p>
        )}
      </header>

      {/* Spec sheet ------------------------------------------------- */}
      {facts.length > 0 && (
        <dl className="mt-12 grid gap-x-10 gap-y-6 border-b border-line pb-12 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-2 text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Body ------------------------------------------------------- */}
      <div className="article mt-14">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Box art scans sit well below the fold, so never block paint on
            // them. Plain <img> rather than next/image: these are local files
            // of unknown dimensions, and next/image needs them up front.
            img: ({ alt, ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />
            ),
          }}
        >
          {game.content}
        </Markdown>
      </div>

      {/* Verdict ---------------------------------------------------- */}
      {(game.verdict || typeof game.score === "number") && (
        <section className="mt-16 border border-line bg-surface">
          <AccentRule width="w-full" />
          <div className="p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-5">
              <h2 className="rule-heading">The verdict</h2>
              {typeof game.score === "number" && (
                <p className="text-4xl font-light tracking-tight text-ink">
                  {game.score}
                  <span className="text-xl text-muted">/10</span>
                </p>
              )}
            </div>
            {game.verdict && (
              <p className="mt-6 font-serif text-lg leading-relaxed text-body">
                {game.verdict}
              </p>
            )}
          </div>
        </section>
      )}

      <MagazineReviews reviews={game.magazineReviews} />

      {/* Prev / next ------------------------------------------------ */}
      {(previous || next) && (
        <nav
          aria-label="Alphabetical navigation"
          className="mt-20 grid gap-6 border-t border-line pt-10 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/games/${previous.slug}`}
              className="group border border-line bg-surface p-6 transition-shadow hover:shadow-lg"
            >
              <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
                Previous
              </span>
              <span className="mt-3 block text-lg tracking-tight text-ink">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/games/${next.slug}`}
              className="group border border-line bg-surface p-6 text-right transition-shadow hover:shadow-lg"
            >
              <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
                Next
              </span>
              <span className="mt-3 block text-lg tracking-tight text-ink">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
