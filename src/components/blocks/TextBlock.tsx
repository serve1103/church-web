import SectionHeader from "@/components/ui/SectionHeader";
import PortableTextRenderer from "@/components/ui/PortableTextRenderer";
import type { TextBlock as TextBlockType } from "@/types/sanity";

interface TextBlockProps {
  block: TextBlockType;
}

const TextBlock = ({ block }: TextBlockProps) => {
  if (!block.body) return null;

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {block.heading && <SectionHeader title={block.heading} />}
        <PortableTextRenderer value={block.body} />
      </div>
    </section>
  );
};

export default TextBlock;
