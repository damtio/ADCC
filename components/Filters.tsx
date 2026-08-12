"use client";

import { useTranslations } from "next-intl";
import { SearchBox } from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  hasActiveFilters: boolean;
  onClear: () => void;
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
  hasActiveFilters,
  onClear,
}: FiltersProps) {
  const t = useTranslations("events");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SearchBox
          value={search}
          onChange={onSearchChange}
          ariaLabel={t("searchLabel")}
        />

        <div>
          <Label className="sr-only" htmlFor="event-category-filter">
            {t("category")}
          </Label>
          <Select value={category || "all"} onValueChange={onCategoryChange}>
            <SelectTrigger
              id="event-category-filter"
              aria-label={t("category")}
            >
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
        </div>

        <div>
          <Label className="sr-only" htmlFor="event-city-filter">
            {t("city")}
          </Label>
          <Select value={city || "all"} onValueChange={onCityChange}>
            <SelectTrigger id="event-city-filter" aria-label={t("city")}>
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
        </div>

        <div>
          <Label className="sr-only" htmlFor="event-date-filter">
            {t("date")}
          </Label>
          <Select value={date || "all"} onValueChange={onDateChange}>
            <SelectTrigger id="event-date-filter" aria-label={t("date")}>
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
      </div>

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
