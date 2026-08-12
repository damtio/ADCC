import type { Academy, AcademyFilters } from "@/types/academy";
import type { Event, EventFilters } from "@/types/event";
import {
  eachDateInRange,
  eventCoversDate,
  sortEventsChronologically,
} from "@/lib/utils";

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  return sortEventsChronologically(
    events.filter((event) => {
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

      if (filters.date && !eventCoversDate(event, filters.date)) {
        return false;
      }

      return true;
    }),
  );
}

export function getUniqueCities(events: Event[]): string[] {
  const cities = events
    .map((e) => e.city)
    .filter((c): c is string => Boolean(c));
  return [...new Set(cities)].sort();
}

export function getUniqueDates(events: Event[]): string[] {
  const dates = events.flatMap((e) => eachDateInRange(e.date, e.end_date));
  return [...new Set(dates)].sort();
}

export function filterAcademies(
  academies: Academy[],
  filters: AcademyFilters,
): Academy[] {
  return academies.filter((academy) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const fields = [
        academy.name,
        academy.city,
        academy.district,
        academy.address,
      ]
        .filter(Boolean)
        .map((f) => f.toLowerCase());
      if (!fields.some((f) => f.includes(query))) return false;
    }

    if (filters.city && academy.city !== filters.city) {
      return false;
    }

    if (
      filters.specialization &&
      academy.specialization !== filters.specialization
    ) {
      return false;
    }

    return true;
  });
}

export function getUniqueAcademyCities(academies: Academy[]): string[] {
  const cities = academies
    .map((a) => a.city)
    .filter((c): c is string => Boolean(c));
  return [...new Set(cities)].sort();
}
