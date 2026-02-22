import { Clock, MapPin } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { WorshipInfoBlock as WorshipInfoBlockType } from "@/types/sanity";

interface WorshipInfoBlockProps {
  block: WorshipInfoBlockType;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
};

const WorshipInfoBlock = ({ block }: WorshipInfoBlockProps) => {
  return (
    <section className="bg-surface px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "예배안내"} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {block.services?.map((service) => {
            const Icon = service.icon ? ICON_MAP[service.icon] : null;
            return (
              <div
                key={service._key}
                className="flex flex-row items-center gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-col sm:items-start sm:text-left lg:text-center lg:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {Icon ? <Icon className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">{service.name}</h3>
                  <p className="mt-1 text-text-secondary">{service.time}</p>
                  {service.location && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary sm:justify-start lg:justify-center">
                      <MapPin className="h-3.5 w-3.5" />
                      {service.location}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorshipInfoBlock;
