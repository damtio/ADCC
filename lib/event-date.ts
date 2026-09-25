/** ISO calendar date in the event site's timezone, independent of server timezone. */
export function warsawToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((value) => value.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function upcomingEventsCondition(today: string): string {
  return `date.gte.${today},end_date.gte.${today}`;
}
