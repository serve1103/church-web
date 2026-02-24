import SectionHeader from "@/components/ui/SectionHeader";
import type { TimelineBlock as TimelineBlockType } from "@/types/sanity";

interface TimelineBlockProps {
  block: TimelineBlockType;
}

const TimelineBlock = ({ block }: TimelineBlockProps) => {
  if (!block.items || block.items.length === 0) return null;

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeader title={block.heading ?? "교회 연혁"} />
        <div className="relative">
          {/* center line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-8">
            {block.items.map((item, idx) => (
              <div
                key={item._key}
                className={`relative flex items-start gap-6 sm:gap-0 ${
                  idx % 2 === 0
                    ? "sm:flex-row"
                    : "sm:flex-row-reverse"
                }`}
              >
                {/* dot */}
                <div className="absolute left-4 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-white sm:left-1/2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>

                {/* content card */}
                <div
                  className={`ml-10 rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:ml-0 sm:w-[calc(50%-2rem)] ${
                    idx % 2 === 0 ? "sm:mr-auto sm:text-right" : "sm:ml-auto"
                  }`}
                >
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
                    {item.year}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineBlock;
