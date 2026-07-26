import type { MagazineReview } from "@/lib/games";

/** Accents cycle through the four controller-button colours. */
const ACCENTS = ["bg-btn-red", "bg-btn-yellow", "bg-btn-blue", "bg-btn-green"];

export default function MagazineReviews({
  reviews,
}: {
  reviews: MagazineReview[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="rule-heading border-b border-line pb-4">
        What the press said
      </h2>
      <p className="mt-4 text-sm text-muted">
        Contemporary reviews, quoted from the magazines of the day.
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {reviews.map((review, index) => (
          <li
            key={`${review.magazine}-${review.issue ?? index}`}
            className="flex flex-col border border-line bg-surface"
          >
            <span
              aria-hidden="true"
              className={`h-[3px] w-full ${ACCENTS[index % ACCENTS.length]}`}
            />

            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold tracking-tight text-ink">
                    {review.magazine}
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-muted uppercase">
                    {[review.issue, review.date].filter(Boolean).join(" · ")}
                  </p>
                </div>

                {review.score && (
                  <span className="shrink-0 border border-line px-3 py-1.5 text-sm font-semibold text-ink">
                    {review.score}
                  </span>
                )}
              </div>

              {review.quote && (
                <blockquote className="mt-auto font-serif text-[1.0625rem] leading-relaxed text-body italic">
                  &ldquo;{review.quote}&rdquo;
                  {review.reviewer && (
                    <footer className="mt-3 font-sans text-xs tracking-wide text-muted uppercase not-italic">
                      {review.reviewer}
                    </footer>
                  )}
                </blockquote>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
