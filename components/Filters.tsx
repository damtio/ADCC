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
import { EVENT_CATEGORIES } from "@/types/event";
import { formatDate } from "@/lib/utils";

interface FiltersProps {
  search: string;
  category: string;
  city: string;
  date: string;
  cities: string[];
  dates: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export function Filters({
  search,
  category,
  city,
  date,
  cities,
  dates,
  onSearchChange,
  onCategoryChange,
  onCityChange,
  onDateChange,
}: FiltersProps) {
  const t = useTranslations("events");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SearchBox value={search} onChange={onSearchChange} />

      <Select value={category || "all"} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("category")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCategories")}</SelectItem>
          {EVENT_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      <Select value={date || "all"} onValueChange={onDateChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("date")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allDates")}</SelectItem>
          {dates.map((d) => (
            <SelectItem key={d} value={d}>
              {formatDate(d)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
