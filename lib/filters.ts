import type { Event, EventFilters } from "@/types/event";

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  return events.filter((event) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const fields = [event.title, event.instructor, event.academy]
        .filter(Boolean)
        .map((f) => f!.toLowerCase());
      if (!fields.some((f) => f.includes(query))) return false;
    }

    if (filters.category && event.category !== filters.category) {
      return false;
    }

    if (filters.city && event.city !== filters.city) {
      return false;
    }

    if (filters.date && event.date !== filters.date) {
      return false;
    }

    return true;
  });
}

export function getUniqueCities(events: Event[]): string[] {
  const cities = events
    .map((e) => e.city)
    .filter((c): c is string => Boolean(c));
  return [...new Set(cities)].sort();
}

export function getUniqueDates(events: Event[]): string[] {
  const dates = events.map((e) => e.date);
  return [...new Set(dates)].sort();
}
