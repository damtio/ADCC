import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Academy } from "@/types/academy";
import type { Event } from "@/types/event";

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

export async function getPublishedEvents(): Promise<Event[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: true });

  if (error) throw error;
  return (data as Event[]) ?? [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = createSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data as Event;
}

export async function getAllEventSlugs(): Promise<{ slug: string }[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("slug")
    .eq("published", true);

  if (error) return [];
  return data ?? [];
}

export async function getPublishedAcademies(): Promise<Academy[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as Academy[]) ?? [];
}
