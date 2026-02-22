export const NAV_ITEMS = [
  { label: "교회소개", href: "/about" },
  { label: "예배안내", href: "/worship" },
  { label: "설교", href: "/sermons" },
  { label: "공지사항", href: "/notices" },
  { label: "교회앨범", href: "/albums" },
  { label: "오시는길", href: "/directions" },
] as const;

export const SERMON_CATEGORY_LABELS: Record<string, string> = {
  sunday: "주일예배",
  wednesday: "수요예배",
  friday: "금요예배",
  special: "특별예배",
};
