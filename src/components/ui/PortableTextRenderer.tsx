import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import type { ReactNode } from "react";

/** decorator mark를 인라인 스타일 span으로 렌더링하는 헬퍼 */
const mark =
  (className: string) =>
  ({ children }: { children: ReactNode }) => (
    <span className={className}>{children}</span>
  );

const components: PortableTextComponents = {
  marks: {
    // ── 글자 색상 ──
    "color-primary": mark("text-primary"),
    "color-blue": mark("text-primary-light"),
    "color-accent": mark("text-accent"),
    "color-red": mark("text-red-600"),
    "color-gray": mark("text-text-secondary"),
    // ── 형광펜 ──
    "highlight-yellow": mark("bg-yellow-200 rounded-sm px-0.5"),
    "highlight-blue": mark("bg-blue-200 rounded-sm px-0.5"),
    "highlight-green": mark("bg-green-200 rounded-sm px-0.5"),
    "highlight-pink": mark("bg-red-200 rounded-sm px-0.5"),
    // ── 글자 크기 ──
    "text-large": mark("text-xl"),
    "text-xlarge": mark("text-2xl"),
    "text-small": mark("text-sm"),
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

const PortableTextRenderer = ({ value }: PortableTextRendererProps) => {
  if (!value || value.length === 0) return null;

  return (
    <div className="prose-custom [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary [&_strong]:font-bold [&_strong]:text-text [&_em]:italic [&_a]:text-primary-light [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:text-text-secondary [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-text [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary">
      <PortableText value={value} components={components} />
    </div>
  );
};

export default PortableTextRenderer;
