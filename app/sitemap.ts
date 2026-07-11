import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllEventSlugs } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.URL || "https://bjj-around-adcc.netlify.app";
  const slugs = await getAllEventSlugs();

  const staticPaths = [
    "",
    "/academies",
    "/krakow-orientation",
    "/submit-event",
  ];

  const staticUrls = routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.9,
    })),
  );

  const eventUrls = routing.locales.flatMap((locale) =>
    slugs.map((item) => ({
      url: `${siteUrl}/${locale}/event/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...staticUrls, ...eventUrls];
}
