"use client";

type Video = { id: string; label?: string };

type Props = {
  videos: Video[];
  title: string;
};

function Thumbnail({ video, title }: { video: Video; title: string }) {
  return (
    <div className="flex flex-1 max-w-[50%] flex-col">
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch on YouTube: ${video.label ?? title}`}
        className="group relative block aspect-video overflow-hidden border border-line bg-ink"
      >
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

      {video.label && (
        <p className="mt-2 text-sm text-muted">{video.label}</p>
      )}
    </div>
  );
}

export default function YouTubeEmbed({ videos, title }: Props) {
  if (videos.length === 0) return null;

  return (
    <div className="mt-4 flex gap-3">
      {videos.map((video) => (
        <Thumbnail key={video.id} video={video} title={title} />
      ))}
    </div>
  );
}
