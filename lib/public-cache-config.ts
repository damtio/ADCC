import { routing } from "@/i18n/routing";

export const CACHE_TAGS = {
  events: "events",
  academies: "academies",
  event: (slug: string) => `event:${slug}`,
} as const;

export const PUBLIC_REVALIDATE = {
  home: 300,
  academies: 300,
  eventDetail: 3600,
} as const;

/** Columns needed for homepage / filter cards. */
export const EVENT_LIST_COLUMNS = [
  "id",
  "slug",
  "title",
  "category",
  "instructor",
  "organizer",
  "academy",
  "city",
  "address",
  "date",
  "end_date",
  "start_time",
  "end_time",
  "price",
  "currency",
  "registration_url",
  "facebook_url",
  "instagram_url",
  "image_url",
  "published",
].join(",");

/** Columns needed for event detail + JSON-LD + metadata. */
export const EVENT_DETAIL_COLUMNS = [
  EVENT_LIST_COLUMNS,
  "description",
  "latitude",
  "longitude",
  "updated_at",
].join(",");

export const ACADEMY_LIST_COLUMNS = [
  "id",
  "name",
  "address",
  "city",
  "district",
  "specialization",
  "phone",
  "email",
  "website",
  "facebook_url",
  "instagram_url",
  "image_url",
  "latitude",
  "longitude",
  "sort_order",
  "published",
].join(",");

export function publicLocalePaths(path: string): string[] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return routing.locales.map((locale) => `/${locale}`);
  }
  return routing.locales.map((locale) => `/${locale}${normalized}`);
}
