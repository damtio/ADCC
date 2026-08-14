"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseEventFormData,
  parseUuid,
  validationErrorMessage,
} from "@/lib/event-form";
import { consumeRateLimit, privateFingerprint } from "@/lib/rate-limit";
import { resolveUniqueEventSlug } from "@/lib/event-slug";
import { revalidatePublicContent } from "@/lib/public-cache";
import { preserveEventImageUrl, uploadEventImage } from "@/lib/storage";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServerClient, getAuthUser } from "@/lib/supabase/server";
import { sortEventsChronologically } from "@/lib/utils";
import type { Event } from "@/types/event";

async function resolveImageUrl(
  formData: FormData,
  supabase: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
  userId: string,
): Promise<string | null> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const allowed = await consumeRateLimit(
      "user-event-upload",
      privateFingerprint("user", userId),
      20,
      86400,
    );
    if (!allowed) throw new Error("Daily image upload limit reached");
    return uploadEventImage(supabase, file, { kind: "user", userId });
  }

  return preserveEventImageUrl(formData.get("existing_image_url"));
}

export async function createUserEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = parseEventFormData(formData);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    const slug = await resolveUniqueEventSlug(supabase, data.title);
    const image_url = await resolveImageUrl(formData, supabase, user.id);

    const { error } = await supabase.from("events").insert({
      ...data,
      slug,
      image_url,
      user_id: user.id,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          error:
            "An event with a similar title already exists. Try a different title.",
        };
      }
      return { error: "Unable to create the event." };
    }

    revalidatePublicContent({ events: true, eventSlug: slug });
    revalidatePath("/my-events", "layout");
    return { success: true };
  } catch (e) {
    return {
      error: validationErrorMessage(
        e,
        e instanceof Error ? e.message : "Failed to create event",
      ),
    };
  }
}

export async function updateUserEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const id = parseUuid(formData.get("id"));
    const data = parseEventFormData(formData);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    const slug = await resolveUniqueEventSlug(supabase, data.title, id);
    const image_url = await resolveImageUrl(formData, supabase, user.id);

    const { data: updated, error } = await supabase
      .from("events")
      .update({
        ...data,
        slug,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) return { error: "Unable to update the event." };
    if (!updated) return { error: "Event not found" };

    revalidatePublicContent({ events: true, eventSlug: slug });
    revalidatePath("/my-events", "layout");
    return { success: true };
  } catch (e) {
    return {
      error: validationErrorMessage(
        e,
        e instanceof Error ? e.message : "Failed to update event",
      ),
    };
  }
}

export async function deleteUserEventAction(id: string): Promise<void> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  id = parseUuid(id);
  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Unable to delete the event");

  revalidatePublicContent({ events: true });
  revalidatePath("/my-events", "layout");
}

export async function toggleUserPublishAction(
  id: string,
  published: boolean,
): Promise<void> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  id = parseUuid(id);
  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: updated, error } = await supabase
    .from("events")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("slug")
    .maybeSingle();

  if (error) throw new Error("Unable to change event visibility");

  revalidatePublicContent({
    events: true,
    eventSlug: updated?.slug ?? null,
  });
  revalidatePath("/my-events", "layout");
}

export async function getUserEvents(): Promise<Event[]> {
  const user = await getAuthUser();
  if (!user) return [];

  const supabase = createSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return sortEventsChronologically((data as Event[]) ?? []);
}

export async function getUserEventById(id: string): Promise<Event | null> {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = createSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as Event;
}

export async function signOutAction(locale: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect(`/${locale}/login`);
}
