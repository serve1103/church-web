import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { sermonBySlugQuery, allSermonSlugsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { extractYouTubeId } from "@/lib/youtube";
import { formatDate } from "@/lib/date";
import { SERMON_CATEGORY_LABELS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { Sermon } from "@/types/sanity";

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allSermonSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

interface SermonDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SermonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: sermonBySlugQuery,
    params: { slug },
  });
  const sermon = data as Sermon | null;

  if (!sermon) {
    return { title: "설교를 찾을 수 없습니다 | 남문교회" };
  }

  return {
    title: `${sermon.title} | 설교 | 남문교회`,
    description:
      sermon.description ??
      `${sermon.preacher ? `${sermon.preacher} 목사 · ` : ""}${SERMON_CATEGORY_LABELS[sermon.category] ?? sermon.category} · ${formatDate(sermon.date)}`,
  };
}

export default async function SermonDetailPage({
  params,
}: SermonDetailPageProps) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: sermonBySlugQuery,
    params: { slug },
  });
  const sermon = data as Sermon | null;

  if (!sermon) {
    notFound();
  }

  const youtubeId = extractYouTubeId(sermon.youtubeUrl);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      {/* Back link */}
      <Link
        href="/sermons"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        설교 목록
      </Link>

      {/* YouTube embed */}
      {youtubeId && (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={sermon.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}

      {/* Sermon info */}
      <div className="mt-6">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {SERMON_CATEGORY_LABELS[sermon.category] ?? sermon.category}
        </span>

        <h1 className="mt-3 text-2xl font-bold text-text sm:text-3xl">
          {sermon.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
          {sermon.preacher && <span>{sermon.preacher}</span>}
          {sermon.bibleText && <span>{sermon.bibleText}</span>}
          <span>{formatDate(sermon.date)}</span>
        </div>
      </div>

      {/* Description */}
      {sermon.description && (
        <div className="mt-8 rounded-xl bg-surface p-6">
          <p className="whitespace-pre-line leading-relaxed text-text">
            {sermon.description}
          </p>
        </div>
      )}

      {/* Back to list */}
      <div className="mt-12 border-t border-gray-100 pt-6 text-center">
        <Link
          href="/sermons"
          className="inline-block rounded-lg border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
