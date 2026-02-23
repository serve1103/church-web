import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { noticeBySlugQuery } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import type { Notice } from "@/types/sanity";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const result = await sanityFetch({
    query: noticeBySlugQuery,
    params: { slug },
  });
  const notice = result.data as Notice | null;

  if (!notice) {
    return { title: "공지사항 | 남문교회" };
  }

  return {
    title: `${notice.title} | 공지사항 | 남문교회`,
    description: `남문교회 공지사항 - ${notice.title}`,
  };
};

const NoticeDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const result = await sanityFetch({
    query: noticeBySlugQuery,
    params: { slug },
  });
  const notice = result.data as Notice | null;

  if (!notice) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/notices"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        목록으로
      </Link>

      {/* Header */}
      <header className="mb-8 border-b border-gray-200 pb-6">
        <div className="mb-2 flex items-center gap-2">
          {notice.isPinned && (
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-white">
              중요
            </span>
          )}
          <time className="text-sm text-text-secondary">
            {formatDate(notice.publishedAt)}
          </time>
        </div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {notice.title}
        </h1>
      </header>

      {/* Body */}
      {notice.body && (
        <div className="[&_a]:text-primary-light [&_a]:underline [&_em]:italic [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_strong]:font-bold [&_strong]:text-text [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
          <PortableText value={notice.body} />
        </div>
      )}

      {/* Bottom back link */}
      <div className="mt-10 border-t border-gray-200 pt-6">
        <Link
          href="/notices"
          className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>
    </section>
  );
};

export default NoticeDetailPage;
