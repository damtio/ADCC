"use server";

import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  parseSubmissionFormData,
  validationErrorMessage,
} from "@/lib/event-form";
import {
  consumeRateLimit,
  privateFingerprint,
  requestFingerprint,
} from "@/lib/rate-limit";
import { uploadEventImage } from "@/lib/storage";

async function resolveImageUrl(
  formData: FormData,
  supabase: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
): Promise<string | null> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    return uploadEventImage(supabase, file, { kind: "submission" });
  }
  return null;
}

export async function submitEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  // Honeypot spam check
  if (formData.get("website")) {
    return { success: true };
  }

  try {
    const data = parseSubmissionFormData(formData);
    const fingerprint = await requestFingerprint();
    const emailHash = privateFingerprint("email", data.contact_email);
    const allowedByIp = await consumeRateLimit(
      "event-submit-ip",
      fingerprint.ip,
      10,
      3600,
    );
    const allowedByEmail = await consumeRateLimit(
      "event-submit-email",
      emailHash,
      3,
      86400,
    );
    if (!allowedByIp || !allowedByEmail)
      return { error: "Too many submissions. Please try again later." };

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Service is temporarily unavailable." };
    }

    const image = formData.get("image");
    if (image instanceof File && image.size > 0) {
      const uploadAllowed = await consumeRateLimit(
        "event-upload-email",
        emailHash,
        3,
        86400,
      );
      if (!uploadAllowed) return { error: "Daily image upload limit reached." };
    }
    const uniqueSubmission = await consumeRateLimit(
      "event-submit-duplicate",
      privateFingerprint(
        "submission",
        `${data.contact_email}|${data.title}|${data.date}|${data.start_time ?? ""}`,
      ),
      1,
      900,
    );
    if (!uniqueSubmission)
      return { error: "This event has already been submitted." };
    const image_url = await resolveImageUrl(formData, supabase);

    const { error } = await supabase.from("event_submissions").insert({
      ...data,
      image_url,
      status: "pending",
    });

    if (error) return { error: "Unable to submit the event right now." };

    return { success: true };
  } catch (e) {
    return {
      error: validationErrorMessage(e, "Failed to submit event"),
    };
  }
}
