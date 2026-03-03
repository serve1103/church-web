"use client";

import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

interface GalleryImage {
  thumbSrc: string;
  fullSrc: string;
  alt: string;
}

interface ImageGalleryViewerProps {
  images: GalleryImage[];
}

const ImageGalleryViewer = ({ images }: ImageGalleryViewerProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages = images.map((img) => ({
    src: img.fullSrc,
    alt: img.alt,
  }));

  const isSingle = images.length === 1;

  return (
    <>
      {isSingle ? (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="group relative mx-auto block max-w-3xl overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Image
            src={images[0].thumbSrc}
            alt={images[0].alt}
            width={900}
            height={1200}
            className="w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Image
                src={image.thumbSrc}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

export default ImageGalleryViewer;
