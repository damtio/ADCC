export interface Academy {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string;
  latitude: number;
  longitude: number;
}

export const KRAKOW_ACADEMIES: Academy[] = [
  {
    id: "gracie-barra-krakow",
    name: "Gracie Barra Kraków",
    address: "ul. Pilotów 28",
    district: "Prądnik Biały",
    phone: "+48 123 456 789",
    email: "kontakt@graciebarra-krakow.pl",
    website: "https://graciebarra.com",
    image_url:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    latitude: 50.0897,
    longitude: 19.9369,
  },
  {
    id: "alliance-krakow",
    name: "Alliance Jiu-Jitsu Kraków",
    address: "ul. Wadowicka 8A",
    district: "Bieżanów-Prokocim",
    phone: "+48 987 654 321",
    email: "info@alliance-krakow.pl",
    website: "https://allianceteam.com",
    image_url:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80",
    latitude: 50.0312,
    longitude: 19.9584,
  },
  {
    id: "checkmat-krakow",
    name: "Checkmat BJJ Kraków",
    address: "ul. Bosaków 5",
    district: "Czyżyny",
    phone: "+48 555 123 456",
    email: null,
    website: "https://checkmat.com",
    image_url:
      "https://images.unsplash.com/photo-1517438476312-10d79c077f92?w=800&q=80",
    latitude: 50.0814,
    longitude: 20.0128,
  },
  {
    id: "roxana-gym",
    name: "Roxana Gym",
    address: "ul. Przemysłowa 12",
    district: "Podgórze",
    phone: "+48 600 111 222",
    email: "biuro@roxanagym.pl",
    website: "https://roxanagym.pl",
    image_url:
      "https://images.unsplash.com/photo-1571019614242-c5c25dee9f4d?w=800&q=80",
    latitude: 50.0456,
    longitude: 19.9623,
  },
  {
    id: "bjj-team-krakow",
    name: "BJJ Team Kraków",
    address: "ul. Karmelicka 52",
    district: "Krowodrza",
    phone: "+48 512 345 678",
    email: "hello@bjjteam-krakow.pl",
    website: null,
    image_url:
      "https://images.unsplash.com/photo-1549719386-69c4914c3241?w=800&q=80",
    latitude: 50.0647,
    longitude: 19.9239,
  },
  {
    id: "art-of-fight",
    name: "Art of Fight Academy",
    address: "ul. Na Zjeździe 11",
    district: "Podgórze",
    phone: "+48 789 000 111",
    email: "kontakt@artoffight.pl",
    website: "https://artoffight.pl",
    image_url:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    latitude: 50.0389,
    longitude: 19.9541,
  },
];
