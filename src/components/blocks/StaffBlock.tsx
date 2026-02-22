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
    <section className="bg-surface px-4 py-[60px] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={block.heading ?? "사역자 소개"} />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {block.members.map((staff) => (
            <div key={staff._id} className="text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                {staff.photo ? (
                  <Image
                    src={urlFor(staff.photo).width(256).height(256).url()}
                    alt={staff.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-text-secondary">
                    {staff.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-text">{staff.name}</h3>
              <p className="text-sm text-text-secondary">{staff.position}</p>
              {staff.bio && (
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {staff.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffBlock;
