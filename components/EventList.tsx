"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { Filters } from "@/components/Filters";
import { filterEvents, getUniqueCities, getUniqueDates } from "@/lib/filters";
import type { Event } from "@/types/event";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const cities = useMemo(() => getUniqueCities(events), [events]);
  const dates = useMemo(() => getUniqueDates(events), [events]);

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
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onCityChange={setCity}
        onDateChange={setDate}
      />

      {filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-[#2B2B2B] bg-[#151515] py-16 text-center">
          <p className="text-lg text-zinc-400">No events found.</p>
          <p className="mt-1 text-sm text-zinc-600">
            Try adjusting your filters.
          </p>
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
