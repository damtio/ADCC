import type { Metadata } from "next";
import { AcademyCard } from "@/components/AcademyCard";
import { KRAKOW_ACADEMIES } from "@/data/academies";

export const metadata: Metadata = {
  title: "BJJ Academies in Kraków",
  description:
    "Directory of Brazilian Jiu-Jitsu academies in Kraków — addresses, contact details and locations.",
};

export default function AcademiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          BJJ Academies in <span className="text-red-500">Kraków</span>
        </h1>
        <p className="mt-3 text-zinc-400">
          Find academies, contact details and locations around the city.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {KRAKOW_ACADEMIES.map((academy) => (
          <AcademyCard key={academy.id} academy={academy} />
        ))}
      </div>
    </div>
  );
}
