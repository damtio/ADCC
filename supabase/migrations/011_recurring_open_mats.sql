ALTER TABLE events
  ADD COLUMN IF NOT EXISTS recurrence_frequency TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS recurrence_until DATE;

ALTER TABLE event_submissions
  ADD COLUMN IF NOT EXISTS recurrence_frequency TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS recurrence_until DATE;

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_recurrence_check;
ALTER TABLE events ADD CONSTRAINT events_recurrence_check CHECK (
  (recurrence_frequency = 'none' AND recurrence_until IS NULL)
  OR
  (category = 'Open Mat'
    AND recurrence_frequency IN ('weekly', 'biweekly', 'monthly')
    AND recurrence_until > date)
);

ALTER TABLE event_submissions DROP CONSTRAINT IF EXISTS event_submissions_recurrence_check;
ALTER TABLE event_submissions ADD CONSTRAINT event_submissions_recurrence_check CHECK (
  (recurrence_frequency = 'none' AND recurrence_until IS NULL)
  OR
  (category = 'Open Mat'
    AND recurrence_frequency IN ('weekly', 'biweekly', 'monthly')
    AND recurrence_until > date)
);

CREATE INDEX IF NOT EXISTS idx_events_recurrence_until
  ON events (recurrence_until)
  WHERE recurrence_frequency <> 'none';

NOTIFY pgrst, 'reload schema';
