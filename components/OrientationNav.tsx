"use client";

import { cn } from "@/lib/utils";

interface OrientationNavProps {
  sections: { id: string; title: string }[];
  onThisPageLabel: string;
}

export function OrientationNav({
  sections,
  onThisPageLabel,
}: OrientationNavProps) {
  return (
    <>
      <nav
        aria-label={onThisPageLabel}
        className="sticky top-16 z-40 -mx-4 border-b border-[#2B2B2B] bg-[#090909]/95 px-4 py-3 backdrop-blur-md lg:hidden"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-full border border-[#2B2B2B] bg-[#151515] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-600/40 hover:text-white"
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      <nav
        aria-label={onThisPageLabel}
        className="hidden lg:block lg:w-56 lg:shrink-0"
      >
        <div className="sticky top-24 space-y-1">
          <p className="mb-3 text-xs font-medium tracking-wider text-zinc-500 uppercase">
            {onThisPageLabel}
          </p>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors",
                "hover:bg-[#151515] hover:text-white",
              )}
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
