import { draftMode } from "next/headers";
import { sanityFetch } from "@/sanity/lib/live";
import { homePageQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import type { Page } from "@/types/sanity";

export default async function Home() {
  const isDraft = (await draftMode()).isEnabled;
  const { data: page } = (await sanityFetch({
    query: homePageQuery,
  })) as { data: Page | null; sourceMap: unknown; tags: string[] };

  if (!page?.blocks || page.blocks.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">남문교회</h1>
          <p className="mt-4 text-lg text-text-secondary">
            홈페이지 준비 중입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BlockRenderer
      blocks={page.blocks}
      documentId={page._id}
      documentType={page._type}
      isDraftMode={isDraft}
    />
  );
}
