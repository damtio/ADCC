import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";
import { getAllEventSlugs, getPublishedAcademies } from "@/lib/supabase";

function languageAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, academies] = await Promise.all([
    getAllEventSlugs(),
    getPublishedAcademies(),
  ]);

  const latestEventUpdate = events.reduce<string | undefined>(
    (latest, event) =>
      !latest || event.updated_at > latest ? event.updated_at : latest,
    undefined,
  );
  const latestAcademyUpdate = academies.reduce<string | undefined>(
    (latest, academy) =>
      !latest || academy.updated_at > latest ? academy.updated_at : latest,
    undefined,
  );

  const staticPaths = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    {
      path: "/academies",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/krakow-orientation",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/submit-event",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const staticUrls: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    staticPaths.map(({ path, changeFrequency, priority }) => ({
      url: localizedUrl(locale, path),
      lastModified:
        path === ""
          ? latestEventUpdate
          : path === "/academies"
            ? latestAcademyUpdate
            : undefined,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );

  const eventUrls: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    events.map((event) => {
      const path = `/event/${event.slug}`;
      return {
        url: localizedUrl(locale, path),
        lastModified: event.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: { languages: languageAlternates(path) },
      };
    }),
  );

  return [...staticUrls, ...eventUrls];
}

export const dynamic = "force-static";
export const revalidate = 300;
