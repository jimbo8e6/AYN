/**
 * The four controller buttons reduced to a rule — the site's one repeating
 * signature, used under headings and along the tops of cards.
 */
export default function AccentRule({
  className = "",
  width = "w-24",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-[3px] ${width} overflow-hidden ${className}`}
    >
      <span className="flex-1 bg-btn-red" />
      <span className="flex-1 bg-btn-yellow" />
      <span className="flex-1 bg-btn-blue" />
      <span className="flex-1 bg-btn-green" />
    </div>
  );
}
