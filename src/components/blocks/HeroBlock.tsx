import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { HeroBlock as HeroBlockType } from "@/types/sanity";

interface HeroBlockProps {
  block: HeroBlockType;
}

const HeroBlock = ({ block }: HeroBlockProps) => {
  const bgUrl = block.backgroundImage
    ? urlFor(block.backgroundImage).width(1920).quality(80).url()
    : null;

  return (
    <section
      className="relative flex h-[360px] items-center justify-center sm:h-[480px]"
      style={
        bgUrl
          ? { backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/95" />
      <div className="relative z-10 px-4 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-5xl">
          {block.title}
        </h1>
        {block.subtitle && (
          <p className="mt-4 text-lg text-white/80 sm:text-xl">
            {block.subtitle}
          </p>
        )}
        {block.buttonText && block.buttonLink && (
          <Link
            href={block.buttonLink}
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {block.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroBlock;
