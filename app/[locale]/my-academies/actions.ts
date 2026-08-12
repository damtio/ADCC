"use server";

import { revalidatePath } from "next/cache";
import { parseAcademyFormData } from "@/lib/academy-form";
import { revalidatePublicContent } from "@/lib/public-cache";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { getAuthUser } from "@/lib/supabase/server";
import { parseUuid } from "@/lib/event-form";
import type { Academy } from "@/types/academy";

export async function createUserAcademyAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const data = parseAcademyFormData(formData);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    const { error } = await supabase.from("academies").insert({
      ...data,
      sort_order: 0,
      user_id: user.id,
    });

    if (error) return { error: "Unable to create the academy." };

    revalidatePublicContent({ events: false, academies: true });
    revalidatePath("/my-academies", "layout");
    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to create academy",
    };
  }
}

export async function updateUserAcademyAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const id = parseUuid(formData.get("id"));
    const parsed = parseAcademyFormData(formData);
    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return { error: "Supabase is not configured." };
    }

    const { data: updated, error } = await supabase
      .from("academies")
      .update({
        name: parsed.name,
        address: parsed.address,
        city: parsed.city,
        district: parsed.district,
        specialization: parsed.specialization,
        phone: parsed.phone,
        email: parsed.email,
        website: parsed.website,
        facebook_url: parsed.facebook_url,
        instagram_url: parsed.instagram_url,
        image_url: parsed.image_url,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        published: parsed.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) return { error: "Unable to update the academy." };
    if (!updated) return { error: "Academy not found" };

    revalidatePublicContent({ events: false, academies: true });
    revalidatePath("/my-academies", "layout");
    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to update academy",
    };
  }
}

export async function deleteUserAcademyAction(id: string): Promise<void> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  id = parseUuid(id);
  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("academies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Unable to delete the academy");

  revalidatePublicContent({ events: false, academies: true });
  revalidatePath("/my-academies", "layout");
}

export async function toggleUserAcademyPublishAction(
  id: string,
  published: boolean,
): Promise<void> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");

  id = parseUuid(id);
  const supabase = createSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase
    .from("academies")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error("Unable to change academy visibility");

  revalidatePublicContent({ events: false, academies: true });
  revalidatePath("/my-academies", "layout");
}

export async function getUserAcademies(): Promise<Academy[]> {
  const user = await getAuthUser();
  if (!user) return [];

  const supabase = createSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as Academy[]) ?? [];
}

export async function getUserAcademyById(id: string): Promise<Academy | null> {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = createSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as Academy;
}
