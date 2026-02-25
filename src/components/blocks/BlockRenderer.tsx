import { createDataAttribute } from "next-sanity";
import type { PageBlock } from "@/types/sanity";
import { dataset, projectId } from "@/sanity/env";
import HeroBlock from "./HeroBlock";
import WorshipInfoBlock from "./WorshipInfoBlock";
import LatestSermonBlock from "./LatestSermonBlock";
import NoticeListBlock from "./NoticeListBlock";
import DirectionsBlock from "./DirectionsBlock";
import YoutubeBlock from "./YoutubeBlock";
import TextBlock from "./TextBlock";
import ImageGalleryBlock from "./ImageGalleryBlock";
import StaffBlock from "./StaffBlock";
import TimelineBlock from "./TimelineBlock";
import QuickLinkBlock from "./QuickLinkBlock";

interface BlockRendererProps {
  blocks: PageBlock[];
  documentId?: string;
  documentType?: string;
  isDraftMode?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.ComponentType<{ block: any }>> = {
  heroBlock: HeroBlock,
  worshipInfoBlock: WorshipInfoBlock,
  latestSermonBlock: LatestSermonBlock,
  noticeListBlock: NoticeListBlock,
  directionsBlock: DirectionsBlock,
  youtubeBlock: YoutubeBlock,
  textBlock: TextBlock,
  imageGalleryBlock: ImageGalleryBlock,
  staffBlock: StaffBlock,
  timelineBlock: TimelineBlock,
  quickLinkBlock: QuickLinkBlock,
};

const anchorIdMap: Record<string, string> = {
  textBlock: "greeting",
  worshipInfoBlock: "worship",
  staffBlock: "staff",
  timelineBlock: "history",
  directionsBlock: "directions",
};

const BlockRenderer = ({
  blocks,
  documentId,
  documentType,
  isDraftMode,
}: BlockRendererProps) => {
  const usedAnchors = new Set<string>();

  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block._type];
        if (!Component) {
          console.warn(`Block type "${block._type}" not found`);
          return null;
        }

        // Only assign anchor ID to the first occurrence of each block type
        const rawAnchor = anchorIdMap[block._type];
        const anchorId =
          rawAnchor && !usedAnchors.has(rawAnchor) ? rawAnchor : undefined;
        if (anchorId) usedAnchors.add(anchorId);

        const dataAttr =
          isDraftMode && documentId && documentType
            ? createDataAttribute({
                id: documentId,
                type: documentType,
                projectId,
                dataset,
                path: `blocks[${index}]`,
              }).toString()
            : undefined;

        return (
          <div key={block._key} id={anchorId} data-sanity={dataAttr}>
            <Component block={block} />
          </div>
        );
      })}
    </>
  );
};

export default BlockRenderer;
