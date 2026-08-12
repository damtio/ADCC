import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

export const SITE_ORIGIN = "https://wolnamata.pl";
export const WARSAW_TIME_ZONE = "Europe/Warsaw";

export function localizedUrl(locale: string, path = ""): string {
  const suffix = path && !path.startsWith("/") ? `/${path}` : path;
  return `${SITE_ORIGIN}/${locale}${suffix}`;
}

export function localizedAlternates(locale: Locale, path = "") {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      pl: localizedUrl("pl", path),
      en: localizedUrl("en", path),
      "x-default": localizedUrl("pl", path),
    },
  };
}

type PublicMetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string | null;
};

export function publicMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}: PublicMetadataInput): Metadata {
  const url = localizedUrl(locale, path);
  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      alternateLocale: locale === "pl" ? ["en_US"] : ["pl_PL"],
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function safeHttpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function warsawOffset(date: string, time: string): string {
  const probe = new Date(`${date}T${time.slice(0, 5)}:00Z`);
  const offsetName = new Intl.DateTimeFormat("en", {
    timeZone: WARSAW_TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(probe)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = offsetName?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return "+00:00";
  return `${match[1]}${match[2].padStart(2, "0")}:${match[3] ?? "00"}`;
}

export function warsawDateTime(date: string, time: string | null): string {
  if (!time) return date;
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalizedTime}${warsawOffset(date, time)}`;
}

export const NO_INDEX_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};
