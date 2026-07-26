import type { MagazineReview } from "@/lib/games";

/** Accents cycle through the Super Famicom button colours. */
const ACCENTS = ["bg-btn-a", "bg-btn-b", "bg-btn-x", "bg-btn-y"];

export default function MagazineReviews({
  reviews,
}: {
  reviews: MagazineReview[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-[0.9375rem] text-btn-b uppercase">
        What the press said
      </h2>
      <p className="mt-3 text-sm text-ink-faint">
        Contemporary reviews, quoted from the magazines of the day.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {reviews.map((review, index) => (
          <li
            key={`${review.magazine}-${review.issue ?? index}`}
            className="pixel-frame-thin flex flex-col bg-panel [--pixel-color:var(--color-edge)]"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-full ${ACCENTS[index % ACCENTS.length]}`}
            />

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-[0.6875rem] leading-relaxed text-ink">
                    {review.magazine}
                  </p>
                  <p className="mt-1.5 text-xs text-ink-faint">
                    {[review.issue, review.date].filter(Boolean).join(" · ")}
                  </p>
                </div>

                {review.score && (
                  <span className="shrink-0 bg-panel-raised px-2.5 py-1.5 font-display text-xs text-btn-b">
                    {review.score}
                  </span>
                )}
              </div>

              {review.quote && (
                <blockquote className="mt-auto border-l-2 border-purple pl-3 text-sm leading-relaxed text-ink-dim italic">
                  &ldquo;{review.quote}&rdquo;
                  {review.reviewer && (
                    <footer className="mt-2 text-xs text-ink-faint not-italic">
                      &mdash; {review.reviewer}
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
