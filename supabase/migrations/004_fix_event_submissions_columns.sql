-- Fix missing columns on event_submissions (safe to re-run)

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
