import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import type { SiteSettings } from "@/types/sanity";

const Header = async () => {
  const result = await sanityFetch({ query: siteSettingsQuery });
  const settings = result.data as SiteSettings | null;

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-primary">
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

        <DesktopNav />

        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
