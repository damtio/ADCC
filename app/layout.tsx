import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { safeJsonLd, SITE_ORIGIN } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wolnamata.pl"),
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${inter.variable} flex min-h-screen flex-col antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "wolnamata.pl",
              url: SITE_ORIGIN,
              inLanguage: ["pl", "en"],
            }),
          }}
        />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
