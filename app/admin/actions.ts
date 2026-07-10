"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import { parseEventFormData } from "@/lib/event-form";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { uploadEventImage } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { EventSubmission } from "@/types/submission";

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

export async function getPendingSubmissionsCount(): Promise<number> {
  if (!(await isAuthenticated())) return 0;

  const supabase = createSupabaseAdmin();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("event_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) return 0;
  return count ?? 0;
}

export async function getAllSubmissionsAdmin(): Promise<EventSubmission[]> {
  if (!(await isAuthenticated())) return [];

  const supabase = createSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("event_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as EventSubmission[]) ?? [];
}

export async function approveSubmissionAction(id: string): Promise<void> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");

  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: submission, error } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("id", id)
    .eq("status", "pending")
    .single();

  if (error || !submission) throw new Error("Submission not found");

  let slug = slugify(submission.title);
  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) slug = `${slug}-${id.slice(0, 8)}`;

  const { error: insertError } = await supabase.from("events").insert({
    title: submission.title,
    slug,
    category: submission.category,
    description: submission.description,
    instructor: submission.instructor,
    academy: submission.academy,
    city: submission.city,
    address: submission.address,
    date: submission.date,
    start_time: submission.start_time,
    end_time: submission.end_time,
    price: submission.price,
    currency: submission.currency,
    registration_url: submission.registration_url,
    facebook_url: submission.facebook_url,
    instagram_url: submission.instagram_url,
    image_url: submission.image_url,
    published: false,
  });

  if (insertError) throw new Error(insertError.message);

  const { error: updateError } = await supabase
    .from("event_submissions")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
}

export async function rejectSubmissionAction(id: string): Promise<void> {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");

  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("event_submissions")
    .update({ status: "rejected" })
    .eq("id", id)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/submissions");
}
