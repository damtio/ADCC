export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/GiJAP6wLuxgHP371O21JuZ";

export const WHATSAPP_POPUP_STORAGE_KEY = "adcc-whatsapp-popup-dismissed";
export const WHATSAPP_POPUP_DELAY_MS = 25_000;
export const WHATSAPP_POPUP_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

const EXCLUDED_PATHS = ["/login", "/register", "/my-events", "/my-academies"];

export function isWhatsAppPopupExcludedPath(pathname: string): boolean {
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return true;
  }

  const path = pathname.replace(/^\/(pl|en)(?=\/|$)/, "") || "/";
  return EXCLUDED_PATHS.some(
    (excluded) => path === excluded || path.startsWith(`${excluded}/`),
  );
}

export function isWhatsAppPopupCoolingDown(
  storedValue: string | null,
  now = Date.now(),
): boolean {
  if (!storedValue) return false;
  if (storedValue === "1") return true;

  const dismissedAt = Number(storedValue);
  return (
    Number.isFinite(dismissedAt) &&
    dismissedAt > 0 &&
    now - dismissedAt < WHATSAPP_POPUP_COOLDOWN_MS
  );
}

export function reachedWhatsAppScrollThreshold(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
): boolean {
  if (documentHeight <= 0) return false;
  return (scrollY + viewportHeight) / documentHeight >= 0.5;
}
