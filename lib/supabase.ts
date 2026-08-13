import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Academy } from "@/types/academy";
import type { Event } from "@/types/event";
import {
  ACADEMY_LIST_COLUMNS,
  CACHE_TAGS,
  EVENT_DETAIL_COLUMNS,
  EVENT_LIST_COLUMNS,
  PUBLIC_REVALIDATE,
} from "@/lib/public-cache-config";
import { sortEventsChronologically } from "@/lib/utils";
import { inheritAcademySocials } from "@/lib/event-academy";

export function isSupabasePublicConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes("your_supabase") || key.includes("your_supabase"))
    return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabasePublicConfigured() || !url || !key) {
    return null;
  }

  return createClient(url, key);
}

async function fetchPublishedEvents(): Promise<Event[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_LIST_COLUMNS)
    .eq("published", true)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: false });

  if (error) throw error;
  const academies = await fetchPublishedAcademies();
  const events = ((data as unknown as Event[]) ?? []).map((event) =>
    inheritAcademySocials(event, academies),
  );
  return sortEventsChronologically(events);
}

async function fetchEventBySlug(slug: string): Promise<Event | null> {
  const supabase = createSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_DETAIL_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  const academies = await fetchPublishedAcademies();
  return inheritAcademySocials(data as unknown as Event, academies);
}

async function fetchPublishedAcademies(): Promise<Academy[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("academies")
    .select(ACADEMY_LIST_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as unknown as Academy[]) ?? [];
}

/** Cross-request Data Cache + tags (ISR companion). */
export function getPublishedEvents(): Promise<Event[]> {
  return unstable_cache(fetchPublishedEvents, ["published-events"], {
    revalidate: PUBLIC_REVALIDATE.home,
    tags: [CACHE_TAGS.events, CACHE_TAGS.academies],
  })();
}

/** Request-level dedupe (metadata + page) + cross-request cache. */
export const getEventBySlug = cache(
  async (slug: string): Promise<Event | null> => {
    return unstable_cache(
      () => fetchEventBySlug(slug),
      ["published-event", slug],
      {
        revalidate: PUBLIC_REVALIDATE.eventDetail,
        tags: [CACHE_TAGS.events, CACHE_TAGS.academies, CACHE_TAGS.event(slug)],
      },
    )();
  },
);

export function getPublishedAcademies(): Promise<Academy[]> {
  return unstable_cache(fetchPublishedAcademies, ["published-academies"], {
    revalidate: PUBLIC_REVALIDATE.academies,
    tags: [CACHE_TAGS.academies],
  })();
}

export async function getAllEventSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("slug,updated_at")
    .eq("published", true);

  if (error) return [];
  return data ?? [];
}
