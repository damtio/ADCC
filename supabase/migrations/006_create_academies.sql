-- Create academies table for BJJ directory in Kraków

CREATE TABLE IF NOT EXISTS academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  image_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academies_published ON academies (published);
CREATE INDEX IF NOT EXISTS idx_academies_sort_order ON academies (sort_order);

ALTER TABLE academies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published academies"
  ON academies
  FOR SELECT
  USING (published = true);

CREATE TRIGGER academies_updated_at
  BEFORE UPDATE ON academies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

INSERT INTO academies (
  name, address, district, phone, email, website, latitude, longitude, sort_order, published
) VALUES
  (
    'Unity Jiu Jitsu Kraków',
    'ul. Wielicka 42A, 30-552',
    'Prokocim',
    '+48 455 448 214',
    NULL,
    'https://unityjiujitsu.pl',
    50.0373359,
    19.9667995,
    1,
    true
  ),
  (
    'Southeast Jiu-Jitsu',
    'ul. Saska 12F/U6, 30-720',
    'Podgórze',
    '+48 502 680 950',
    NULL,
    'https://southeastjiujitsu.pl',
    50.0379639,
    19.9838395,
    2,
    true
  ),
  (
    'MMA Academy Kraków',
    'ul. Tadeusza Romanowicza 19B, 30-702',
    'Zabłocie / Podgórze',
    '+48 798 417 452',
    NULL,
    'https://mmaacademy.pl',
    50.0456356,
    19.962212,
    3,
    true
  ),
  (
    'Grappling Sports Club Kraków',
    'ul. Alfreda Dauna 66, 30-638',
    'Wola Duchacka',
    '+48 790 494 625',
    NULL,
    'https://grapplingkrakow.pl',
    50.022935,
    19.9741333,
    4,
    true
  ),
  (
    'Klub Sportowy Grappling Kraków, Prądnik',
    'ul. Nad Strugą 7, 31-408',
    'Prądnik Czerwony',
    '+48 790 494 625',
    NULL,
    'https://grapplingkrakow.pl',
    50.0897439,
    19.9575589,
    5,
    true
  ),
  (
    'Jiu Jitsu Banzai',
    'ul. Myśliwska 64, 30-718',
    'Płaszów',
    '+48 515 076 547',
    NULL,
    'https://banzai-krakow.pl',
    50.0458726,
    19.9912853,
    6,
    true
  ),
  (
    'Banzai Jiu Jitsu (tymczasowo zamknięta lokalizacja)',
    'ul. Bieżanowska 204, 30-856',
    'Bieżanów',
    '+48 515 076 547',
    NULL,
    'https://banzai-krakow.pl',
    50.0187489,
    20.0234589,
    7,
    true
  ),
  (
    'GOTA Underground',
    'ul. Długa 72, 31-146',
    'Stare Miasto / Kleparz',
    '+48 504 217 007',
    NULL,
    'https://gotaunderground.pl',
    50.0719669,
    19.935722,
    8,
    true
  );

NOTIFY pgrst, 'reload schema';
