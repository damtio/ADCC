import {
  ACADEMY_SPECIALIZATIONS,
  type AcademyFormData,
  type AcademySpecialization,
} from "@/types/academy";

function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
  const str = (value as string)?.trim();
  if (!str) return null;
  const num = parseFloat(str);
  return Number.isFinite(num) ? num : null;
}

function parseSpecialization(
  value: FormDataEntryValue | null,
): AcademySpecialization {
  const str = (value as string)?.trim();
  if (str && (ACADEMY_SPECIALIZATIONS as readonly string[]).includes(str)) {
    return str as AcademySpecialization;
  }
  return "Gi + NoGi";
}

export function parseAcademyFormData(formData: FormData): AcademyFormData {
  const sortOrderStr = (formData.get("sort_order") as string)?.trim();

  return {
    name: (formData.get("name") as string)?.trim() ?? "",
    address: (formData.get("address") as string)?.trim() ?? "",
    city: (formData.get("city") as string)?.trim() || "Kraków",
    district: (formData.get("district") as string)?.trim() ?? "",
    specialization: parseSpecialization(formData.get("specialization")),
    phone: (formData.get("phone") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    website: (formData.get("website") as string)?.trim() || null,
    image_url: (formData.get("image_url") as string)?.trim() || null,
    latitude: parseOptionalNumber(formData.get("latitude")),
    longitude: parseOptionalNumber(formData.get("longitude")),
    sort_order: sortOrderStr ? parseInt(sortOrderStr, 10) : 0,
    published: formData.get("published") === "on",
  };
}
