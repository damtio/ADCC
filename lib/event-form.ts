import { EVENT_CATEGORIES, type EventCategory } from "@/types/event";

function parseEndDate(
  startDate: string,
  endDateRaw: FormDataEntryValue | null,
): string | null {
  const endDate = (endDateRaw as string)?.trim() || null;
  if (!endDate || endDate === startDate) return null;
  if (endDate < startDate) {
    throw new Error("End date must be on or after the start date");
  }
  return endDate;
}

export function parseEventFormData(formData: FormData) {
  const category = formData.get("category") as string;
  if (!EVENT_CATEGORIES.includes(category as EventCategory)) {
    throw new Error("Invalid category");
  }

  const published = formData.get("published") === "on";
  const priceStr = formData.get("price") as string;
  const date = formData.get("date") as string;

  return {
    title: formData.get("title") as string,
    category: category as EventCategory,
    instructor: (formData.get("instructor") as string) || null,
    academy: (formData.get("academy") as string) || null,
    city: (formData.get("city") as string) || null,
    address: (formData.get("address") as string) || null,
    date,
    end_date: parseEndDate(date, formData.get("end_date")),
    start_time: (formData.get("start_time") as string) || null,
    end_time: (formData.get("end_time") as string) || null,
    price: priceStr ? parseFloat(priceStr) : null,
    currency: (formData.get("currency") as string) || "PLN",
    registration_url: (formData.get("registration_url") as string) || null,
    facebook_url: (formData.get("facebook_url") as string) || null,
    instagram_url: (formData.get("instagram_url") as string) || null,
    description: (formData.get("description") as string) || null,
    published,
  };
}

export function parseSubmissionFormData(formData: FormData) {
  const category = formData.get("category") as string;
  if (!EVENT_CATEGORIES.includes(category as EventCategory)) {
    throw new Error("Invalid category");
  }

  const priceStr = formData.get("price") as string;
  const contactEmail = (formData.get("contact_email") as string)?.trim();
  const date = formData.get("date") as string;

  if (!contactEmail) {
    throw new Error("Contact email is required");
  }

  return {
    title: formData.get("title") as string,
    category: category as EventCategory,
    instructor: (formData.get("instructor") as string) || null,
    academy: (formData.get("academy") as string) || null,
    city: (formData.get("city") as string) || null,
    address: (formData.get("address") as string) || null,
    date,
    end_date: parseEndDate(date, formData.get("end_date")),
    start_time: (formData.get("start_time") as string) || null,
    end_time: (formData.get("end_time") as string) || null,
    price: priceStr ? parseFloat(priceStr) : null,
    currency: (formData.get("currency") as string) || "PLN",
    registration_url: (formData.get("registration_url") as string) || null,
    facebook_url: (formData.get("facebook_url") as string) || null,
    instagram_url: (formData.get("instagram_url") as string) || null,
    description: (formData.get("description") as string) || null,
    contact_email: contactEmail,
  };
}
