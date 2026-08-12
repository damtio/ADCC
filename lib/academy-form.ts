import { z } from "zod";
import { ACADEMY_SPECIALIZATIONS, type AcademyFormData } from "@/types/academy";

const emptyToNull = (value: unknown) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};
const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.string().max(max).nullable());
const httpsUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .url()
    .max(2048)
    .refine(
      (value) => new URL(value).protocol === "https:",
      "Only HTTPS URLs are allowed",
    )
    .nullable(),
);
const socialUrl = (host: string) =>
  httpsUrl.refine((value) => {
    if (!value) return true;
    const actual = new URL(value).hostname.toLowerCase();
    return actual === host || actual.endsWith(`.${host}`);
  }, "Enter a URL from the correct social network");
const optionalNumber = (minimum: number, maximum: number) =>
  z.preprocess((value) => {
    const normalized = emptyToNull(value);
    return normalized === null ? null : Number(normalized);
  }, z.number().finite().min(minimum).max(maximum).nullable());

const academySchema = z.object({
  name: z.string().trim().min(2, "Academy name is required").max(160),
  address: z.string().trim().min(3, "Address is required").max(300),
  city: z.string().trim().min(2).max(120),
  district: z.string().trim().max(120),
  specialization: z.enum(ACADEMY_SPECIALIZATIONS),
  phone: optionalText(40),
  email: z.preprocess(emptyToNull, z.string().email().max(254).nullable()),
  website: httpsUrl,
  facebook_url: socialUrl("facebook.com"),
  instagram_url: socialUrl("instagram.com"),
  image_url: httpsUrl,
  latitude: optionalNumber(-90, 90),
  longitude: optionalNumber(-180, 180),
  sort_order: z.coerce.number().int().min(-10_000).max(10_000),
  published: z.boolean(),
});

export function parseAcademyFormData(formData: FormData): AcademyFormData {
  return academySchema.parse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city") || "Kraków",
    district: formData.get("district") || "",
    specialization: formData.get("specialization") || "Gi + NoGi",
    phone: formData.get("phone"),
    email: formData.get("email"),
    website: formData.get("website"),
    facebook_url: formData.get("facebook_url"),
    instagram_url: formData.get("instagram_url"),
    image_url: formData.get("image_url"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    sort_order: formData.get("sort_order") || 0,
    published: formData.get("published") === "on",
  });
}
