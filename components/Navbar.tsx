"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Events" },
  { href: "/academies", label: "Academies" },
  { href: "/submit-event", label: "Submit Event" },
] as const;

const linkClassName =
  "text-sm text-zinc-400 transition-colors hover:text-white";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2B2B2B] bg-[#090909]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-red-500">
            BJJ<span className="text-red-500">Seminars & Events</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <nav
        className={cn(
          "overflow-hidden border-t border-[#2B2B2B] transition-all duration-200 md:hidden",
          open
            ? "max-h-48 opacity-100"
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
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
