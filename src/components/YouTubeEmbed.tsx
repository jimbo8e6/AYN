type Props = {
  videoId: string;
  title: string;
};

export default function YouTubeEmbed({ videoId, title }: Props) {
  return (
    <div className="mt-16">
      <div className="aspect-video w-full border border-line">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
