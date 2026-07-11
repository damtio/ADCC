"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  const routeParams = { ...params };
  delete routeParams.locale;
  const href =
    Object.keys(routeParams).length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ pathname, params: routeParams } as any)
      : pathname;

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
          href={href}
          locale={loc}
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
