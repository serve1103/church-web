import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { prayerLetterBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";
import { PortableText } from "next-sanity";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import type { PrayerLetter } from "@/types/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: letter } = await sanityFetch({
    query: prayerLetterBySlugQuery,
    params: { slug },
  });
  const letterData = letter as PrayerLetter | null;

  if (!letterData) {
    return { title: "기도편지를 찾을 수 없습니다 | 남문교회" };
  }

  return {
    title: `${letterData.title} | 기도편지 | 남문교회`,
    description: `남문교회 기도편지: ${letterData.title}`,
  };
}

export default async function PrayerLetterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: letter } = await sanityFetch({
    query: prayerLetterBySlugQuery,
    params: { slug },
  });
  const letterData = letter as PrayerLetter | null;

  if (!letterData) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/mission/prayer-letters"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        기도편지 목록
      </Link>

      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {letterData.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {formatDate(letterData.publishedAt)}
        </p>
      </div>

      {/* Body */}
      {letterData.body && (
        <div className="[&_a]:text-primary-light [&_a]:underline [&_em]:italic [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_strong]:font-bold [&_strong]:text-text [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
          <PortableText value={letterData.body} />
        </div>
      )}

      {/* Images */}
      {letterData.images && letterData.images.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {letterData.images.map((image, index) => (
            <div
              key={image.asset._ref}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={urlFor(image).width(800).height(600).format("webp").url()}
                alt={image.alt || `기도편지 사진 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
