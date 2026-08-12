"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter as useNextRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import { EVENT_CATEGORIES, type Event } from "@/types/event";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) => Promise<{ error?: string; success?: boolean } | null>;

interface EventFormProps {
  event?: Event;
  action: FormAction;
  successHref?: string;
  translated?: boolean;
}

const ERROR_KEYS: Record<string, string> = {
  Unauthorized: "errors.unauthorized",
  "Event not found": "errors.notFound",
  "An event with a similar title already exists. Try a different title.":
    "errors.slugDuplicate",
  "Failed to create event": "errors.createFailed",
  "Failed to update event": "errors.updateFailed",
};

export function EventForm({
  event,
  action,
  successHref = "/admin",
  translated = false,
}: EventFormProps) {
  const tFields = useTranslations("submitEvent");
  const tForm = useTranslations("myEvents");
  const nextRouter = useNextRouter();
  const intlRouter = useIntlRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const label = (key: Parameters<typeof tFields>[0]) =>
    translated
      ? tFields(key)
      : fallbackLabels[key as keyof typeof fallbackLabels];

  const formLabel = (key: Parameters<typeof tForm>[0]) =>
    translated
      ? tForm(key)
      : fallbackFormLabels[key as keyof typeof fallbackFormLabels];

  const errorMessage =
    state?.error &&
    (translated && ERROR_KEYS[state.error]
      ? tForm(ERROR_KEYS[state.error] as Parameters<typeof tForm>[0])
      : state.error);

  useEffect(() => {
    if (!state?.success) return;
    if (successHref.startsWith("/admin")) {
      nextRouter.push(successHref);
      nextRouter.refresh();
    } else {
      intlRouter.push(successHref);
      intlRouter.refresh();
    }
  }, [state?.success, nextRouter, intlRouter, successHref]);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6"
    >
      {errorMessage && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">{label("titleLabel")}</Label>
          <Input id="title" name="title" defaultValue={event?.title} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{label("categoryLabel")}</Label>
          <select
            id="category"
            name="category"
            defaultValue={event?.category || "Seminar - NoGi"}
            required
            className="flex h-10 w-full rounded-lg border border-[#2B2B2B] bg-[#151515] px-3 py-2 text-sm text-white focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor">{label("instructorLabel")}</Label>
          <Input
            id="instructor"
            name="instructor"
            defaultValue={event?.instructor ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academy">{label("academyLabel")}</Label>
          <Input
            id="academy"
            name="academy"
            defaultValue={event?.academy ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{label("cityLabel")}</Label>
          <Input id="city" name="city" defaultValue={event?.city ?? ""} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">{label("addressLabel")}</Label>
          <Input
            id="address"
            name="address"
            defaultValue={event?.address ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{label("dateLabel")}</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={event?.date}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">{label("endDateLabel")}</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={event?.end_date ?? ""}
          />
          <p className="text-xs text-zinc-500">{label("endDateHint")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">{label("startTimeLabel")}</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={event?.start_time ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">{label("endTimeLabel")}</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={event?.end_time ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{label("priceLabel")}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={event?.price ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{label("currencyLabel")}</Label>
          <Input
            id="currency"
            name="currency"
            defaultValue={event?.currency ?? "PLN"}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="registration_url">
            {label("registrationUrlLabel")}
          </Label>
          <Input
            id="registration_url"
            name="registration_url"
            type="url"
            defaultValue={event?.registration_url ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_url">{label("facebookUrlLabel")}</Label>
          <Input
            id="facebook_url"
            name="facebook_url"
            type="url"
            defaultValue={event?.facebook_url ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram_url">{label("instagramUrlLabel")}</Label>
          <Input
            id="instagram_url"
            name="instagram_url"
            type="url"
            defaultValue={event?.instagram_url ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">{label("imageLabel")}</Label>
          {event?.image_url && (
            <div className="relative mb-2 h-40 w-full max-w-xs overflow-hidden rounded-lg border border-[#2B2B2B]">
              <Image
                src={event.image_url}
                alt={formLabel("imageAlt")}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          )}
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
          <p className="text-xs text-zinc-500">
            {label("imageHint")}
            {event?.image_url && ` ${formLabel("imageKeepHint")}`}
          </p>
          {event?.image_url && (
            <input
              type="hidden"
              name="existing_image_url"
              value={event.image_url}
            />
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">{label("descriptionLabel")}</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={event?.description ?? ""}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={event?.published ?? false}
            className="h-4 w-4 rounded border-[#2B2B2B] bg-[#151515] text-red-600 focus:ring-red-500"
          />
          <Label htmlFor="published">{formLabel("publishedLabel")}</Label>
        </div>
      </div>

      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? formLabel("saving")
            : event
              ? formLabel("updateEvent")
              : formLabel("createEvent")}
        </Button>
      </div>
    </form>
  );
}

const fallbackLabels = {
  titleLabel: "Title *",
  categoryLabel: "Category *",
  instructorLabel: "Instructor",
  academyLabel: "Academy",
  cityLabel: "City",
  addressLabel: "Address",
  dateLabel: "Start Date *",
  endDateLabel: "End Date",
  endDateHint: "Leave empty for a single-day event.",
  startTimeLabel: "Start Time",
  endTimeLabel: "End Time",
  priceLabel: "Price",
  currencyLabel: "Currency",
  registrationUrlLabel: "Registration URL",
  facebookUrlLabel: "Facebook URL",
  instagramUrlLabel: "Instagram URL",
  imageLabel: "Event Image",
  imageHint: "JPEG, PNG or WebP. Max 5 MB.",
  descriptionLabel: "Description",
} as const;

const fallbackFormLabels = {
  publishedLabel: "Published",
  saving: "Saving...",
  updateEvent: "Update Event",
  createEvent: "Create Event",
  imageKeepHint: "Leave empty to keep current image.",
  imageAlt: "Current event image",
} as const;
