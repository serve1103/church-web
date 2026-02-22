import SectionHeader from "@/components/ui/SectionHeader";
import type { TimelineBlock as TimelineBlockType } from "@/types/sanity";

interface TimelineBlockProps {
  block: TimelineBlockType;
}

const TimelineBlock = ({ block }: TimelineBlockProps) => {
  if (!block.items || block.items.length === 0) return null;

  return (
    <section className="px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeader title={block.heading ?? "연혁"} />
        <div className="relative border-l-2 border-primary/20 pl-8">
          {block.items.map((item) => (
            <div key={item._key} className="relative mb-8 last:mb-0">
              <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-white">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm font-bold text-accent">{item.year}</span>
              <p className="mt-1 text-text-secondary">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineBlock;
