import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = routing.locales.flatMap((locale) => [
    `/${locale}/login`,
    `/${locale}/register`,
    `/${locale}/my-events`,
    `/${locale}/my-academies`,
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/", ...privatePaths],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
