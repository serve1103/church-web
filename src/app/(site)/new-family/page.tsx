import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  newFamilyQuery,
  newFamilyRecentQuery,
  newFamilyCountQuery,
  newFamilyRecentCountQuery,
  newFamilySettingsQuery,
} from "@/sanity/lib/queries";
import PageHeader from "@/components/ui/PageHeader";
import NewsTabNav from "@/components/ui/NewsTabNav";
import Pagination from "@/components/ui/Pagination";
import NewFamilyIntro from "@/components/new-family/NewFamilyIntro";
import NewFamilyGrid from "@/components/new-family/NewFamilyGrid";
import type { Metadata } from "next";
import type { NewFamily, NewFamilySettings } from "@/types/sanity";

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

  const nfSettingsResult = await sanityFetch({ query: newFamilySettingsQuery });
  const nfSettings = nfSettingsResult.data as NewFamilySettings | null;
  const displayMonths = nfSettings?.displayMonths;

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

      <NewFamilyIntro settings={nfSettings} />

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

        <NewFamilyGrid
          members={members}
          extraFieldLabels={nfSettings?.extraFieldLabels}
        />

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
