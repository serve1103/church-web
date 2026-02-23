import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { noticesQuery, noticesCountQuery } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";
import type { Notice } from "@/types/sanity";

export const metadata: Metadata = {
  title: "공지사항 | 남문교회",
  description: "남문교회 공지사항 목록입니다.",
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
    sanityFetch({
      query: noticesQuery,
      params: { start, end },
    }),
    sanityFetch({
      query: noticesCountQuery,
    }),
  ]);

  const notices = noticesResult.data as Notice[];
  const totalCount = countResult.data as number;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <PageHeader title="공지사항" />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        {notices.length === 0 ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <p className="text-text-secondary">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <li key={notice._id}>
                <Link
                  href={`/notices/${notice.slug.current}`}
                  className="flex items-center gap-3 px-2 py-4 transition-colors hover:bg-surface sm:px-4"
                >
                  {notice.isPinned && (
                    <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                      중요
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
    </>
  );
};

export default NoticesPage;
