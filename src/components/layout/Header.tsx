import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import MobileNav from "./MobileNav";
import type { SiteSettings } from "@/types/sanity";

const Header = async () => {
  const result = await sanityFetch({ query: siteSettingsQuery });
  const settings = result.data as SiteSettings | null;

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-primary">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {settings?.logo ? (
            <Image
              src={urlFor(settings.logo).width(120).height(48).format("webp").url()}
              alt={settings.churchName || "남문교회"}
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          ) : (
            <>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-accent">
                <span className="text-lg font-bold text-accent">+</span>
              </div>
              <span className="text-lg font-bold text-white">
                {settings?.churchName || "남문교회"}
              </span>
            </>
          )}
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
