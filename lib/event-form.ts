import { z } from "zod";
import { EVENT_CATEGORIES } from "@/types/event";

const emptyToNull = (value: unknown) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.string().max(max).nullable());

const publicHttpsUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .url("Enter a valid URL")
    .max(2048)
    .refine((value) => {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      return (
        url.protocol === "https:" &&
        host !== "localhost" &&
        !host.endsWith(".local") &&
        !/^127\./.test(host) &&
        !/^10\./.test(host) &&
        !/^192\.168\./.test(host) &&
        !/^172\.(1[6-9]|2\d|3[01])\./.test(host)
      );
    }, "Only public HTTPS URLs are allowed")
    .nullable(),
);

const socialUrl = (hosts: string[]) =>
  publicHttpsUrl.refine(
    (value) =>
      !value ||
      hosts.some((host) => {
        const actual = new URL(value).hostname.toLowerCase();
        return actual === host || actual.endsWith(`.${host}`);
      }),
    "Enter a URL from the correct social network",
  );

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");
const time = z.preprocess(
  emptyToNull,
  z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time")
    .nullable(),
);
const price = z.preprocess((value) => {
  const normalized = emptyToNull(value);
  return normalized === null ? null : Number(normalized);
}, z.number().finite().nonnegative().max(1_000_000).nullable());

const eventBaseSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  category: z.enum(EVENT_CATEGORIES),
  instructor: optionalText(160),
  academy: optionalText(160),
  city: optionalText(120),
  address: optionalText(300),
  date,
  end_date: z.preprocess(emptyToNull, date.nullable()),
  start_time: time,
  end_time: time,
  price,
  currency: z.enum(["PLN", "EUR", "USD", "GBP"]),
  registration_url: publicHttpsUrl,
  facebook_url: socialUrl(["facebook.com", "fb.com"]),
  instagram_url: socialUrl(["instagram.com"]),
  description: optionalText(10_000),
  published: z.boolean(),
});

function validateDateRange(
  value: { date: string; end_date: string | null },
  context: z.RefinementCtx,
) {
  if (value.end_date && value.end_date < value.date) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["end_date"],
      message: "End date must be on or after the start date",
    });
  }
}

const eventSchema = eventBaseSchema.superRefine(validateDateRange);

const submissionSchema = eventBaseSchema
  .omit({ published: true })
  .extend({ contact_email: z.string().trim().email().max(254) })
  .superRefine(validateDateRange);

function rawEvent(formData: FormData) {
  return {
    title: formData.get("title"),
    category: formData.get("category"),
    instructor: formData.get("instructor"),
    academy: formData.get("academy"),
    city: formData.get("city"),
    address: formData.get("address"),
    date: formData.get("date"),
    end_date: formData.get("end_date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    price: formData.get("price"),
    currency: formData.get("currency") || "PLN",
    registration_url: formData.get("registration_url"),
    facebook_url: formData.get("facebook_url"),
    instagram_url: formData.get("instagram_url"),
    description: formData.get("description"),
  };
}

export function parseEventFormData(formData: FormData) {
  return eventSchema.parse({
    ...rawEvent(formData),
    published: formData.get("published") === "on",
  });
}

export function parseSubmissionFormData(formData: FormData) {
  return submissionSchema.parse({
    ...rawEvent(formData),
    contact_email: formData.get("contact_email"),
  });
}

export function validationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? fallback;
  return fallback;
}

export function parseUuid(value: unknown): string {
  return z.string().uuid("Invalid identifier").parse(value);
}
