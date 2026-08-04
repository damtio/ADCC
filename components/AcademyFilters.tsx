"use client";

import { useTranslations } from "next-intl";
import { SearchBox } from "@/components/SearchBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACADEMY_SPECIALIZATIONS } from "@/types/academy";

interface AcademyFiltersProps {
  search: string;
  city: string;
  specialization: string;
  cities: string[];
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
}

export function AcademyFilters({
  search,
  city,
  specialization,
  cities,
  onSearchChange,
  onCityChange,
  onSpecializationChange,
}: AcademyFiltersProps) {
  const t = useTranslations("academies");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SearchBox
        value={search}
        onChange={onSearchChange}
        placeholder={t("searchPlaceholder")}
      />

      <Select value={city || "all"} onValueChange={onCityChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("city")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCities")}</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={specialization || "all"}
        onValueChange={onSpecializationChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("specialization")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allSpecializations")}</SelectItem>
          {ACADEMY_SPECIALIZATIONS.map((spec) => (
            <SelectItem key={spec} value={spec}>
              {spec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
