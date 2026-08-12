"use client";

import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { SafeImage } from "@/components/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { buildEventMapsUrl, hasEventMapsTarget } from "@/lib/event-links";
import { formatDateRange, formatPrice, formatTime } from "@/lib/utils";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations("events");
  const tPage = useTranslations("eventPage");
  const hasMapsTarget = hasEventMapsTarget(event);

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

        <div className="flex flex-wrap gap-2">
          {hasMapsTarget && (
            <Button asChild variant="outline" size="sm">
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
          {event.registration_url && (
            <Button asChild variant="outline" size="sm">
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {tPage("register")}
              </a>
            </Button>
          )}
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
          <Button asChild variant="outline" size="sm">
            <Link href={`/event/${event.slug}`}>{t("details")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
