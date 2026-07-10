export interface Academy {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  latitude: number;
  longitude: number;
}

export const KRAKOW_ACADEMIES: Academy[] = [
  {
    id: "unity-jiu-jitsu-krakow",
    name: "Unity Jiu Jitsu Kraków",
    address: "ul. Wielicka 42A, 30-552",
    district: "Prokocim",
    phone: "+48 455 448 214",
    email: null,
    website: "https://unityjiujitsu.pl",
    image_url: null,
    latitude: 50.0373359,
    longitude: 19.9667995,
  },
  {
    id: "southeast-jiu-jitsu",
    name: "Southeast Jiu-Jitsu",
    address: "ul. Saska 12F/U6, 30-720",
    district: "Podgórze",
    phone: "+48 502 680 950",
    email: null,
    website: "https://southeastjiujitsu.pl",
    image_url: null,
    latitude: 50.0379639,
    longitude: 19.9838395,
  },
  {
    id: "mma-academy-krakow",
    name: "MMA Academy Kraków",
    address: "ul. Tadeusza Romanowicza 19B, 30-702",
    district: "Zabłocie / Podgórze",
    phone: "+48 798 417 452",
    email: null,
    website: "https://mmaacademy.pl",
    image_url: null,
    latitude: 50.0456356,
    longitude: 19.962212,
  },
  {
    id: "grappling-sports-club-krakow",
    name: "Grappling Sports Club Kraków",
    address: "ul. Alfreda Dauna 66, 30-638",
    district: "Wola Duchacka",
    phone: "+48 790 494 625",
    email: null,
    website: "https://grapplingkrakow.pl",
    image_url: null,
    latitude: 50.022935,
    longitude: 19.9741333,
  },
  {
    id: "grappling-krakow-pradnik",
    name: "Klub Sportowy Grappling Kraków, Prądnik",
    address: "ul. Nad Strugą 7, 31-408",
    district: "Prądnik Czerwony",
    phone: "+48 790 494 625",
    email: null,
    website: "https://grapplingkrakow.pl",
    image_url: null,
    latitude: 50.0897439,
    longitude: 19.9575589,
  },
  {
    id: "jiu-jitsu-banzai",
    name: "Jiu Jitsu Banzai",
    address: "ul. Myśliwska 64, 30-718",
    district: "Płaszów",
    phone: "+48 515 076 547",
    email: null,
    website: "https://banzai-krakow.pl",
    image_url: null,
    latitude: 50.0458726,
    longitude: 19.9912853,
  },
  {
    id: "banzai-jiu-jitsu-biezanow",
    name: "Banzai Jiu Jitsu (tymczasowo zamknięta lokalizacja)",
    address: "ul. Bieżanowska 204, 30-856",
    district: "Bieżanów",
    phone: "+48 515 076 547",
    email: null,
    website: "https://banzai-krakow.pl",
    image_url: null,
    latitude: 50.0187489,
    longitude: 20.0234589,
  },
  {
    id: "gota-underground",
    name: "GOTA Underground",
    address: "ul. Długa 72, 31-146",
    district: "Stare Miasto / Kleparz",
    phone: "+48 504 217 007",
    email: null,
    website: "https://gotaunderground.pl",
    image_url: null,
    latitude: 50.0719669,
    longitude: 19.935722,
  },
];
