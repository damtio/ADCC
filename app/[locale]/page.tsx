import type { Metadata } from "next";
import { EventList } from "@/components/EventList";
import { getPublishedEvents } from "@/lib/supabase";
import { publicMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 300;

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return publicMetadata({
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const events = await getPublishedEvents();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {t("upcomingEvents")}
          <span className="ml-2 text-base font-normal text-zinc-500">
            ({events.length})
          </span>
        </h1>
      </div>
      <EventList events={events} />
    </section>
  );
}
