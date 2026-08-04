"use client";

import { ExternalLink, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Academy } from "@/types/academy";

interface AcademyCardProps {
  academy: Academy;
}

function buildMapsUrl(academy: Academy): string {
  if (academy.latitude != null && academy.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${academy.latitude},${academy.longitude}`;
  }

  const query = [academy.address, academy.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function locationLabel(academy: Academy): string {
  const parts = [academy.address, academy.city].filter(Boolean);
  return parts.join(", ");
}

export function AcademyCard({ academy }: AcademyCardProps) {
  const t = useTranslations("academies");
  const hasMapsTarget =
    (academy.latitude != null && academy.longitude != null) ||
    Boolean(academy.address);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-lg hover:shadow-red-900/10">
      <CardContent className="space-y-4 p-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{academy.specialization}</Badge>
          </div>
          <h3 className="text-lg font-semibold text-white">{academy.name}</h3>
          <p className="text-sm text-zinc-500">
            {[academy.district, academy.city].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="space-y-2 text-sm text-zinc-400">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <span>{locationLabel(academy)}</span>
          </div>
          {academy.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-red-500" />
              <a
                href={`tel:${academy.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-white"
              >
                {academy.phone}
              </a>
            </div>
          )}
          {academy.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-red-500" />
              <a
                href={`mailto:${academy.email}`}
                className="transition-colors hover:text-white"
              >
                {academy.email}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {hasMapsTarget && (
            <Button asChild variant="outline" size="sm">
              <a
                href={buildMapsUrl(academy)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("openInMaps")}
              </a>
            </Button>
          )}
          {academy.website && (
            <Button asChild variant="outline" size="sm">
              <a
                href={academy.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4" />
                {t("website")}
              </a>
            </Button>
          )}
          {academy.facebook_url && (
            <Button asChild variant="outline" size="sm">
              <a
                href={academy.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </Button>
          )}
          {academy.instagram_url && (
            <Button asChild variant="outline" size="sm">
              <a
                href={academy.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
