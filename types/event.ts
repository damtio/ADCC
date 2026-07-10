export const EVENT_CATEGORIES = [
  "Seminar - Gi",
  "Seminar - NoGi",
  "Seminar - Gi + NoGi",
  "Afterparty",
  "Open Mat",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface Event {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  description: string | null;
  instructor: string | null;
  organizer: string | null;
  academy: string | null;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  currency: string | null;
  registration_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type EventFormData = Omit<
  Event,
  "id" | "slug" | "created_at" | "updated_at"
>;

export interface EventFilters {
  search?: string;
  category?: string;
  city?: string;
  date?: string;
}
