type Props = {
  videoId: string;
  title: string;
  label?: string;
};

export default function YouTubeEmbed({ videoId, title, label }: Props) {
  return (
    <div className="mt-4 flex flex-col items-start">
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch on YouTube: ${label ?? title}`}
        className="group relative block w-1/2 aspect-video overflow-hidden border border-line"
      >
        <img
          src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
          alt=""
          className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/75 transition-colors duration-200 group-hover:bg-ink">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-0.5 h-5 w-5 fill-shell"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wide text-shell drop-shadow">
            Watch on YouTube
          </span>
        </div>
      </a>

      {label && (
        <p className="mt-3 text-sm text-muted">{label}</p>
      )}
    </div>
  );
}
