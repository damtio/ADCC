import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";

interface GoogleCalendarButtonProps {
  event: Event;
  label: string;
}

function buildGoogleCalendarUrl(event: Event): string {
  const startDate = event.date.replace(/-/g, "");
  const startTime = event.start_time
    ? event.start_time.replace(/:/g, "") + "00"
    : "090000";
  const endTime = event.end_time
    ? event.end_time.replace(/:/g, "") + "00"
    : "170000";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startDate}T${startTime}/${startDate}T${endTime}`,
    details: event.description || "",
    location: [event.address, event.city].filter(Boolean).join(", "),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function GoogleCalendarButton({
  event,
  label,
}: GoogleCalendarButtonProps) {
  return (
    <Button asChild variant="outline" size="sm">
      <a
        href={buildGoogleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CalendarPlus className="h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
