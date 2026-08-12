import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(
  startDate: string,
  endDate: string | null | undefined,
): string {
  if (!endDate || endDate === startDate) {
    return formatDate(startDate);
  }

  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  const startLabel = start.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });

  const endLabel = end.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: sameMonth ? undefined : "short",
    year: "numeric",
  });

  return `${startLabel} – ${endLabel}`;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Inclusive list of YYYY-MM-DD dates from start through end. */
export function eachDateInRange(
  startDate: string,
  endDate: string | null | undefined,
): string[] {
  const lastKey = endDate && endDate > startDate ? endDate : startDate;
  const dates: string[] = [];
  const cursor = new Date(startDate + "T00:00:00");
  const last = new Date(lastKey + "T00:00:00");

  while (cursor <= last) {
    dates.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function eventCoversDate(
  event: { date: string; end_date?: string | null },
  date: string,
): boolean {
  const end =
    event.end_date && event.end_date > event.date ? event.end_date : event.date;
  return date >= event.date && date <= end;
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  return `${hours}:${minutes}`;
}

export function formatPrice(
  price: number | null,
  currency: string | null,
): string {
  if (price === null || price === undefined) return "Free";
  const curr = currency || "PLN";
  if (price === 0) return "Free";
  return `${price} ${curr}`;
}

export const ADCC_WEEKEND_DATE = "2026-09-12";

export function compareEventsChronologically(
  a: { date: string; start_time: string | null; title: string },
  b: { date: string; start_time: string | null; title: string },
): number {
  const byDate = a.date.localeCompare(b.date);
  if (byDate !== 0) return byDate;

  const aTime = a.start_time ?? "23:59:59";
  const bTime = b.start_time ?? "23:59:59";
  const byTime = aTime.localeCompare(bTime);
  if (byTime !== 0) return byTime;

  return a.title.localeCompare(b.title);
}

export function sortEventsChronologically<
  T extends { date: string; start_time: string | null; title: string },
>(events: T[]): T[] {
  return [...events].sort(compareEventsChronologically);
}
