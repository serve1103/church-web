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
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {block.heading && <SectionHeader title={block.heading} />}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.images.map((image, idx) => (
            <div
              key={image.asset._ref}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100"
            >
              <Image
                src={urlFor(image).width(600).height(450).url()}
                alt={image.alt ?? `갤러리 이미지 ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-primary-dark/0 transition-colors group-hover:bg-primary-dark/30" />
              {image.alt && (
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 transition-transform group-hover:translate-y-0">
                  <p className="text-sm font-medium text-white">
                    {image.alt}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGalleryBlock;
