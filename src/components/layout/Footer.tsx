import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/types/sanity";

const Footer = async () => {
  const result = await sanityFetch({ query: siteSettingsQuery });
  const settings = result.data as SiteSettings | null;

  const churchName = settings?.churchName || "남문교회";

  return (
    <footer className="bg-footer-bg text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-lg font-bold text-white">{churchName}</h3>
            <p className="mb-4 text-sm text-gray-400">대한예수교장로회</p>
            <ul className="space-y-2 text-sm">
              {settings?.address && <li>주소: {settings.address}</li>}
              {settings?.phone && <li>전화: {settings.phone}</li>}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">바로가기</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-medium transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mt-1 space-y-1 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="text-xs transition-colors hover:text-white"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-footer-border pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {churchName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
