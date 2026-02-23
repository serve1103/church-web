import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { latestNoticesQuery } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import SectionHeader from "@/components/ui/SectionHeader";
import type { NoticeListBlock as NoticeListBlockType, Notice } from "@/types/sanity";

interface NoticeListBlockProps {
  block: NoticeListBlockType;
}

const NoticeListBlock = async ({ block }: NoticeListBlockProps) => {
  const count = block.count ?? 5;

  let notices: Notice[];
  try {
    const result = await sanityFetch({ query: latestNoticesQuery });
    const data = result.data as Notice[];
    notices = (data ?? []).slice(0, count);
  } catch {
    return null;
  }

  if (notices.length === 0) return null;

  return (
    <section className="bg-surface px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-[800px]">
        <SectionHeader title={block.heading ?? "공지사항"} />
        <ul className="divide-y divide-gray-200">
          {notices.map((notice) => (
            <li key={notice._id}>
              <Link
                href={`/notices/${notice.slug.current}`}
                className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-white/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {notice.isPinned && (
                    <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                      중요
                    </span>
                  )}
                  <span className="truncate text-text">{notice.title}</span>
                </div>
                <time className="shrink-0 text-sm text-text-secondary">
                  {formatDate(notice.publishedAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/notices"
            className="inline-block rounded-lg border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            공지사항 더보기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NoticeListBlock;
