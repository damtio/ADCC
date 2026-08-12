import type { Event } from "@/types/event";

export function buildEventMapsUrl(
  event: Pick<Event, "latitude" | "longitude" | "address" | "city" | "academy">,
): string {
  if (event.latitude && event.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
  }

  const query = [event.academy, event.address, event.city]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildUnityOpenMatSlug(date: string, startTime: string): string {
  const time = startTime.slice(0, 5).replace(":", "");
  return `unity-open-mat-nogi-${date}-${time}`;
}
