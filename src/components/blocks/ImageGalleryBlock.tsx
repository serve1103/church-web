import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { ImageGalleryBlock as ImageGalleryBlockType } from "@/types/sanity";

interface ImageGalleryBlockProps {
  block: ImageGalleryBlockType;
}

const ImageGalleryBlock = ({ block }: ImageGalleryBlockProps) => {
  if (!block.images || block.images.length === 0) return null;

  return (
    <section className="px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-6xl">
        {block.heading && <SectionHeader title={block.heading} />}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.images.map((image, idx) => (
            <div
              key={image.asset._ref}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={urlFor(image).width(600).height(450).url()}
                alt={image.alt ?? `갤러리 이미지 ${idx + 1}`}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGalleryBlock;
