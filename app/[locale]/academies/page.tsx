import type { Metadata } from "next";
import { AcademyList } from "@/components/AcademyList";
import { highlightTag } from "@/lib/i18n-rich";
import { getPublishedAcademies } from "@/lib/supabase";
import { publicMetadata, safeHttpsUrl, safeJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 300;

interface AcademiesPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: AcademiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "academies" });

  return publicMetadata({
    locale,
    path: "/academies",
    title: t("title").replace(/<[^>]+>/g, ""),
    description: t("subtitle"),
  });
}

export default async function AcademiesPage({ params }: AcademiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("academies");
  const academies = await getPublishedAcademies();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": academies.map((academy) => ({
      "@type": "SportsActivityLocation",
      name: academy.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: academy.address,
        addressLocality: academy.city,
        addressCountry: "PL",
      },
      telephone: academy.phone || undefined,
      email: academy.email || undefined,
      url: safeHttpsUrl(academy.website) || undefined,
      sameAs: [
        safeHttpsUrl(academy.facebook_url),
        safeHttpsUrl(academy.instagram_url),
      ].filter(Boolean),
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {t.rich("title", highlightTag)}
        </h1>
        <p className="mt-3 text-zinc-400">{t("subtitle")}</p>
      </div>

      {academies.length === 0 ? (
        <p className="text-center text-zinc-500">{t("empty")}</p>
      ) : (
        <AcademyList academies={academies} />
      )}
    </div>
  );
}
