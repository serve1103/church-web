"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { NewFamily } from "@/types/sanity";

interface NewFamilyDetailModalProps {
  member: NewFamily;
  extraFieldLabels?: string[];
  onClose: () => void;
}

const NewFamilyDetailModal = ({
  member,
  extraFieldLabels,
  onClose,
}: NewFamilyDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const formattedDate = member.date
    ? new Date(member.date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // 설정에 라벨이 정의되어 있으면 그 순서대로, 없으면 멤버 데이터 그대로
  const extraFieldsMap = new Map(
    member.extraFields?.map((f) => [f.label, f.value]) ?? [],
  );

  const extraEntries = extraFieldLabels?.length
    ? extraFieldLabels.map((label) => ({
        label,
        value: extraFieldsMap.get(label),
      }))
    : member.extraFields?.map((f) => ({ label: f.label, value: f.value })) ??
      [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* 모달 콘텐츠 */}
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 사진 */}
        <div className="relative aspect-[3/4] bg-surface">
          {member.photo ? (
            <Image
              src={urlFor(member.photo)
                .width(600)
                .height(800)
                .fit("crop")
                .url()}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 90vw, 384px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-secondary">
              <svg
                className="h-24 w-24 opacity-30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-text">{member.name}</h3>

          <dl className="mt-4 space-y-2 text-sm">
            {formattedDate && (
              <div className="flex justify-between">
                <dt className="text-text-secondary">등록일</dt>
                <dd className="font-medium text-text">{formattedDate}</dd>
              </div>
            )}
            {member.registrationNumber && (
              <div className="flex justify-between">
                <dt className="text-text-secondary">등록번호</dt>
                <dd className="font-medium text-text">
                  {member.registrationNumber}
                </dd>
              </div>
            )}
            {extraEntries.map((entry) => (
              <div key={entry.label} className="flex justify-between">
                <dt className="text-text-secondary">{entry.label}</dt>
                <dd className="font-medium text-text">
                  {entry.value || "-"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default NewFamilyDetailModal;
