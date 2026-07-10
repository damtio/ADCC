-- Event submissions table for public proposals

CREATE TABLE IF NOT EXISTS event_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  academy TEXT,
  city TEXT,
  address TEXT,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  price NUMERIC,
  currency TEXT DEFAULT 'PLN',
  registration_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  image_url TEXT,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON event_submissions (status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON event_submissions (created_at);

ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- No public policies — all access via service role in Server Actions
