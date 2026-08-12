-- Restrict event image writes to owner-prefixed WebP objects.
-- Existing root-level objects remain publicly readable.

UPDATE storage.buckets
SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/webp']
WHERE id = 'event-images';

DROP POLICY IF EXISTS "Authenticated users can upload event images"
  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own event images"
  ON storage.objects;
DROP POLICY IF EXISTS "Users upload own event images"
  ON storage.objects;
DROP POLICY IF EXISTS "Users update own event images"
  ON storage.objects;
DROP POLICY IF EXISTS "Users delete own event images"
  ON storage.objects;

CREATE POLICY "Users upload own event images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'event-images'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND lower(storage.extension(name)) = 'webp'
  );

CREATE POLICY "Users update own event images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'event-images'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'event-images'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND lower(storage.extension(name)) = 'webp'
  );

CREATE POLICY "Users delete own event images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'event-images'
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
