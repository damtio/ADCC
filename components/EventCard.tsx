"use client";

import { Calendar, Clock, MapPin, User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Event } from "@/types/event";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations("events");

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-lg hover:shadow-red-900/10">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <span className="text-4xl font-bold text-red-600/30">BJJ</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge>{event.category}</Badge>
        </div>
      </div>

      <CardContent className="space-y-3 p-5">
        <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-white">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-zinc-400">
          {event.instructor && (
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <span className="truncate">{event.instructor}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <span>
                {formatTime(event.start_time)}
                {event.end_time && ` – ${formatTime(event.end_time)}`}
              </span>
            </div>
          )}
          {event.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <span className="truncate">
                {event.city}
                {event.academy && ` · ${event.academy}`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-red-400">
            {formatPrice(event.price, event.currency)}
          </span>
          <Button asChild size="sm" variant="outline">
            <Link href={`/event/${event.slug}`}>{t("details")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
