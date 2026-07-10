export interface Academy {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type AcademyFormData = Omit<Academy, "id" | "created_at" | "updated_at">;
