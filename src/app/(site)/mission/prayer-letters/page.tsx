import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  prayerLettersQuery,
  prayerLettersCountQuery,
} from "@/sanity/lib/queries";
import { formatDate } from "@/lib/date";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기도편지 | 남문교회",
  description: "남문교회 선교 기도편지를 확인하세요.",
};

const PER_PAGE = 15;

interface PrayerLetterListItem {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PrayerLettersPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [lettersResult, countResult] = await Promise.all([
    sanityFetch({ query: prayerLettersQuery, params: { start, end } }),
    sanityFetch({ query: prayerLettersCountQuery }),
  ]);

  const letters = lettersResult.data as PrayerLetterListItem[];
  const totalCount = countResult.data as number;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <>
      <PageHeader title="기도편지" />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        {letters.length === 0 ? (
          <p className="py-20 text-center text-text-secondary">
            등록된 기도편지가 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {letters.map((letter) => (
              <li key={letter._id}>
                <Link
                  href={`/mission/prayer-letters/${letter.slug.current}`}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-surface sm:px-4 sm:py-5"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-medium text-text group-hover:text-primary sm:text-lg">
                      {letter.title}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {formatDate(letter.publishedAt)}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-text-secondary/50 transition-colors group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/mission/prayer-letters"
        />
      </section>
    </>
  );
}
