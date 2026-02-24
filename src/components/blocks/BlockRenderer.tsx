import type { PageBlock } from "@/types/sanity";
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

const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  return (
    <>
      {blocks.map((block) => {
        const Component = blockComponents[block._type];
        if (!Component) {
          console.warn(`Block type "${block._type}" not found`);
          return null;
        }
        return <Component key={block._key} block={block} />;
      })}
    </>
  );
};

export default BlockRenderer;
