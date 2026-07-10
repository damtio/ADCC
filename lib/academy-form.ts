import type { AcademyFormData } from "@/types/academy";

function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
  const str = (value as string)?.trim();
  if (!str) return null;
  const num = parseFloat(str);
  return Number.isFinite(num) ? num : null;
}

export function parseAcademyFormData(formData: FormData): AcademyFormData {
  const sortOrderStr = (formData.get("sort_order") as string)?.trim();

  return {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    district: formData.get("district") as string,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    website: (formData.get("website") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    latitude: parseOptionalNumber(formData.get("latitude")),
    longitude: parseOptionalNumber(formData.get("longitude")),
    sort_order: sortOrderStr ? parseInt(sortOrderStr, 10) : 0,
    published: formData.get("published") === "on",
  };
}
