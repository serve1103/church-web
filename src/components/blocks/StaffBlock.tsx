import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import SectionHeader from "@/components/ui/SectionHeader";
import type { StaffBlock as StaffBlockType } from "@/types/sanity";

interface StaffBlockProps {
  block: StaffBlockType;
}

const StaffBlock = ({ block }: StaffBlockProps) => {
  if (!block.members || block.members.length === 0) return null;

  return (
    <section className="bg-surface px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "섬기는 사람들"} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {block.members.map((staff) => (
            <div
              key={staff._id}
              className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Photo area */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-b from-primary/5 to-primary/10">
                {staff.photo ? (
                  <Image
                    src={urlFor(staff.photo).width(400).height(400).url()}
                    alt={staff.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-6xl font-light text-primary/30">
                      {staff.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-text">{staff.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent">
                  {staff.position}
                </p>
                {staff.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {staff.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffBlock;
