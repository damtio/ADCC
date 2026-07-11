import { Countdown } from "@/components/Countdown";
import { EventList } from "@/components/EventList";
import { highlightTag } from "@/lib/i18n-rich";
import { getPublishedEvents } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const t = await getTranslations("home");
  const events = await getPublishedEvents();

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#2B2B2B]">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.rich("title", highlightTag)}
            </h1>
            <p className="mt-4 text-lg text-zinc-400 sm:text-xl">
              {t("subtitle")}
            </p>
            <div className="mt-8">
              <p className="mb-4 text-sm tracking-widest text-zinc-500 uppercase">
                {t("countdownLabel")}
              </p>
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {t("upcomingEvents")}
            <span className="ml-2 text-base font-normal text-zinc-500">
              ({events.length})
            </span>
          </h2>
        </div>
        <EventList events={events} />
      </section>
    </>
  );
}
