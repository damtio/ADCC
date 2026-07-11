"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-[#2B2B2B] bg-[#151515] p-0.5",
        className,
      )}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium uppercase transition-colors",
            locale === loc
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
