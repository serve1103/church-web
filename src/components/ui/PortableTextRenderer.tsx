import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import type { ReactNode } from "react";

/* ── textStyle annotation의 값 → Tailwind 클래스 매핑 ── */
const TEXT_COLOR_CLASS: Record<string, string> = {
  primary: "text-primary",
  blue: "text-primary-light",
  accent: "text-accent",
  red: "text-red-600",
  gray: "text-text-secondary",
};

const HIGHLIGHT_CLASS: Record<string, string> = {
  yellow: "bg-yellow-200",
  blue: "bg-blue-200",
  green: "bg-green-200",
  pink: "bg-red-200",
};

const FONT_SIZE_CLASS: Record<string, string> = {
  small: "text-sm",
  large: "text-xl",
  xlarge: "text-2xl",
};

const components: PortableTextComponents = {
  marks: {
    textStyle: ({
      children,
      value,
    }: {
      children: ReactNode;
      value?: { color?: string; bg?: string; size?: string };
    }) => {
      const classes: string[] = [];
      if (value?.color && TEXT_COLOR_CLASS[value.color])
        classes.push(TEXT_COLOR_CLASS[value.color]);
      if (value?.bg && HIGHLIGHT_CLASS[value.bg])
        classes.push(HIGHLIGHT_CLASS[value.bg], "rounded-sm", "px-0.5");
      if (value?.size && FONT_SIZE_CLASS[value.size])
        classes.push(FONT_SIZE_CLASS[value.size]);

      if (classes.length === 0) return <>{children}</>;
      return <span className={classes.join(" ")}>{children}</span>;
    },
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
