-- Multi-day events: optional end date (NULL = single-day)

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS end_date DATE;

ALTER TABLE event_submissions
  ADD COLUMN IF NOT EXISTS end_date DATE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'events_end_date_check'
  ) THEN
    ALTER TABLE events
      ADD CONSTRAINT events_end_date_check
      CHECK (end_date IS NULL OR end_date >= date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_submissions_end_date_check'
  ) THEN
    ALTER TABLE event_submissions
      ADD CONSTRAINT event_submissions_end_date_check
      CHECK (end_date IS NULL OR end_date >= date);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_events_end_date ON events (end_date);

NOTIFY pgrst, 'reload schema';
