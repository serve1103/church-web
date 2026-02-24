import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { albumBySlugQuery, allAlbumSlugsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import type { Album } from "@/types/sanity";

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allAlbumSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: album } = await sanityFetch({
    query: albumBySlugQuery,
    params: { slug },
  });
  const albumData = album as Album | null;

  if (!albumData) {
    return { title: "앨범을 찾을 수 없습니다 | 남문교회" };
  }

  return {
    title: `${albumData.title} | 교회앨범 | 남문교회`,
    description:
      albumData.description || `남문교회 앨범: ${albumData.title}`,
  };
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: album } = await sanityFetch({
    query: albumBySlugQuery,
    params: { slug },
  });
  const albumData = album as Album | null;

  if (!albumData) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/albums"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        교회앨범 목록
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {albumData.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {formatDate(albumData.date)}
          {albumData.images && (
            <span className="ml-2">
              · 사진 {albumData.images.length}장
            </span>
          )}
        </p>
        {albumData.description && (
          <p className="mt-4 leading-relaxed text-text-secondary">
            {albumData.description}
          </p>
        )}
      </div>

      {/* Image gallery */}
      {albumData.images && albumData.images.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albumData.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={urlFor(image)
                  .width(600)
                  .height(450)
                  .format("webp")
                  .url()}
                alt={image.alt || `${albumData.title} - ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-text-secondary">
          등록된 사진이 없습니다.
        </p>
      )}
    </section>
  );
}
