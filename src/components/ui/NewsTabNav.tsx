"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "공지사항", href: "/notices" },
  { label: "주보", href: "/bulletins" },
  { label: "교회앨범", href: "/albums" },
];

const NewsTabNav = () => {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex gap-1 overflow-x-auto py-2">
          {TABS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-gray-100 hover:text-text"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NewsTabNav;
