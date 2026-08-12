import type { Event } from "@/types/event";

export function hasEventMapsTarget(
  event: Pick<Event, "address" | "city" | "academy">,
): boolean {
  return Boolean(event.address || event.city || event.academy);
}

/** Google Maps search by academy address text (same pattern as Academies cards). */
export function buildEventMapsUrl(
  event: Pick<Event, "address" | "city" | "academy">,
): string {
  const query = [event.academy, event.address, event.city]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildUnityOpenMatSlug(date: string, startTime: string): string {
  const time = startTime.slice(0, 5).replace(":", "");
  return `unity-open-mat-nogi-${date}-${time}`;
}
