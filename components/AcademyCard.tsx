import { ExternalLink, Globe, Mail, MapPin, Phone } from "lucide-react";
import { MapPreview } from "@/components/MapPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Academy } from "@/data/academies";

interface AcademyCardProps {
  academy: Academy;
}

function buildMapsUrl(academy: Academy): string {
  return `https://www.google.com/maps/search/?api=1&query=${academy.latitude},${academy.longitude}`;
}

export function AcademyCard({ academy }: AcademyCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-lg hover:shadow-red-900/10">
      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{academy.name}</h3>
          <p className="text-sm text-zinc-500">{academy.district}</p>
        </div>

        <div className="space-y-2 text-sm text-zinc-400">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <span>{academy.address}, Kraków</span>
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
          {academy.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-red-500" />
              <a
                href={academy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate transition-colors hover:text-white"
              >
                {academy.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        <MapPreview
          latitude={academy.latitude}
          longitude={academy.longitude}
          title={academy.name}
        />

        <Button asChild variant="outline" size="sm" className="w-full">
          <a
            href={buildMapsUrl(academy)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Maps
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
