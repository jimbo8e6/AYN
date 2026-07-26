import type { GameStatus } from "@/lib/games";

const STATUS_STYLES: Record<GameStatus, { label: string; className: string }> = {
  played: { label: "Played", className: "bg-btn-y/20 text-btn-y" },
  playing: { label: "Playing now", className: "bg-btn-b/20 text-btn-b" },
  upcoming: { label: "Up next", className: "bg-purple/25 text-purple-pale" },
};

export default function StatusBadge({ status }: { status: GameStatus }) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 font-display text-[0.5rem] uppercase ${className}`}
    >
      <span aria-hidden="true" className="text-[0.6rem] leading-none">
        &#9679;
      </span>
      {label}
    </span>
  );
}
