import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { HeroBlock as HeroBlockType } from "@/types/sanity";

interface HeroBlockProps {
  block: HeroBlockType;
}

const HeroBlock = ({ block }: HeroBlockProps) => {
  const bgUrl = block.backgroundImage
    ? urlFor(block.backgroundImage).width(1920).quality(85).url()
    : null;

  return (
    <section
      className="relative flex min-h-[420px] items-center justify-center sm:min-h-[540px] lg:min-h-[75vh]"
      style={
        bgUrl
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary/70 to-primary/50" />

      {/* decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        {block.subtitle && (
          <p className="mb-4 text-sm font-medium tracking-[0.2em] uppercase text-accent-light sm:text-base">
            {block.subtitle}
          </p>
        )}
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {block.title}
        </h1>
        {block.buttonText && block.buttonLink && (
          <Link
            href={block.buttonLink}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-light hover:shadow-xl"
          >
            {block.buttonText}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroBlock;
