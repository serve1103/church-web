import { MapPin, Phone, Bus } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import MapEmbed from "./MapEmbed";
import type { DirectionsBlock as DirectionsBlockType } from "@/types/sanity";

interface DirectionsBlockProps {
  block: DirectionsBlockType;
}

const DirectionsBlock = ({ block }: DirectionsBlockProps) => {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "오시는 길"} />
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            {/* Map */}
            <div className="min-h-[300px] lg:min-h-[400px]">
              <MapEmbed
                address={block.address}
                lat={block.mapCoordinates?.lat}
                lng={block.mapCoordinates?.lng}
                placeName="남문교회 독산동"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center gap-6 p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                    주소
                  </h3>
                  <p className="mt-1 font-medium text-text">{block.address}</p>
                </div>
              </div>

              {block.phone && (
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                      전화
                    </h3>
                    <p className="mt-1 font-medium text-text">{block.phone}</p>
                  </div>
                </div>
              )}

              {block.transitInfo && (
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                      대중교통
                    </h3>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                      {block.transitInfo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectionsBlock;
