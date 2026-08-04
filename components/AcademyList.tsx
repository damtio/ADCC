"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { AcademyCard } from "@/components/AcademyCard";
import { AcademyFilters } from "@/components/AcademyFilters";
import { filterAcademies, getUniqueAcademyCities } from "@/lib/filters";
import type { Academy } from "@/types/academy";

interface AcademyListProps {
  academies: Academy[];
}

export function AcademyList({ academies }: AcademyListProps) {
  const t = useTranslations("academies");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [specialization, setSpecialization] = useState("");

  const cities = useMemo(() => getUniqueAcademyCities(academies), [academies]);

  const filtered = useMemo(
    () =>
      filterAcademies(academies, {
        search: search || undefined,
        city: city && city !== "all" ? city : undefined,
        specialization:
          specialization && specialization !== "all"
            ? specialization
            : undefined,
      }),
    [academies, search, city, specialization],
  );

  return (
    <div className="space-y-8">
      <AcademyFilters
        search={search}
        city={city}
        specialization={specialization}
        cities={cities}
        onSearchChange={setSearch}
        onCityChange={setCity}
        onSpecializationChange={setSpecialization}
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2B2B2B] bg-[#151515] py-16 text-center">
          <p className="text-lg text-zinc-400">{t("noResults")}</p>
          <p className="mt-1 text-sm text-zinc-600">{t("tryFilters")}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((academy) => (
            <AcademyCard key={academy.id} academy={academy} />
          ))}
        </div>
      )}
    </div>
  );
}
