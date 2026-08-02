-- Allow authenticated users to own and manage their events

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events (user_id);

-- Owners can read their own events (including drafts)
CREATE POLICY "Users can read own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can upload event images (admin/service role still bypasses)
CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can update own event images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-images')
  WITH CHECK (bucket_id = 'event-images');
