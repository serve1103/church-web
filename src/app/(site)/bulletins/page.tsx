import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { bulletinsQuery, bulletinsCountQuery } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import { urlFor } from "@/sanity/lib/image";
import PageHeader from "@/components/ui/PageHeader";
import NewsTabNav from "@/components/ui/NewsTabNav";
import Pagination from "@/components/ui/Pagination";
import { FileText, Eye } from "lucide-react";
import type { Metadata } from "next";
import type { Bulletin } from "@/types/sanity";

export const metadata: Metadata = {
  title: "주보",
  description: "남문교회 주보 아카이브",
};

const PER_PAGE = 12;

const BulletinsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [bulletinsResult, countResult] = await Promise.all([
    sanityFetch({
      query: bulletinsQuery,
      params: { start, end },
    }),
    sanityFetch({
      query: bulletinsCountQuery,
    }),
  ]);

  const bulletins = bulletinsResult.data as Bulletin[];
  const totalCount = countResult.data as number;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <PageHeader title="주보" />
      <NewsTabNav />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {bulletins.length === 0 ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <p className="text-text-secondary">등록된 주보가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {bulletins.map((bulletin) => (
              <Link
                key={bulletin._id}
                href={`/bulletins/${bulletin._id}`}
                className="group overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md"
              >
                {/* Cover image or placeholder */}
                <div className="relative aspect-[3/4] w-full bg-surface">
                  {bulletin.coverImage ? (
                    <Image
                      src={urlFor(bulletin.coverImage)
                        .width(400)
                        .height(533)
                        .url()}
                      alt={bulletin.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-text-secondary">
                      <FileText className="h-12 w-12" />
                      <span className="text-sm">주보</span>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-3 py-3 sm:px-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-text sm:text-base">
                      {bulletin.title}
                    </h3>
                    <time className="text-xs text-text-secondary sm:text-sm">
                      {formatDate(bulletin.date)}
                    </time>
                  </div>
                  <Eye className="ml-2 h-4 w-4 shrink-0 text-text-secondary transition-colors group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/bulletins"
        />
      </section>
    </>
  );
};

export default BulletinsPage;
