import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  noticesQuery,
  noticesCountQuery,
  latestBulletinQuery,
  latestSermonsForSidebarQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getFileUrl } from "@/sanity/lib/file";
import { formatDate } from "@/lib/date";
import PageHeader from "@/components/ui/PageHeader";
import NewsTabNav from "@/components/ui/NewsTabNav";
import Pagination from "@/components/ui/Pagination";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
import type { Notice, Bulletin } from "@/types/sanity";

export const metadata: Metadata = {
  title: "교회소식",
  description: "남문교회 공지사항, 교회 소식",
};

const PER_PAGE = 15;

interface SidebarSermon {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
}

const NoticesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [noticesResult, countResult, bulletinResult, sermonsResult] =
    await Promise.all([
      sanityFetch({ query: noticesQuery, params: { start, end } }),
      sanityFetch({ query: noticesCountQuery }),
      sanityFetch({ query: latestBulletinQuery }),
      sanityFetch({ query: latestSermonsForSidebarQuery }),
    ]);

  const notices = noticesResult.data as Notice[];
  const totalCount = countResult.data as number;
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const latestBulletin = bulletinResult.data as Bulletin | null;
  const latestSermons = sermonsResult.data as SidebarSermon[];

  return (
    <>
      <PageHeader title="공지사항" />
      <NewsTabNav />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main content */}
          <section className="min-w-0 flex-1">
            {notices.length === 0 ? (
              <div className="flex min-h-[30vh] items-center justify-center">
                <p className="text-text-secondary">
                  등록된 공지사항이 없습니다.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notices.map((notice) => (
                  <li key={notice._id}>
                    <Link
                      href={`/notices/${notice.slug.current}`}
                      className="block px-2 py-4 transition-colors hover:bg-surface sm:px-4"
                    >
                      <div className="flex items-center gap-3">
                        {notice.isPinned && (
                          <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                            중요
                          </span>
                        )}
                        {notice.category === "event" && (
                          <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            행사
                          </span>
                        )}
                        <span
                          className={`min-w-0 flex-1 truncate text-text ${notice.isPinned ? "font-semibold" : ""}`}
                        >
                          {notice.title}
                        </span>
                        <time className="shrink-0 text-sm text-text-secondary">
                          {formatDate(notice.publishedAt)}
                        </time>
                      </div>
                      {notice.excerpt && (
                        <p className="mt-1 truncate pl-2 text-sm text-text-secondary sm:pl-4">
                          {notice.excerpt}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/notices"
            />
          </section>

          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="space-y-8">
              {/* 이번 주 주보 */}
              {latestBulletin?.file?.asset?._ref && (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-text">
                    이번 주 주보
                  </h3>
                  <a
                    href={getFileUrl(latestBulletin.file.asset._ref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[3/4] w-full bg-surface">
                      {latestBulletin.coverImage ? (
                        <Image
                          src={urlFor(latestBulletin.coverImage)
                            .width(300)
                            .height(400)
                            .url()}
                          alt={latestBulletin.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-[1.02]"
                          sizes="288px"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-text-secondary">
                          <FileText className="h-10 w-10" />
                          <span className="text-sm">주보</span>
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2 text-center">
                      <p className="text-sm font-medium text-text">
                        {latestBulletin.title}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDate(latestBulletin.date)}
                      </p>
                    </div>
                  </a>
                </div>
              )}

              {/* 최신 설교 */}
              {latestSermons.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-text">
                    최신 설교
                  </h3>
                  <ul className="space-y-3">
                    {latestSermons.map((sermon) => (
                      <li key={sermon._id}>
                        <Link
                          href={`/sermons/${sermon.slug.current}`}
                          className="block rounded-lg p-2 transition-colors hover:bg-surface"
                        >
                          <p className="text-sm font-medium text-text">
                            {sermon.title}
                          </p>
                          <p className="mt-0.5 text-xs text-text-secondary">
                            {formatDate(sermon.date)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default NoticesPage;
