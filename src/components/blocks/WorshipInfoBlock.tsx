import { Clock, MapPin, Sun, Moon, Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { WorshipInfoBlock as WorshipInfoBlockType } from "@/types/sanity";

interface WorshipInfoBlockProps {
  block: WorshipInfoBlockType;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  sun: Sun,
  moon: Moon,
  star: Star,
};

const WorshipInfoBlock = ({ block }: WorshipInfoBlockProps) => {
  return (
    <section className="bg-surface px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title={block.heading ?? "예배안내"}
          subtitle="남문교회와 함께 예배드리세요"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {block.services?.map((service) => {
            const Icon = service.icon ? ICON_MAP[service.icon] : null;
            return (
              <div
                key={service._key}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* accent top bar */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary-light opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-text">{service.name}</h3>
                <p className="mt-2 text-lg font-medium text-primary">
                  {service.time}
                </p>
                {service.location && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {service.location}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorshipInfoBlock;
