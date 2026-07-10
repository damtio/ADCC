import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ADCC 2026 Kraków - Seminars and Events",
    template: "%s | ADCC 2026 Kraków - Seminars and Events",
  },
  description:
    "Find seminars, open mats and camps happening during ADCC weekend in Poland.",
  openGraph: {
    title: "ADCC 2026 Kraków - Seminars and Events",
    description:
      "Find seminars, open mats and camps happening during ADCC weekend in Poland.",
    type: "website",
    locale: "en_US",
    siteName: "ADCC 2026 Kraków - Seminars and Events",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADCC 2026 Kraków - Seminars and Events",
    description:
      "Find seminars, open mats and camps happening during ADCC weekend in Poland.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} flex min-h-screen flex-col antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
