import type { Academy } from "@/types/academy";
import type { Event } from "@/types/event";

type AcademySocial = Pick<
  Academy,
  "name" | "city" | "facebook_url" | "instagram_url"
>;

function normalizedAcademyName(value: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findAcademy(event: Event, academies: AcademySocial[]) {
  const eventName = normalizedAcademyName(event.academy);
  if (!eventName) return null;

  const exact = academies.find(
    (academy) => normalizedAcademyName(academy.name) === eventName,
  );
  if (exact) return exact;

  // Legacy events often contain a shortened academy name, e.g. "Unity".
  if (eventName.length < 5) return null;
  const candidates = academies.filter((academy) => {
    const academyName = normalizedAcademyName(academy.name);
    return academyName.includes(eventName) || eventName.includes(academyName);
  });
  if (candidates.length === 1) return candidates[0];

  const eventCity = normalizedAcademyName(event.city);
  return (
    candidates.find(
      (academy) => normalizedAcademyName(academy.city) === eventCity,
    ) ?? null
  );
}

export function inheritAcademySocials(
  event: Event,
  academies: AcademySocial[],
): Event {
  if (event.facebook_url && event.instagram_url) return event;
  const academy = findAcademy(event, academies);
  if (!academy) return event;

  return {
    ...event,
    facebook_url: event.facebook_url || academy.facebook_url,
    instagram_url: event.instagram_url || academy.instagram_url,
  };
}
