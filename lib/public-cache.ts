import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, publicLocalePaths } from "@/lib/public-cache-config";

export {
  ACADEMY_LIST_COLUMNS,
  CACHE_TAGS,
  EVENT_DETAIL_COLUMNS,
  EVENT_LIST_COLUMNS,
  PUBLIC_REVALIDATE,
  publicLocalePaths,
} from "@/lib/public-cache-config";

type RevalidatePublicOptions = {
  eventSlug?: string | null;
  events?: boolean;
  academies?: boolean;
  /** Also revalidate admin dashboards that list content. */
  admin?: boolean;
};

/**
 * Invalidate ISR/data cache for both locales after mutations.
 * Prefer tags; also revalidate paths because Netlify/next-intl may key by locale path.
 */
export function revalidatePublicContent(
  options: RevalidatePublicOptions = {},
): void {
  const {
    eventSlug,
    events = true,
    academies = false,
    admin = false,
  } = options;

  if (events) {
    revalidateTag(CACHE_TAGS.events);
    for (const path of publicLocalePaths("/")) {
      revalidatePath(path);
    }
  }

  if (academies) {
    revalidateTag(CACHE_TAGS.academies);
    for (const path of publicLocalePaths("/academies")) {
      revalidatePath(path);
    }
  }

  if (eventSlug) {
    revalidateTag(CACHE_TAGS.event(eventSlug));
    for (const path of publicLocalePaths(`/event/${eventSlug}`)) {
      revalidatePath(path);
    }
  }

  if (admin) {
    revalidatePath("/admin");
    revalidatePath("/admin/academies");
    revalidatePath("/admin/submissions");
  }
}
