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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {block.members.map((staff) => (
            <div
              key={staff._id}
              className="group flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-gradient-to-b from-primary/5 to-primary/10">
                {staff.photo ? (
                  <Image
                    src={urlFor(staff.photo).width(256).height(256).url()}
                    alt={staff.name}
                    fill
                    className="object-cover object-top"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-4xl font-light text-primary/30">
                      {staff.name?.charAt(0) ?? ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-text">{staff.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent">
                  {staff.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffBlock;
