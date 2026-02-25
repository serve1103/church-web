"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { isNavActive } from "@/lib/nav";
import type { NavItem } from "@/lib/constants";

const MobileNavItem = ({
  item,
  onClose,
  pathname,
}: {
  item: NavItem;
  onClose: () => void;
  pathname: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const active = isNavActive(pathname, item.href);

  const linkClass = `block rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-white/10 hover:text-white ${
    active ? "text-white bg-white/10" : "text-white/90"
  }`;

  if (!item.children) {
    return (
      <li>
        <Link href={item.href} onClick={onClose} className={linkClass}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onClose}
          className={`flex-1 ${linkClass}`}
        >
          {item.label}
        </Link>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-11 w-11 items-center justify-center text-white/70 hover:text-white"
          aria-label={expanded ? "하위 메뉴 접기" : "하위 메뉴 펼치기"}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {expanded && (
        <ul className="ml-4 space-y-0.5 border-l border-white/20 pl-2">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className="block rounded-lg px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-11 items-center justify-center text-white"
        aria-label="메뉴 열기"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <nav className="absolute right-0 top-0 h-full w-72 bg-primary p-6">
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-white"
                aria-label="메뉴 닫기"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  onClose={() => setIsOpen(false)}
                  pathname={pathname}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
