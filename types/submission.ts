import { EVENT_CATEGORIES, type EventCategory } from "@/types/event";

export const SUBMISSION_STATUSES = ["pending", "approved", "rejected"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export interface EventSubmission {
  id: string;
  title: string;
  category: EventCategory;
  description: string | null;
  instructor: string | null;
  academy: string | null;
  city: string | null;
  address: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  currency: string | null;
  registration_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  image_url: string | null;
  contact_email: string;
  status: SubmissionStatus;
  created_at: string;
}
