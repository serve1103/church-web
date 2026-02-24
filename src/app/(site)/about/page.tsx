import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import PageHeader from "@/components/ui/PageHeader";
import type { Page } from "@/types/sanity";

export const metadata: Metadata = {
  title: "교회소개",
  description: "남문교회 소개 - 인사말, 예배안내, 섬기는 사람들, 교회 연혁, 오시는 길",
};

export default async function AboutPage() {
  const { data: page } = (await sanityFetch({
    query: pageBySlugQuery,
    params: { slug: "about" },
  })) as { data: Page | null; sourceMap: unknown; tags: string[] };

  return (
    <>
      <PageHeader title="교회소개" />
      {page?.blocks && page.blocks.length > 0 ? (
        <BlockRenderer blocks={page.blocks} />
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-text-secondary">페이지 준비 중입니다.</p>
        </div>
      )}
    </>
  );
}
