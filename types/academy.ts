export const ACADEMY_SPECIALIZATIONS = ["Gi", "NoGi", "Gi + NoGi"] as const;

export type AcademySpecialization = (typeof ACADEMY_SPECIALIZATIONS)[number];

export interface Academy {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  specialization: AcademySpecialization;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  sort_order: number;
  published: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export type AcademyFormData = Omit<
  Academy,
  "id" | "created_at" | "updated_at" | "user_id"
>;

export interface AcademyFilters {
  search?: string;
  city?: string;
  specialization?: string;
}
