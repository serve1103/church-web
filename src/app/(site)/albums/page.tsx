import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { albumsQuery, albumsCountQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/date";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";
import type { SanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "교회앨범",
  description: "남문교회 사진 갤러리",
};

const PER_PAGE = 12;

interface AlbumListItem {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  description?: string;
  coverImage?: SanityImage;
  imageCount: number;
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AlbumsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [albumsResult, countResult] = await Promise.all([
    sanityFetch({ query: albumsQuery, params: { start, end } }),
    sanityFetch({ query: albumsCountQuery }),
  ]);

  const albums = albumsResult.data as AlbumListItem[];
  const totalCount = countResult.data as number;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <PageHeader title="교회앨범" />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {albums.length === 0 ? (
          <p className="py-20 text-center text-text-secondary">
            등록된 앨범이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album._id}
                href={`/albums/${album.slug.current}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {album.coverImage ? (
                    <Image
                      src={urlFor(album.coverImage)
                        .width(600)
                        .height(450)
                        .format("webp")
                        .url()}
                      alt={album.coverImage.alt || album.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface">
                      <span className="text-4xl text-text-secondary/30">
                        📷
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                    {album.imageCount}장
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-text group-hover:text-primary">
                    {album.title}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDate(album.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/albums"
        />
      </section>
    </>
  );
}
