import type { MetadataRoute } from "next";
import { getAllEventSlugs } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.URL || "https://bjj-around-adcc.netlify.app";

  const slugs = await getAllEventSlugs();

  const eventUrls = slugs.map((item) => ({
    url: `${siteUrl}/event/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...eventUrls,
  ];
}
