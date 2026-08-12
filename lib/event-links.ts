import type { Event } from "@/types/event";

function isValidCoordinate(
  latitude: number | null,
  longitude: number | null,
): boolean {
  if (latitude == null || longitude == null) return false;
  return (
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
  );
}

export function hasEventMapsTarget(
  event: Pick<Event, "latitude" | "longitude" | "address" | "city" | "academy">,
): boolean {
  return (
    isValidCoordinate(event.latitude, event.longitude) ||
    Boolean(event.address || event.city || event.academy)
  );
}

export function buildEventMapsUrl(
  event: Pick<Event, "latitude" | "longitude" | "address" | "city" | "academy">,
): string {
  if (isValidCoordinate(event.latitude, event.longitude)) {
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
