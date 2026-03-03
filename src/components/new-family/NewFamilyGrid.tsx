"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import NewFamilyDetailModal from "./NewFamilyDetailModal";
import type { NewFamily } from "@/types/sanity";

interface NewFamilyGridProps {
  members: NewFamily[];
  extraFieldLabels?: string[];
}

const NewFamilyGrid = ({ members, extraFieldLabels }: NewFamilyGridProps) => {
  const [selectedMember, setSelectedMember] = useState<NewFamily | null>(null);

  if (members.length === 0) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-text-secondary">등록된 새가족이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {members.map((member) => (
          <button
            key={member._id}
            type="button"
            onClick={() => setSelectedMember(member)}
            className="group overflow-hidden rounded-lg border border-border bg-white text-left transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <div className="relative aspect-[3/4] bg-surface">
              {member.photo ? (
                <Image
                  src={urlFor(member.photo)
                    .width(300)
                    .height(400)
                    .fit("crop")
                    .url()}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-secondary">
                  <svg
                    className="h-16 w-16 opacity-30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="px-3 py-2.5 text-center">
              <p className="text-sm font-medium text-text">{member.name}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedMember && (
        <NewFamilyDetailModal
          member={selectedMember}
          extraFieldLabels={extraFieldLabels}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
};

export default NewFamilyGrid;
