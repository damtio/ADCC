import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  User,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { GoogleCalendarButton } from "@/components/GoogleCalendarButton";
import { MapPreview } from "@/components/MapPreview";
import { ShareButton } from "@/components/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getEventBySlug } from "@/lib/supabase";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface EventPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  const t = await getTranslations("eventPage");

  if (!event) {
    return { title: t("notFound") };
  }

  return {
    title: event.title,
    description: event.description || `${event.title} - ${event.category}`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      images: event.image_url ? [{ url: event.image_url }] : undefined,
      type: "website",
    },
  };
}

function buildMapsUrl(event: {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
}): string {
  if (event.latitude && event.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
  }
  const query = [event.address, event.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug);
  const t = await getTranslations("eventPage");

  if (!event) notFound();

  const siteUrl = process.env.URL || "https://bjj-around-adcc.netlify.app";
  const eventUrl = `${siteUrl}/${locale}/event/${event.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.start_time
      ? `${event.date}T${event.start_time}`
      : event.date,
    endDate: event.end_time ? `${event.date}T${event.end_time}` : undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.academy || event.city,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address,
        addressLocality: event.city,
        addressCountry: "PL",
      },
    },
    image: event.image_url,
    offers: event.price
      ? {
          "@type": "Offer",
          price: event.price,
          priceCurrency: event.currency || "PLN",
          url: event.registration_url,
        }
      : undefined,
    performer: event.instructor
      ? { "@type": "Person", name: event.instructor }
      : undefined,
    organizer: event.organizer
      ? { "@type": "Organization", name: event.organizer }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
        >
          &larr; {t("backToEvents")}
        </Link>

        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl border border-[#2B2B2B] bg-[#151515]">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl font-bold text-red-600/20">BJJ</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-3">{event.category}</Badge>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {event.title}
            </h1>
          </div>

          <div className="grid gap-4 rounded-xl border border-[#2B2B2B] bg-[#151515] p-6 sm:grid-cols-2">
            {event.instructor && (
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs tracking-wider text-zinc-500 uppercase">
                    {t("instructor")}
                  </p>
                  <p className="text-white">{event.instructor}</p>
                </div>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs tracking-wider text-zinc-500 uppercase">
                    {t("organizer")}
                  </p>
                  <p className="text-white">{event.organizer}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-xs tracking-wider text-zinc-500 uppercase">
                  {t("date")}
                </p>
                <p className="text-white">{formatDate(event.date)}</p>
              </div>
            </div>
            {event.start_time && (
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs tracking-wider text-zinc-500 uppercase">
                    {t("time")}
                  </p>
                  <p className="text-white">
                    {formatTime(event.start_time)}
                    {event.end_time && ` – ${formatTime(event.end_time)}`}
                  </p>
                </div>
              </div>
            )}
            {(event.address || event.city) && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs tracking-wider text-zinc-500 uppercase">
                    {t("location")}
                  </p>
                  <p className="text-white">
                    {[event.academy, event.address, event.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 shrink-0 text-center text-sm font-bold text-red-500">
                zł
              </div>
              <div>
                <p className="text-xs tracking-wider text-zinc-500 uppercase">
                  {t("price")}
                </p>
                <p className="text-lg font-semibold text-red-400">
                  {formatPrice(event.price, event.currency)}
                </p>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white">{t("about")}</h2>
              <p className="whitespace-pre-wrap text-zinc-300">
                {event.description}
              </p>
            </div>
          )}

          {event.latitude && event.longitude && (
            <MapPreview
              latitude={event.latitude}
              longitude={event.longitude}
              title={event.title}
            />
          )}

          <div className="flex flex-wrap gap-3">
            {event.registration_url && (
              <Button asChild>
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t("register")}
                </a>
              </Button>
            )}
            <Button asChild variant="outline">
              <a
                href={buildMapsUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" />
                {t("openInMaps")}
              </a>
            </Button>
            <GoogleCalendarButton event={event} label={t("addToCalendar")} />
            <ShareButton
              title={event.title}
              url={eventUrl}
              label={t("share")}
            />
            {event.facebook_url && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={event.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </Button>
            )}
            {event.instagram_url && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={event.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </Button>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
