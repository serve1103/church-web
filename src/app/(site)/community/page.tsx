import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/sanity/lib/live";
import { pageBySlugQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import PageHeader from "@/components/ui/PageHeader";
import type { Page } from "@/types/sanity";

export const metadata: Metadata = {
  title: "공동체",
  description: "남문교회 세움 공동체 - 유치부, 초등부, 중고등부, 청년부, 장년부 소개",
};

export default async function CommunityPage() {
  const isDraft = (await draftMode()).isEnabled;
  const { data: page } = (await sanityFetch({
    query: pageBySlugQuery,
    params: { slug: "community" },
  })) as { data: Page | null; sourceMap: unknown; tags: string[] };

  return (
    <>
      <PageHeader title="공동체" />
      {page?.blocks && page.blocks.length > 0 ? (
        <BlockRenderer
          blocks={page.blocks}
          documentId={page._id}
          documentType={page._type}
          isDraftMode={isDraft}
        />
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-text-secondary">페이지 준비 중입니다.</p>
        </div>
      )}
    </>
  );
}
