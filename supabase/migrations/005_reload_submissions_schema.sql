-- Ensure all required columns exist on event_submissions

ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS instructor TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS academy TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'PLN';
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE event_submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Reload PostgREST schema cache (fixes "Could not find column in schema cache")
NOTIFY pgrst, 'reload schema';
