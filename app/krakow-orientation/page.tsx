import type { Metadata } from "next";
import { OrientationNav } from "@/components/OrientationNav";
import { OrientationSectionView } from "@/components/OrientationSection";
import { KRAKOW_ORIENTATION_SECTIONS } from "@/data/krakow-orientation";

export const metadata: Metadata = {
  title: "Kraków Orientation",
  description:
    "Practical tips for getting around Kraków during ADCC weekend — transport, tickets, districts and essentials.",
};

export default function KrakowOrientationPage() {
  const navSections = KRAKOW_ORIENTATION_SECTIONS.map(({ id, title }) => ({
    id,
    title,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center lg:mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Kraków <span className="text-red-500">Orientation</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
          A quick guide for visitors — how to move around the city, reach
          academies and make the most of ADCC weekend.
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <OrientationNav sections={navSections} />

        <div className="min-w-0 flex-1 space-y-12">
          {KRAKOW_ORIENTATION_SECTIONS.map((section) => (
            <OrientationSectionView
              key={section.id}
              id={section.id}
              title={section.title}
              blocks={section.blocks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
