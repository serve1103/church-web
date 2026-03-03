import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { bulletinByIdQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import ImageGalleryViewer from "@/components/ui/ImageGalleryViewer";
import type { Metadata } from "next";
import type { BulletinDetail } from "@/types/sanity";

interface BulletinDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BulletinDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await sanityFetch({
    query: bulletinByIdQuery,
    params: { id },
  });
  const bulletin = data as BulletinDetail | null;

  if (!bulletin) {
    return { title: "주보를 찾을 수 없습니다 | 남문교회" };
  }

  return {
    title: `${bulletin.title} | 주보 | 남문교회`,
    description: `남문교회 ${bulletin.title} (${formatDate(bulletin.date)})`,
  };
}

export default async function BulletinDetailPage({
  params,
}: BulletinDetailPageProps) {
  const { id } = await params;
  const { data } = await sanityFetch({
    query: bulletinByIdQuery,
    params: { id },
  });
  const bulletin = data as BulletinDetail | null;

  if (!bulletin) {
    notFound();
  }

  const hasCoverImage = !!bulletin.coverImage;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      {/* Back link */}
      <Link
        href="/bulletins"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        주보 목록
      </Link>

      {/* Title & date */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">
            {bulletin.title}
          </h1>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
            <Calendar className="h-4 w-4" />
            <time>{formatDate(bulletin.date)}</time>
          </div>
        </div>
        {hasCoverImage && (
          <a
            href={`${urlFor(bulletin.coverImage!).width(1600).format("jpg").url()}&dl=${encodeURIComponent(bulletin.title)}.jpg`}
            download
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Download className="h-4 w-4" />
            다운로드
          </a>
        )}
      </div>

      {/* Bulletin image */}
      {hasCoverImage ? (
        <ImageGalleryViewer
          images={[
            {
              thumbSrc: urlFor(bulletin.coverImage!)
                .width(900)
                .format("webp")
                .url(),
              fullSrc: urlFor(bulletin.coverImage!)
                .width(1600)
                .format("webp")
                .url(),
              alt: bulletin.title,
            },
          ]}
        />
      ) : (
        <p className="py-20 text-center text-text-secondary">
          주보 이미지가 등록되지 않았습니다.
        </p>
      )}

      {/* Back to list */}
      <div className="mt-12 border-t border-border pt-6 text-center">
        <Link
          href="/bulletins"
          className="inline-block rounded-lg border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
