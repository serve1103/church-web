import { MapPin, Phone, Bus } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { DirectionsBlock as DirectionsBlockType } from "@/types/sanity";

interface DirectionsBlockProps {
  block: DirectionsBlockType;
}

const DirectionsBlock = ({ block }: DirectionsBlockProps) => {
  return (
    <section className="px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "오시는 길"} />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gray-100 text-text-secondary lg:aspect-auto lg:min-h-[320px]">
            <p className="text-sm">지도 영역 (추후 카카오맵 연동)</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-text">주소</h3>
                <p className="mt-1 text-text-secondary">{block.address}</p>
              </div>
            </div>

            {block.phone && (
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">전화</h3>
                  <p className="mt-1 text-text-secondary">{block.phone}</p>
                </div>
              </div>
            )}

            {block.transitInfo && (
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">대중교통</h3>
                  <p className="mt-1 whitespace-pre-line text-text-secondary">
                    {block.transitInfo}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectionsBlock;
