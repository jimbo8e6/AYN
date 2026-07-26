import type { GameStatus } from "@/lib/games";

/**
 * Dot colours are the vivid button colours; the label uses the darkened
 * variant so small text stays legible on a light background.
 */
const STATUS_STYLES: Record<
  GameStatus,
  { label: string; dot: string; text: string }
> = {
  played: {
    label: "Played",
    dot: "bg-btn-green",
    text: "text-green-deep",
  },
  playing: {
    label: "Playing now",
    dot: "bg-btn-yellow",
    text: "text-yellow-deep",
  },
  upcoming: {
    label: "Up next",
    dot: "bg-line",
    text: "text-muted",
  },
};

export default function StatusBadge({ status }: { status: GameStatus }) {
  const { label, dot, text } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase ${text}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
