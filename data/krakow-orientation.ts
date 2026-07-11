export interface OrientationBlock {
  type: "paragraph" | "list" | "tip";
  text?: string;
  items?: string[];
}

export interface OrientationSection {
  id: string;
  title: string;
  blocks: OrientationBlock[];
}

export const KRAKOW_ORIENTATION_SECTIONS: OrientationSection[] = [
  {
    id: "overview",
    title: "Overview",
    blocks: [
      {
        type: "paragraph",
        text: "Kraków is compact and visitor-friendly. Most seminars and academies are spread across Podgórze, Kazimierz and districts south of the centre — all reachable by tram, bus or a short taxi ride from the Old Town.",
      },
      {
        type: "paragraph",
        text: "During ADCC weekend, plan extra travel time on Friday evening and Saturday morning. Major venues and training spots are rarely in the strict city centre, so check addresses before you leave.",
      },
      {
        type: "tip",
        text: "Save offline maps and your academy or event address in Google Maps before heading out — mobile signal can be weak in basements and sports halls.",
      },
    ],
  },
  {
    id: "airport",
    title: "From the airport",
    blocks: [
      {
        type: "paragraph",
        text: "John Paul II Kraków-Balice Airport (KRK) is about 12 km west of the city centre. Trains and buses run regularly; taxis and ride apps are available at the terminal.",
      },
      {
        type: "list",
        items: [
          "Train (Koleje Małopolskie): Balice → Kraków Główny, ~20 min, tickets at station or via Jakdojade / MDA.",
          "Bus 208 / 209 / 902: to centre or Dworzec Główny — check current weekend timetable.",
          "Taxi / Bolt / Uber: ~15–25 min to centre, typically 50–80 PLN depending on traffic.",
        ],
      },
      {
        type: "tip",
        text: "Official airport taxis use a fixed zone fare. Avoid unlicensed drivers in the arrivals hall.",
      },
    ],
  },
  {
    id: "public-transport",
    title: "Trams & buses",
    blocks: [
      {
        type: "paragraph",
        text: "MPK Kraków runs trams and buses across the city. Lines 6, 8, 10, 11 and 13 are useful for reaching Podgórze and Kazimierz from the centre.",
      },
      {
        type: "list",
        items: [
          "Use Jakdojade (app or jakdojade.pl) for live routes — it works well in Kraków.",
          "Validate every ticket immediately after boarding (yellow or orange validators).",
          "Night buses (prefix N) run when trams stop, mainly on weekends.",
          "Last tram times vary by line — plan your return if seminars run late.",
        ],
      },
    ],
  },
  {
    id: "tickets",
    title: "Tickets & payment",
    blocks: [
      {
        type: "paragraph",
        text: "Single and short-term tickets cover trams and buses within the city. Buy at machines (card/cash), kiosks, or in the Jakdojade app.",
      },
      {
        type: "list",
        items: [
          "20-min / 40-min / 60-min tickets — choose based on transfers.",
          "24h / 48h / 72h city passes — good value if you ride often.",
          "Reduced fares apply for students with valid ISIC — carry ID.",
          "Inspectors check tickets; fines are high for travelling without one.",
        ],
      },
    ],
  },
  {
    id: "taxis",
    title: "Taxis & ride apps",
    blocks: [
      {
        type: "paragraph",
        text: "Bolt and Uber operate widely. Licensed street taxis (e.g. iTaxi, Radio Taxi) are also reliable if you call or use their apps.",
      },
      {
        type: "list",
        items: [
          "Always confirm the car plate matches the app before getting in.",
          "Cash and card are usually accepted in apps; ask for card if paying a street taxi.",
          "Peak times around Kazimierz and the Main Square can mean surge pricing.",
        ],
      },
      {
        type: "tip",
        text: "For early-morning seminars, pre-book a ride — fewer trams run before 5:00.",
      },
    ],
  },
  {
    id: "districts",
    title: "Key districts",
    blocks: [
      {
        type: "paragraph",
        text: "Most BJJ visitors spend time in these areas. Distances look small on a map but account for hills, one-way streets and tram detours.",
      },
      {
        type: "list",
        items: [
          "Stare Miasto / Kazimierz — hotels, food, evening social scene.",
          "Podgórze & Zabłocie — many academies, creative district, walkable from Kazimierz.",
          "Prokocim / Płaszów / Bieżanów — southern clubs; tram or taxi from centre.",
          "Prądnik Czerwony — north-east; tram lines 4, 14, 15 from centre.",
        ],
      },
    ],
  },
  {
    id: "essentials",
    title: "Essentials",
    blocks: [
      {
        type: "list",
        items: [
          "Emergency: 112 (EU) · Police: 997 · Ambulance: 999",
          "Currency: PLN (złoty) — cards widely accepted; carry some cash for small shops.",
          "Language: English works in gyms and tourist areas; a few Polish phrases help.",
          "Power: Type C/E plugs, 230 V — same as most of continental Europe.",
        ],
      },
      {
        type: "tip",
        text: "See our Academies page for club addresses and maps once you know which area you are training in.",
      },
    ],
  },
];
