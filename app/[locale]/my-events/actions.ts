"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseEventFormData } from "@/lib/event-form";
import { uploadEventImage } from "@/lib/storage";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServerClient, getAuthUser } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Event } from "@/types/event";

async function resolveImageUrl(
  formData: FormData,
  supabase: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
): Promise<string | null> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    return uploadEventImage(supabase, file);
  }

  const existing = formData.get("existing_image_url") as string;
  return existing || null;
}

export async function createUserEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = parseEventFormData(formData);
    const slug = slugify(data.title);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    const image_url = await resolveImageUrl(formData, supabase);

    const { error } = await supabase.from("events").insert({
      ...data,
      slug,
      image_url,
      user_id: user.id,
    });

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/my-events", "layout");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create event" };
  }
}

export async function updateUserEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const id = formData.get("id") as string;
    const data = parseEventFormData(formData);
    const slug = slugify(data.title);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    const image_url = await resolveImageUrl(formData, supabase);

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

    if (error) return { error: error.message };
    if (!updated) return { error: "Event not found" };

    revalidatePath("/");
    revalidatePath("/my-events", "layout");
    revalidatePath(`/event/${slug}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update event" };
  }
}

export async function deleteUserEventAction(id: string): Promise<void> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/my-events", "layout");
}

export async function toggleUserPublishAction(
  id: string,
  published: boolean,
): Promise<void> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("events")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
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
    .order("date", { ascending: true });

  if (error) throw error;
  return (data as Event[]) ?? [];
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
