"use client";

import { Calendar, Clock, Instagram, MapPin, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { buildEventMapsUrl, hasEventMapsTarget } from "@/lib/event-links";
import { safeHttpsUrl } from "@/lib/seo";
import { formatDateRange, formatPrice, formatTime } from "@/lib/utils";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations("events");
  const tPage = useTranslations("eventPage");
  const hasMapsTarget = hasEventMapsTarget(event);
  const registrationUrl = safeHttpsUrl(event.registration_url);
  const facebookUrl = safeHttpsUrl(event.facebook_url);
  const instagramUrl = safeHttpsUrl(event.instagram_url);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-lg hover:shadow-red-900/10">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
        <Link
          href={`/event/${event.slug}`}
          className="absolute inset-0 z-10 hidden md:block"
          aria-label={event.title}
        />
        {event.image_url ? (
          <SafeImage
            src={event.image_url}
            alt={event.title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <span className="text-4xl font-bold text-red-600/30">BJJ</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <Badge>{event.category}</Badge>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-white">
            {event.title}
          </h3>
          {(event.organizer || event.academy) && (
            <p className="mt-1 text-sm text-zinc-500">
              {event.organizer || event.academy}
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-red-500" />
            <span>{formatDateRange(event.date, event.end_date)}</span>
          </div>
          {event.recurrence_frequency !== "none" && event.recurrence_until && (
            <p className="pl-6 text-xs font-medium text-red-400">
              {t(`recurrence_${event.recurrence_frequency}`, {
                until: formatDateRange(event.recurrence_until, null),
              })}
            </p>
          )}
          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-red-500" />
              <span>
                {formatTime(event.start_time)}
                {event.end_time && ` – ${formatTime(event.end_time)}`}
              </span>
            </div>
          )}
          {event.city && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span>
                {[event.address, event.city].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm font-semibold text-red-400">
          {formatPrice(event.price, event.currency)}
        </p>

        <div className="space-y-3 border-t border-white/10 pt-4">
          <Button asChild className="w-full" size="sm">
            <Link href={`/event/${event.slug}`}>{t("details")}</Link>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            {hasMapsTarget && (
              <Button asChild variant="outline" size="sm" className="w-full">
                <a
                  href={buildEventMapsUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4" />
                  {tPage("openInMaps")}
                </a>
              </Button>
            )}
            {registrationUrl && (
              <Button asChild variant="outline" size="sm" className="w-full">
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Ticket className="h-4 w-4 shrink-0" />
                  {tPage("register")}
                </a>
              </Button>
            )}
            {facebookUrl && (
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  Facebook
                </a>
              </Button>
            )}
            {instagramUrl && (
              <Button asChild variant="outline" size="sm" className="w-full">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4 shrink-0" />
                  Instagram
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
