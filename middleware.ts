import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Supabase may fall back to Site URL with ?code= on `/` when redirect
  // allow-list is misconfigured — forward to the auth callback route.
  const code = searchParams.get("code");
  if (code && !pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    url.searchParams.set("code", code);
    if (!url.searchParams.get("next")) {
      url.searchParams.set("next", "/en/my-events");
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
