"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { highlightTag } from "@/lib/i18n-rich";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", labelKey: "events" as const },
  { href: "/academies", labelKey: "academies" as const },
  { href: "/krakow-orientation", labelKey: "orientation" as const },
  { href: "/submit-event", labelKey: "submitEvent" as const },
];

const linkClassName =
  "text-sm text-zinc-400 transition-colors hover:text-white";

export function Navbar() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2B2B2B] bg-[#090909]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-red-500">
            {t.rich("brand", highlightTag)}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName}>
              {t(link.labelKey)}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <nav
        className={cn(
          "overflow-hidden border-t border-[#2B2B2B] transition-all duration-200 md:hidden",
          open
            ? "max-h-64 opacity-100"
            : "max-h-0 border-t-transparent opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="mx-auto flex flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                linkClassName,
                "rounded-lg px-3 py-2.5 hover:bg-[#151515]",
              )}
              onClick={() => setOpen(false)}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
