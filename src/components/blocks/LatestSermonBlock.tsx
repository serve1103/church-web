import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { latestSermonsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { extractYouTubeId } from "@/lib/youtube";
import { formatDate } from "@/lib/date";
import { SERMON_CATEGORY_LABELS } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import type { LatestSermonBlock as LatestSermonBlockType, Sermon } from "@/types/sanity";

interface LatestSermonBlockProps {
  block: LatestSermonBlockType;
}

const getThumbUrl = (sermon: Sermon): string | null => {
  if (sermon.thumbnail) {
    return urlFor(sermon.thumbnail).width(640).height(360).url();
  }
  if (sermon.youtubeUrl) {
    const id = extractYouTubeId(sermon.youtubeUrl);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return null;
};

const getSmallThumbUrl = (sermon: Sermon): string | null => {
  if (sermon.thumbnail) {
    return urlFor(sermon.thumbnail).width(160).height(90).url();
  }
  if (sermon.youtubeUrl) {
    const id = extractYouTubeId(sermon.youtubeUrl);
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }
  return null;
};

const LatestSermonBlock = async ({ block }: LatestSermonBlockProps) => {
  const count = block.count ?? 3;

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
    <section className="px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "최신 설교"} />
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {featuredThumbUrl && (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={featuredThumbUrl}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}
            <div className="mt-4">
              <span className="text-sm font-medium text-accent">
                {SERMON_CATEGORY_LABELS[featured.category] ?? featured.category}
              </span>
              <h3 className="mt-1 text-xl font-bold text-text">
                {featured.title}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {featured.preacher && `${featured.preacher} · `}
                {formatDate(featured.date)}
              </p>
            </div>
          </div>

          {rest.length > 0 && (
            <ul className="space-y-4">
              {rest.map((sermon) => {
                const thumbUrl = getSmallThumbUrl(sermon);
                return (
                  <li
                    key={sermon._id}
                    className="flex gap-4 rounded-lg border border-gray-100 p-3"
                  >
                    {thumbUrl && (
                      <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={thumbUrl}
                          alt={sermon.title}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-accent">
                        {SERMON_CATEGORY_LABELS[sermon.category] ?? sermon.category}
                      </span>
                      <h4 className="mt-0.5 truncate text-sm font-semibold text-text">
                        {sermon.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {sermon.preacher && `${sermon.preacher} · `}
                        {formatDate(sermon.date)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sermons"
            className="inline-block rounded-lg border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            설교 더보기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestSermonBlock;
