import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { noticeBySlugQuery, allNoticeSlugsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { formatDate } from "@/lib/date";
import { ChevronLeft, Download } from "lucide-react";
import PortableTextRenderer from "@/components/ui/PortableTextRenderer";
import type { Metadata } from "next";
import type { Notice } from "@/types/sanity";

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allNoticeSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
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
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
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
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {notice.isPinned && (
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-white">
              중요
            </span>
          )}
          {notice.category === "event" && (
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              행사
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
      {notice.body && <PortableTextRenderer value={notice.body} />}

      {/* Attachments */}
      {notice.attachments && notice.attachments.length > 0 && (
        <div className="mt-8 rounded-xl bg-surface p-6">
          <h2 className="mb-3 text-sm font-semibold text-text">첨부파일</h2>
          <ul className="space-y-2">
            {notice.attachments.map((file) => {
              const fileData = file as unknown as {
                _key: string;
                url?: string;
                originalFilename?: string;
                size?: number;
                description?: string;
              };
              return (
                <li key={fileData._key}>
                  <a
                    href={fileData.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary-light"
                  >
                    <Download className="h-4 w-4" />
                    {fileData.description ||
                      fileData.originalFilename ||
                      "파일 다운로드"}
                    {fileData.size && (
                      <span className="text-text-secondary">
                        ({(fileData.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
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
