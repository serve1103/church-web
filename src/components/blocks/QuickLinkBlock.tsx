import Link from "next/link";
import {
  Church,
  BookOpen,
  Users,
  Baby,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import type { QuickLinkBlock as QuickLinkBlockType } from "@/types/sanity";

interface QuickLinkBlockProps {
  block: QuickLinkBlockType;
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  church: Church,
  book: BookOpen,
  users: Users,
  baby: Baby,
  heart: Heart,
  star: Star,
};

const COLORS = [
  { bg: "bg-primary/10", text: "text-primary", hover: "hover:bg-primary" },
  { bg: "bg-accent/10", text: "text-accent", hover: "hover:bg-accent" },
  { bg: "bg-primary-light/10", text: "text-primary-light", hover: "hover:bg-primary-light" },
  { bg: "bg-accent/10", text: "text-accent", hover: "hover:bg-accent" },
];

const QuickLinkBlock = ({ block }: QuickLinkBlockProps) => {
  if (!block.links || block.links.length === 0) return null;

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div
          className={`grid gap-5 sm:grid-cols-2 ${
            block.links.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {block.links.map((link, idx) => {
            const Icon = link.icon ? ICON_MAP[link.icon] : Church;
            const color = COLORS[idx % COLORS.length];
            return (
              <Link
                key={link._key}
                href={link.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${color.bg} ${color.text} transition-colors group-hover:bg-primary group-hover:text-white`}
                >
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="text-lg font-bold text-text">{link.title}</h3>
                {link.description && (
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {link.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  자세히 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickLinkBlock;
