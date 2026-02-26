import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  sermonsQuery,
  sermonsByCategoryQuery,
  sermonsCountQuery,
  sermonsCountByCategoryQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { extractYouTubeId } from "@/lib/youtube";
import { formatDate } from "@/lib/date";
import { SERMON_CATEGORY_LABELS } from "@/lib/constants";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";
import type { Sermon } from "@/types/sanity";

export const metadata: Metadata = {
  title: "설교",
  description: "남문교회 설교 - 주일오전, 수요, 새벽, 특별 예배설교 영상",
};

const PER_PAGE = 12;

const CATEGORY_TABS = [
  { key: "all", label: "전체" },
  ...Object.entries(SERMON_CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
  })),
];

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

interface SermonsPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const category = params.category;
  const hasCategory =
    category && Object.keys(SERMON_CATEGORY_LABELS).includes(category);

  const start = (currentPage - 1) * PER_PAGE;
  const end = currentPage * PER_PAGE;

  const [sermonsResult, countResult] = await Promise.all([
    hasCategory
      ? sanityFetch({
          query: sermonsByCategoryQuery,
          params: { start, end, category },
        })
      : sanityFetch({
          query: sermonsQuery,
          params: { start, end },
        }),
    hasCategory
      ? sanityFetch({
          query: sermonsCountByCategoryQuery,
          params: { category },
        })
      : sanityFetch({ query: sermonsCountQuery }),
  ]);

  const sermons = (sermonsResult.data as Sermon[]) ?? [];
  const totalCount = (countResult.data as number) ?? 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  const filterSearchParams: Record<string, string> = {};
  if (hasCategory) {
    filterSearchParams.category = category;
  }

  return (
    <>
      <PageHeader title="설교" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {/* Category filter tabs */}
        <nav className="mb-8 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive =
              tab.key === "all" ? !hasCategory : category === tab.key;
            const href =
              tab.key === "all"
                ? "/sermons"
                : `/sermons?category=${tab.key}`;

            return (
              <Link
                key={tab.key}
                href={href}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Sermon grid */}
        {sermons.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-text-secondary">등록된 설교가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => {
              const thumbUrl = getThumbUrl(sermon);
              return (
                <Link
                  key={sermon._id}
                  href={`/sermons/${sermon.slug.current}`}
                  className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-surface">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={sermon.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl text-text-secondary/30">
                          &#9654;
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-accent">
                      {SERMON_CATEGORY_LABELS[sermon.category] ??
                        sermon.category}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold text-text group-hover:text-primary">
                      {sermon.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {sermon.preacher && `${sermon.preacher} · `}
                      {formatDate(sermon.date)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/sermons"
          searchParams={filterSearchParams}
        />
      </div>
    </>
  );
}
