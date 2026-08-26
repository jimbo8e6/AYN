type Props = {
  videoId: string;
  title: string;
};

export default function YouTubeEmbed({ videoId, title }: Props) {
  return (
    <div className="mt-16">
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch ${title} on YouTube`}
        className="group relative block aspect-video w-full overflow-hidden border border-line"
      >
        <img
          src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
          alt=""
          className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/75 transition-colors duration-200 group-hover:bg-ink">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-1 h-7 w-7 fill-shell"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-shell drop-shadow">
            Watch on YouTube
          </span>
        </div>
      </a>
    </div>
  );
}
