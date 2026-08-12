import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import {
  hasSupabaseAuthCookie,
  isAuthCallbackPath,
  isLocaleRoot,
  shouldUpdateSession,
} from "./lib/middleware-routes";
import { updateSession } from "./lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // OAuth / email code exchange must own cookie writes on the redirect response.
  if (isAuthCallbackPath(pathname)) {
    return NextResponse.next({ request });
  }

  // Supabase may fall back to Site URL with ?code= on `/` when redirect
  // allow-list is misconfigured — forward only from site/locale roots.
  const code = searchParams.get("code");
  if (code && isLocaleRoot(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.searchParams.set("code", code);

    if (!url.searchParams.get("next")) {
      const locale =
        routing.locales.find(
          (item) => pathname === `/${item}` || pathname === `/${item}/`,
        ) ?? routing.defaultLocale;
      url.searchParams.set("next", `/${locale}/my-events`);
    }

    return NextResponse.redirect(url);
  }

  const hasAuthCookie = hasSupabaseAuthCookie(request.cookies.getAll());
  const needsSession = shouldUpdateSession({ pathname, hasAuthCookie });

  // Admin (and bare /auth/* except callback) stay outside next-intl.
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    const response = NextResponse.next({ request });
    return needsSession ? updateSession(request, response) : response;
  }

  const response = handleI18nRouting(request);
  return needsSession ? updateSession(request, response) : response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
