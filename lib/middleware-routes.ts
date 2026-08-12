import { routing } from "@/i18n/routing";

export type MiddlewareRouteClass =
  "callback" | "protected" | "public-auth-aware" | "public";

/** Paths that must never call updateSession (OAuth code exchange owns cookies). */
export function isAuthCallbackPath(pathname: string): boolean {
  return (
    pathname === "/auth/callback" || pathname.startsWith("/auth/callback/")
  );
}

export function isLocaleRoot(pathname: string): boolean {
  return (
    pathname === "/" ||
    routing.locales.some(
      (locale) => pathname === `/${locale}` || pathname === `/${locale}/`,
    )
  );
}

/** Strip /pl or /en prefix; root becomes "/". */
export function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      return "/";
    }
    const prefix = `/${locale}/`;
    if (pathname.startsWith(prefix)) {
      return `/${pathname.slice(prefix.length)}`;
    }
  }
  return pathname;
}

/**
 * Supabase SSR stores the session in cookies named like:
 * `sb-<ref>-auth-token` (and optional chunk suffixes `.0`, `.1`, …).
 */
export function hasSupabaseAuthCookie(
  cookies: { name: string }[] | Iterable<{ name: string }>,
): boolean {
  for (const cookie of cookies) {
    const name = cookie.name;
    if (name.startsWith("sb-") && name.includes("auth-token")) {
      return true;
    }
  }
  return false;
}

export function classifyMiddlewareRoute(
  pathname: string,
): MiddlewareRouteClass {
  if (isAuthCallbackPath(pathname)) return "callback";

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return "protected";
  }

  const path = stripLocalePrefix(pathname);

  if (
    path.startsWith("/my-events") ||
    path.startsWith("/my-academies") ||
    path === "/login" ||
    path.startsWith("/login/") ||
    path === "/register" ||
    path.startsWith("/register/")
  ) {
    return "public-auth-aware";
  }

  return "public";
}

/**
 * Whether middleware should refresh the Supabase session for this request.
 * Anonymous public traffic skips Auth entirely.
 */
export function shouldUpdateSession(options: {
  pathname: string;
  hasAuthCookie: boolean;
}): boolean {
  const routeClass = classifyMiddlewareRoute(options.pathname);

  if (routeClass === "callback") return false;
  if (routeClass === "protected") return true;
  if (routeClass === "public-auth-aware") return true;
  // public
  return options.hasAuthCookie;
}
