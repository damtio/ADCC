import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
};

export default withNextIntl(nextConfig);
