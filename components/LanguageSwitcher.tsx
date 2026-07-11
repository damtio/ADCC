"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function buildLocalizedHref(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && routing.locales.includes(segments[0] as Locale)) {
    segments[0] = nextLocale;
  } else {
    segments.unshift(nextLocale);
  }

  return `/${segments.join("/")}`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-[#2B2B2B] bg-[#151515] p-0.5",
        className,
      )}
    >
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={buildLocalizedHref(pathname, loc)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium uppercase transition-colors",
            locale === loc
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white",
          )}
          aria-current={locale === loc ? "page" : undefined}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}
