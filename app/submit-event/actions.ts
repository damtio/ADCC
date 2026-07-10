"use server";

import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { parseSubmissionFormData } from "@/lib/event-form";
import { uploadEventImage } from "@/lib/storage";

async function resolveImageUrl(
  formData: FormData,
  supabase: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
): Promise<string | null> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    return uploadEventImage(supabase, file);
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
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Service is temporarily unavailable." };
    }

    const data = parseSubmissionFormData(formData);
    const image_url = await resolveImageUrl(formData, supabase);

    const { error } = await supabase.from("event_submissions").insert({
      ...data,
      image_url,
      status: "pending",
    });

    if (error) return { error: error.message };

    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to submit event",
    };
  }
}
