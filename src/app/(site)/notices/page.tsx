import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  noticesQuery,
  noticesCountQuery,
} from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import PageHeader from "@/components/ui/PageHeader";
import NewsTabNav from "@/components/ui/NewsTabNav";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";
import type { Notice } from "@/types/sanity";

export const metadata: Metadata = {
  title: "교회소식",
  description: "남문교회 공지사항, 교회 소식",
};

const PER_PAGE = 15;

const NoticesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [noticesResult, countResult] = await Promise.all([
    sanityFetch({ query: noticesQuery, params: { start, end } }),
    sanityFetch({ query: noticesCountQuery }),
  ]);

  const notices = (noticesResult.data as Notice[] | null) ?? [];
  const totalCount = (countResult.data as number | null) ?? 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <PageHeader title="공지사항" />
      <NewsTabNav />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
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
                  className="block px-2 py-4 transition-colors hover:bg-surface sm:px-4 min-h-[44px]"
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
                      className={`min-w-0 flex-1 line-clamp-2 text-text sm:line-clamp-1 ${notice.isPinned ? "font-semibold" : ""}`}
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
      </div>
    </>
  );
};

export default NoticesPage;
