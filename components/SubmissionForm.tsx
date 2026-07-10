"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_CATEGORIES } from "@/types/event";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) => Promise<{ error?: string; success?: boolean } | null>;

interface SubmissionFormProps {
  action: FormAction;
}

export function SubmissionForm({ action }: SubmissionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-[#2B2B2B] bg-[#151515] p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Thank you!</h2>
        <p className="mt-2 text-zinc-400">
          Your event has been submitted and is awaiting review.
        </p>
      </div>
    );
  }

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

      {/* Honeypot — hidden from users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact_email">Your Email *</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            required
            placeholder="contact@academy.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            defaultValue="Seminar - NoGi"
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
          <Input id="instructor" name="instructor" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academy">Academy</Label>
          <Input id="academy" name="academy" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" name="date" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input id="start_time" name="start_time" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" name="end_time" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue="PLN" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="registration_url">Registration URL</Label>
          <Input id="registration_url" name="registration_url" type="url" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_url">Facebook URL</Label>
          <Input id="facebook_url" name="facebook_url" type="url" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram_url">Instagram URL</Label>
          <Input id="instagram_url" name="instagram_url" type="url" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Event Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <p className="text-xs text-zinc-500">
            JPEG, PNG, WebP or GIF. Max 5 MB.
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={6} />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Submitting..." : "Submit Event"}
      </Button>
    </form>
  );
}
