import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import PageHeader from "@/components/ui/PageHeader";
import type { Page } from "@/types/sanity";

export const metadata: Metadata = {
  title: "오시는 길 - 남문교회",
  description: "남문교회 오시는 길",
};

export default async function DirectionsPage() {
  const { data: page } = (await sanityFetch({
    query: pageBySlugQuery,
    params: { slug: "directions" },
  })) as { data: Page | null; sourceMap: unknown; tags: string[] };

  return (
    <>
      <PageHeader title="오시는 길" />
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
