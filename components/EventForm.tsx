"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_CATEGORIES, type Event } from "@/types/event";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) => Promise<{ error?: string; success?: boolean } | null>;

interface EventFormProps {
  event?: Event;
  action: FormAction;
}

export function EventForm({ event, action }: EventFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin");
    }
  }, [state?.success, router]);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6"
    >
      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" defaultValue={event?.title} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
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
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            name="instructor"
            defaultValue={event?.instructor ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">Organizer</Label>
          <Input
            id="organizer"
            name="organizer"
            defaultValue={event?.organizer ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academy">Academy</Label>
          <Input
            id="academy"
            name="academy"
            defaultValue={event?.academy ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={event?.city ?? ""} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={event?.address ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={event?.latitude ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={event?.longitude ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={event?.date}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={event?.start_time ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={event?.end_time ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
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
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            name="currency"
            defaultValue={event?.currency ?? "PLN"}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="registration_url">Registration URL</Label>
          <Input
            id="registration_url"
            name="registration_url"
            type="url"
            defaultValue={event?.registration_url ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_url">Facebook URL</Label>
          <Input
            id="facebook_url"
            name="facebook_url"
            type="url"
            defaultValue={event?.facebook_url ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram_url">Instagram URL</Label>
          <Input
            id="instagram_url"
            name="instagram_url"
            type="url"
            defaultValue={event?.instagram_url ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Event Image</Label>
          {event?.image_url && (
            <div className="relative mb-2 h-40 w-full max-w-xs overflow-hidden rounded-lg border border-[#2B2B2B]">
              <Image
                src={event.image_url}
                alt="Current event image"
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
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <p className="text-xs text-zinc-500">
            JPEG, PNG, WebP or GIF. Max 5 MB.
            {event?.image_url && " Leave empty to keep current image."}
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
          <Label htmlFor="description">Description</Label>
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
          <Label htmlFor="published">Published</Label>
        </div>
      </div>

      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
