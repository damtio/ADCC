import type { createSupabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/utils";

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdmin>>;

export async function resolveUniqueEventSlug(
  supabase: AdminClient,
  title: string,
  excludeEventId?: string,
): Promise<string> {
  const base = slugify(title) || "event";
  let slug = base;
  let suffix = 0;

  while (suffix < 20) {
    const { data: existing } = await supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing || existing.id === excludeEventId) {
      return slug;
    }

    suffix += 1;
    slug =
      suffix === 1 && excludeEventId
        ? `${base}-${excludeEventId.slice(0, 8)}`
        : `${base}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}
