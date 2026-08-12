export type EventFilterState = {
  search: string;
  category: string;
  city: string;
  date: string;
};

export const EMPTY_EVENT_FILTERS: EventFilterState = {
  search: "",
  category: "",
  city: "",
  date: "",
};

type FilterOptions = {
  categories: readonly string[];
  cities: readonly string[];
  dates: readonly string[];
};

function allowed(value: string | null, options: readonly string[]): string {
  return value && options.includes(value) ? value : "";
}

export function parseEventFilterParams(
  search: string,
  options: FilterOptions,
): EventFilterState {
  const params = new URLSearchParams(search);
  return {
    search: (params.get("q") ?? "").trim().slice(0, 100),
    category: allowed(params.get("category"), options.categories),
    city: allowed(params.get("city"), options.cities),
    date: allowed(params.get("date"), options.dates),
  };
}

export function serializeEventFilterParams(
  filters: EventFilterState,
  currentSearch = "",
): string {
  const params = new URLSearchParams(currentSearch);
  const entries = {
    q: filters.search.trim(),
    category: filters.category === "all" ? "" : filters.category,
    city: filters.city === "all" ? "" : filters.city,
    date: filters.date === "all" ? "" : filters.date,
  };

  for (const [key, value] of Object.entries(entries)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }

  const output = params.toString();
  return output ? `?${output}` : "";
}

export function hasActiveEventFilters(filters: EventFilterState): boolean {
  return Object.values(filters).some((value) => value && value !== "all");
}
