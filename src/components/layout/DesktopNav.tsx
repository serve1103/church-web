"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { isNavActive } from "@/lib/nav";
import type { NavItem } from "@/lib/constants";

const NavItemWithDropdown = ({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) => {
  const [open, setOpen] = useState(false);
  const active = isNavActive(pathname, item.href);

  const linkClass = `rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${
    active ? "text-white border-b-2 border-accent" : "text-white/85"
  }`;

  if (!item.children) {
    return (
      <li>
        <Link href={item.href} className={linkClass}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href={item.href} className={linkClass}>
        {item.label}
      </Link>
      {open && (
        <div className="absolute left-0 top-full pt-1">
          <ul className="min-w-[160px] rounded-lg border border-white/10 bg-primary py-1 shadow-lg">
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block px-4 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <NavItemWithDropdown
            key={item.href}
            item={item}
            pathname={pathname}
          />
        ))}
      </ul>
    </nav>
  );
};

export default DesktopNav;
