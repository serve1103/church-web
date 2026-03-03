export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "교회소개",
    href: "/about",
    children: [
      { label: "인사말·비전", href: "/about#greeting" },
      { label: "예배안내", href: "/about#worship" },
      { label: "섬기는 사람들", href: "/about#staff" },
      { label: "교회연혁", href: "/about#history" },
      { label: "오시는 길", href: "/about#directions" },
    ],
  },
  { label: "설교", href: "/sermons" },
  {
    label: "소식",
    href: "/notices",
    children: [
      { label: "교회소식", href: "/notices" },
      { label: "주보", href: "/bulletins" },
      { label: "교회앨범", href: "/albums" },
      { label: "새가족", href: "/new-family" },
    ],
  },
  { label: "공동체", href: "/community" },
  { label: "선교", href: "/mission/prayer-letters" },
];

export const SERMON_CATEGORY_LABELS: Record<string, string> = {
  sunday: "주일오전설교",
  seminar: "주일오후세미나",
  wednesday: "수요예배",
  dawn: "새벽예배",
  special: "특별예배",
  message: "3분 메시지",
};
