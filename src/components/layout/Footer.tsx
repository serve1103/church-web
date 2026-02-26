import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/types/sanity";

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M20.998 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm-1 2h-16v14h16V5zM8 13h8v2H8v-2zm0-4h8v2H8V9z" />
  </svg>
);

const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 3c-5.523 0-10 3.59-10 8.013 0 2.86 1.895 5.37 4.743 6.79l-.974 3.577a.38.38 0 0 0 .575.417l4.08-2.724c.517.07 1.044.107 1.576.107 5.523 0 10-3.59 10-8.167C22 6.59 17.523 3 12 3z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, { icon: React.FC; label: string }> = {
  youtube: { icon: YoutubeIcon, label: "YouTube" },
  instagram: { icon: InstagramIcon, label: "Instagram" },
  facebook: { icon: FacebookIcon, label: "Facebook" },
  blog: { icon: BlogIcon, label: "블로그" },
  kakao: { icon: KakaoIcon, label: "카카오톡 채널" },
};

const Footer = async () => {
  const result = await sanityFetch({ query: siteSettingsQuery });
  const settings = result.data as SiteSettings | null;

  const churchName = settings?.churchName || "남문교회";
  const socialLinks = settings?.socialLinks;
  const hasSocialLinks = socialLinks && Object.values(socialLinks).some(Boolean);

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
              {settings?.email && <li>이메일: {settings.email}</li>}
            </ul>

            {hasSocialLinks && (
              <div className="mt-4 flex gap-3">
                {Object.entries(socialLinks).map(([key, url]) => {
                  if (!url) return null;
                  const social = SOCIAL_ICONS[key];
                  if (!social) return null;
                  const Icon = social.icon;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            )}
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
                    <ul className="mt-1 space-y-0.5 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="inline-block py-1 text-xs transition-colors hover:text-white"
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
