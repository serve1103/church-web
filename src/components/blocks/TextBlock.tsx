import { PortableText } from "next-sanity";
import SectionHeader from "@/components/ui/SectionHeader";
import type { TextBlock as TextBlockType } from "@/types/sanity";

interface TextBlockProps {
  block: TextBlockType;
}

const TextBlock = ({ block }: TextBlockProps) => {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {block.heading && <SectionHeader title={block.heading} />}
        <div className="prose-custom [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_strong]:font-bold [&_strong]:text-text [&_em]:italic [&_a]:text-primary-light [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:text-text-secondary [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-text [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary">
          <PortableText value={block.body} />
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
