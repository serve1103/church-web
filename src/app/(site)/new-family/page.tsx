import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  newFamilyQuery,
  newFamilyRecentQuery,
  newFamilyCountQuery,
  newFamilyRecentCountQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import PageHeader from "@/components/ui/PageHeader";
import NewsTabNav from "@/components/ui/NewsTabNav";
import Pagination from "@/components/ui/Pagination";
import type { Metadata } from "next";
import type { NewFamily, SiteSettings } from "@/types/sanity";

export const metadata: Metadata = {
  title: "새가족",
  description: "남문교회 새가족 소개",
};

const PER_PAGE = 20;

const getSinceDate = (months: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
};

const NewFamilyPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; all?: string }>;
}) => {
  const { page: pageParam, all } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const settingsResult = await sanityFetch({ query: siteSettingsQuery });
  const settings = settingsResult.data as SiteSettings | null;
  const displayMonths = settings?.newFamilyDisplayMonths;

  const showAll = all === "true" || !displayMonths;
  const since = displayMonths ? getSinceDate(displayMonths) : "";

  const [membersResult, countResult] = await Promise.all([
    showAll
      ? sanityFetch({ query: newFamilyQuery, params: { start, end } })
      : sanityFetch({
          query: newFamilyRecentQuery,
          params: { start, end, since },
        }),
    showAll
      ? sanityFetch({ query: newFamilyCountQuery })
      : sanityFetch({ query: newFamilyRecentCountQuery, params: { since } }),
  ]);

  const members = membersResult.data as NewFamily[];
  const totalCount = countResult.data as number;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // 전체 수 조회 (필터링 중일 때만)
  let totalAllCount = totalCount;
  if (!showAll) {
    const allCountResult = await sanityFetch({ query: newFamilyCountQuery });
    totalAllCount = allCountResult.data as number;
  }

  const basePath = showAll && displayMonths ? "/new-family?all=true" : "/new-family";

  return (
    <>
      <PageHeader title="새가족" />
      <NewsTabNav />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* 필터 안내 및 전체 보기 토글 */}
        {displayMonths && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {showAll
                ? `전체 새가족 ${totalCount}명`
                : `최근 ${displayMonths}개월 새가족 ${totalCount}명`}
            </p>
            {showAll ? (
              <Link
                href="/new-family"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface"
              >
                최근 {displayMonths}개월만 보기
              </Link>
            ) : (
              totalAllCount > totalCount && (
                <Link
                  href="/new-family?all=true"
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface"
                >
                  전체 보기 ({totalAllCount}명)
                </Link>
              )
            )}
          </div>
        )}

        {members.length === 0 ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <p className="text-text-secondary">
              등록된 새가족이 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="overflow-hidden rounded-lg border border-border bg-white"
              >
                <div className="relative aspect-[3/4] bg-surface">
                  {member.photo ? (
                    <Image
                      src={urlFor(member.photo)
                        .width(300)
                        .height(400)
                        .fit("crop")
                        .url()}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-secondary">
                      <svg
                        className="h-16 w-16 opacity-30"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="px-3 py-2.5 text-center">
                  <p className="text-sm font-medium text-text">
                    {member.registrationNumber && (
                      <span className="text-text-secondary">
                        {member.registrationNumber}{" "}
                      </span>
                    )}
                    {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
        />
      </div>
    </>
  );
};

export default NewFamilyPage;
