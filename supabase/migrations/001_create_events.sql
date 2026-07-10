-- Create events table for BJJ Around ADCC Poland

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  organizer TEXT,
  academy TEXT,
  city TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  price NUMERIC,
  currency TEXT DEFAULT 'PLN',
  registration_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_events_published ON events (published);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public read access for published events
CREATE POLICY "Public can read published events"
  ON events
  FOR SELECT
  USING (published = true);

-- Service role bypasses RLS automatically

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
