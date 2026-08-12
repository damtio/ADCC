"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { Filters } from "@/components/Filters";
import { filterEvents, getUniqueCities, getUniqueDates } from "@/lib/filters";
import {
  EMPTY_EVENT_FILTERS,
  hasActiveEventFilters,
  parseEventFilterParams,
  serializeEventFilterParams,
  type EventFilterState,
} from "@/lib/event-filter-params";
import { EVENT_CATEGORIES } from "@/types/event";
import type { Event } from "@/types/event";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const t = useTranslations("events");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const cities = useMemo(() => getUniqueCities(events), [events]);
  const dates = useMemo(() => getUniqueDates(events), [events]);

  const readFiltersFromUrl = useCallback(() => {
    const filters = parseEventFilterParams(window.location.search, {
      categories: EVENT_CATEGORIES,
      cities,
      dates,
    });
    setSearch(filters.search);
    setCategory(filters.category);
    setCity(filters.city);
    setDate(filters.date);
  }, [cities, dates]);

  useEffect(() => {
    readFiltersFromUrl();
    window.addEventListener("popstate", readFiltersFromUrl);
    return () => window.removeEventListener("popstate", readFiltersFromUrl);
  }, [readFiltersFromUrl]);

  function updateFilters(next: EventFilterState) {
    setSearch(next.search);
    setCategory(next.category);
    setCity(next.city);
    setDate(next.date);

    const query = serializeEventFilterParams(next, window.location.search);
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query}${window.location.hash}`,
    );
  }

  const currentFilters = { search, category, city, date };
  const hasActiveFilters = hasActiveEventFilters(currentFilters);

  const filteredEvents = useMemo(
    () =>
      filterEvents(events, {
        search: search || undefined,
        category: category && category !== "all" ? category : undefined,
        city: city && city !== "all" ? city : undefined,
        date: date && date !== "all" ? date : undefined,
      }),
    [events, search, category, city, date],
  );

  return (
    <div className="space-y-8">
      <Filters
        search={search}
        category={category}
        city={city}
        date={date}
        cities={cities}
        dates={dates}
        onSearchChange={(value) =>
          updateFilters({ ...currentFilters, search: value })
        }
        onCategoryChange={(value) =>
          updateFilters({ ...currentFilters, category: value })
        }
        onCityChange={(value) =>
          updateFilters({ ...currentFilters, city: value })
        }
        onDateChange={(value) =>
          updateFilters({ ...currentFilters, date: value })
        }
        hasActiveFilters={hasActiveFilters}
        onClear={() => updateFilters(EMPTY_EVENT_FILTERS)}
      />

      <p
        className="text-sm text-zinc-500"
        aria-live="polite"
        aria-atomic="true"
      >
        {t("resultsCount", { count: filteredEvents.length })}
      </p>

      {filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-[#2B2B2B] bg-[#151515] py-16 text-center">
          <p className="text-lg text-zinc-400">{t("noResults")}</p>
          <p className="mt-1 text-sm text-zinc-600">{t("tryFilters")}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
