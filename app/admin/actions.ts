"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { uploadEventImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { EVENT_CATEGORIES, type EventCategory } from "@/types/event";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Admin password is not configured on the server." };
  }

  const password = formData.get("password") as string;

  if (!verifyPassword(password)) {
    return { error: "Invalid password" };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

function parseEventFormData(formData: FormData) {
  const category = formData.get("category") as string;
  if (!EVENT_CATEGORIES.includes(category as EventCategory)) {
    throw new Error("Invalid category");
  }

  const published = formData.get("published") === "on";
  const priceStr = formData.get("price") as string;

  return {
    title: formData.get("title") as string,
    category: category as EventCategory,
    instructor: (formData.get("instructor") as string) || null,
    academy: (formData.get("academy") as string) || null,
    city: (formData.get("city") as string) || null,
    address: (formData.get("address") as string) || null,
    date: formData.get("date") as string,
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

export async function createEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  if (!(await isAuthenticated())) {
    return { error: "Unauthorized" };
  }

  try {
    const data = parseEventFormData(formData);
    const slug = slugify(data.title);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return {
        error: "Supabase is not configured. Add credentials to .env.local.",
      };
    }

    const image_url = await resolveImageUrl(formData, supabase);

    const { error } = await supabase.from("events").insert({
      ...data,
      slug,
      image_url,
    });

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create event" };
  }
}

export async function updateEventAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  if (!(await isAuthenticated())) {
    return { error: "Unauthorized" };
  }

  try {
    const id = formData.get("id") as string;
    const data = parseEventFormData(formData);
    const slug = slugify(data.title);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return {
        error: "Supabase is not configured. Add credentials to .env.local.",
      };
    }

    const image_url = await resolveImageUrl(formData, supabase);

    const { error } = await supabase
      .from("events")
      .update({
        ...data,
        slug,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/event/${slug}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update event" };
  }
}

export async function deleteEventAction(id: string): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function togglePublishAction(
  id: string,
  published: boolean,
): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase
    .from("events")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function getAllEventsAdmin() {
  if (!(await isAuthenticated())) return [];

  const supabase = createSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getEventByIdAdmin(id: string) {
  if (!(await isAuthenticated())) return null;

  const supabase = createSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
