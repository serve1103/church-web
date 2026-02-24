import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { latestSermonsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { extractYouTubeId } from "@/lib/youtube";
import { formatDate } from "@/lib/date";
import { SERMON_CATEGORY_LABELS } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import type {
  LatestSermonBlock as LatestSermonBlockType,
  Sermon,
} from "@/types/sanity";

interface LatestSermonBlockProps {
  block: LatestSermonBlockType;
}

const getThumbUrl = (sermon: Sermon, width = 640, height = 360): string | null => {
  if (sermon.thumbnail) {
    return urlFor(sermon.thumbnail).width(width).height(height).url();
  }
  if (sermon.youtubeUrl) {
    const id = extractYouTubeId(sermon.youtubeUrl);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return null;
};

const LatestSermonBlock = async ({ block }: LatestSermonBlockProps) => {
  const count = block.count ?? 4;

  let sermons: Sermon[];
  try {
    const result = await sanityFetch({ query: latestSermonsQuery });
    const data = result.data as Sermon[];
    sermons = (data ?? []).slice(0, count);
  } catch {
    return null;
  }

  if (sermons.length === 0) return null;

  const featured = sermons[0];
  const rest = sermons.slice(1);
  const featuredThumbUrl = getThumbUrl(featured);

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "최신 설교"} />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Featured sermon */}
          <Link
            href={`/sermons/${featured.slug.current}`}
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
              {featuredThumbUrl && (
                <Image
                  src={featuredThumbUrl}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              )}
              {/* play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 fill-primary text-primary" />
                </div>
              </div>
              {/* category badge */}
              <span className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow">
                {SERMON_CATEGORY_LABELS[featured.category] ?? featured.category}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-text transition-colors group-hover:text-primary">
                {featured.title}
              </h3>
              <p className="mt-1.5 text-sm text-text-secondary">
                {featured.preacher && `${featured.preacher} · `}
                {formatDate(featured.date)}
                {featured.bibleText && ` · ${featured.bibleText}`}
              </p>
            </div>
          </Link>

          {/* Sermon list */}
          {rest.length > 0 && (
            <div className="space-y-4">
              {rest.map((sermon) => {
                const thumbUrl = getThumbUrl(sermon, 320, 180);
                return (
                  <Link
                    key={sermon._id}
                    href={`/sermons/${sermon.slug.current}`}
                    className="group flex gap-4 rounded-xl border border-border p-3 transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    {thumbUrl && (
                      <div className="relative h-[80px] w-[142px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={thumbUrl}
                          alt={sermon.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="142px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <Play className="h-6 w-6 fill-white text-white drop-shadow" />
                        </div>
                      </div>
                    )}
                    <div className="flex min-w-0 flex-col justify-center">
                      <span className="text-xs font-semibold text-accent">
                        {SERMON_CATEGORY_LABELS[sermon.category] ??
                          sermon.category}
                      </span>
                      <h4 className="mt-1 line-clamp-2 text-sm font-bold text-text transition-colors group-hover:text-primary">
                        {sermon.title}
                      </h4>
                      <p className="mt-1 text-xs text-text-secondary">
                        {sermon.preacher && `${sermon.preacher} · `}
                        {formatDate(sermon.date)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            설교 더보기
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestSermonBlock;
