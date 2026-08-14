import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const privatePageHeaders = [
  { key: "Cache-Control", value: "private, no-cache, no-store, max-age=0" },
  { key: "Netlify-CDN-Cache-Control", value: "no-store" },
];

function supabaseStoragePattern() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value || value.includes("your_supabase")) return [];

  try {
    const url = new URL(value);
    return [
      {
        protocol: "https" as const,
        hostname: url.hostname,
        pathname: "/storage/v1/object/public/event-images/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseStoragePattern(),
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    const supabaseOrigin = (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
      } catch {
        return "";
      }
    })();
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      `img-src 'self' data: blob: ${supabaseOrigin} https://www.google-analytics.com`,
      `connect-src 'self' ${supabaseOrigin} https://www.google-analytics.com https://*.google-analytics.com`,
      "frame-src https://accounts.google.com",
      "upgrade-insecure-requests",
    ]
      .filter((directive) => !directive.includes("  https"))
      .join("; ");
    return [
      {
        source: "/admin/:path*",
        headers: privatePageHeaders,
      },
      {
        source: "/:locale/my-events/:path*",
        headers: privatePageHeaders,
      },
      {
        source: "/:locale/my-academies/:path*",
        headers: privatePageHeaders,
      },
      {
        source: "/:locale/submit-event",
        headers: privatePageHeaders,
      },
      {
        source: "/:locale/login",
        headers: privatePageHeaders,
      },
      {
        source: "/:locale/register",
        headers: privatePageHeaders,
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
