import { extractYouTubeId } from "@/lib/youtube";
import type { YoutubeBlock as YoutubeBlockType } from "@/types/sanity";

interface YoutubeBlockProps {
  block: YoutubeBlockType;
}

const YoutubeBlock = ({ block }: YoutubeBlockProps) => {
  const videoId = extractYouTubeId(block.url);
  if (!videoId) return null;

  return (
    <section className="px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={block.caption ?? "YouTube 동영상"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {block.caption && (
          <p className="mt-3 text-center text-sm text-text-secondary">
            {block.caption}
          </p>
        )}
      </div>
    </section>
  );
};

export default YoutubeBlock;
