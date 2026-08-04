import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { isSupabasePublicConfigured } from "@/lib/supabase";

function safeNextPath(next: string | null, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}

function localeFromPath(path: string): string {
  const match = path.match(/^\/(pl|en)(?:\/|$)/);
  return match?.[1] ?? routing.defaultLocale;
}

function redirectUrl(request: NextRequest, path: string): URL {
  const url = new URL(path, request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";

  if (!isLocal && forwardedHost) {
    url.protocol = "https:";
    url.host = forwardedHost;
  }

  return url;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(
    searchParams.get("next"),
    `/${routing.defaultLocale}/my-events`,
  );
  const loginPath = `/${localeFromPath(next)}/login`;

  if (!code || !isSupabasePublicConfigured()) {
    return NextResponse.redirect(
      redirectUrl(request, `${loginPath}?error=auth`),
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  let successRedirect = NextResponse.redirect(redirectUrl(request, next));

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        successRedirect = NextResponse.redirect(redirectUrl(request, next));
        cookiesToSet.forEach(({ name, value, options }) => {
          successRedirect.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    return successRedirect;
  }

  return NextResponse.redirect(redirectUrl(request, `${loginPath}?error=auth`));
}
