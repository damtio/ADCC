import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

function isLocaleRoot(pathname: string): boolean {
  return (
    pathname === "/" ||
    routing.locales.some(
      (locale) => pathname === `/${locale}` || pathname === `/${locale}/`,
    )
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Do not refresh the session on the OAuth callback — exchanging the
  // auth code must own cookie writes on the redirect response.
  if (pathname.startsWith("/auth/callback")) {
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

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return updateSession(request, NextResponse.next({ request }));
  }

  const response = handleI18nRouting(request);
  return updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
