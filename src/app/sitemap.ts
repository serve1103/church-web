import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const BASE_URL = "https://nammoon.or.kr";

const allSlugsQuery = groq`{
  "sermons": *[_type == "sermon" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "notices": *[_type == "notice" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "albums": *[_type == "album" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "prayerLetters": *[_type == "prayerLetter" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch<{
    sermons: { slug: string; _updatedAt: string }[];
    notices: { slug: string; _updatedAt: string }[];
    albums: { slug: string; _updatedAt: string }[];
    prayerLetters: { slug: string; _updatedAt: string }[];
  }>(allSlugsQuery);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1, lastModified: new Date() },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
    { url: `${BASE_URL}/sermons`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/notices`, changeFrequency: "weekly", priority: 0.7, lastModified: new Date() },
    { url: `${BASE_URL}/bulletins`, changeFrequency: "weekly", priority: 0.6, lastModified: new Date() },
    { url: `${BASE_URL}/albums`, changeFrequency: "weekly", priority: 0.6, lastModified: new Date() },
    { url: `${BASE_URL}/community`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/mission/prayer-letters`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
  ];

  const sermonPages: MetadataRoute.Sitemap = (data.sermons ?? []).map((s) => ({
    url: `${BASE_URL}/sermons/${s.slug}`,
    lastModified: new Date(s._updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const noticePages: MetadataRoute.Sitemap = (data.notices ?? []).map((n) => ({
    url: `${BASE_URL}/notices/${n.slug}`,
    lastModified: new Date(n._updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const albumPages: MetadataRoute.Sitemap = (data.albums ?? []).map((a) => ({
    url: `${BASE_URL}/albums/${a.slug}`,
    lastModified: new Date(a._updatedAt),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const prayerLetterPages: MetadataRoute.Sitemap = (data.prayerLetters ?? []).map((p) => ({
    url: `${BASE_URL}/mission/prayer-letters/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticPages, ...sermonPages, ...noticePages, ...albumPages, ...prayerLetterPages];
}
