import { PortableText } from "next-sanity";
import SectionHeader from "@/components/ui/SectionHeader";
import type { TextBlock as TextBlockType } from "@/types/sanity";

interface TextBlockProps {
  block: TextBlockType;
}

const TextBlock = ({ block }: TextBlockProps) => {
  return (
    <section className="px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-3xl">
        {block.heading && <SectionHeader title={block.heading} />}
        <div className="[&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_strong]:font-bold [&_strong]:text-text [&_em]:italic [&_a]:text-primary-light [&_a]:underline [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1">
          <PortableText value={block.body} />
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
