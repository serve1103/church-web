import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { latestNoticesQuery } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import SectionHeader from "@/components/ui/SectionHeader";
import type {
  NoticeListBlock as NoticeListBlockType,
  Notice,
} from "@/types/sanity";

interface NoticeListBlockProps {
  block: NoticeListBlockType;
}

const NoticeListBlock = async ({ block }: NoticeListBlockProps) => {
  const count = block.count ?? 5;

  let notices: Notice[];
  try {
    const result = await sanityFetch({ query: latestNoticesQuery });
    const data = result.data as Notice[];
    notices = (data ?? []).filter((n) => n.slug?.current).slice(0, count);
  } catch {
    return null;
  }

  if (notices.length === 0) return null;

  return (
    <section className="bg-surface px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeader title={block.heading ?? "공지사항"} />
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {notices.map((notice, idx) => (
            <Link
              key={notice._id}
              href={`/notices/${notice.slug.current}`}
              className={`group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface ${
                idx < notices.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {notice.isPinned && (
                  <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                    중요
                  </span>
                )}
                <span className="truncate font-medium text-text group-hover:text-primary">
                  {notice.title}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <time className="text-sm text-text-secondary">
                  {formatDate(notice.publishedAt)}
                </time>
                <ChevronRight className="h-4 w-4 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            공지사항 더보기
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

export default NoticeListBlock;
