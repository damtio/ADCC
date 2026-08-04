-- Allow user-owned academies; add city + specialization (Gi / NoGi / Gi + NoGi)

ALTER TABLE academies
  ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT 'Kraków',
  ADD COLUMN IF NOT EXISTS specialization TEXT NOT NULL DEFAULT 'Gi + NoGi',
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE academies
  ALTER COLUMN district DROP NOT NULL;

ALTER TABLE academies
  ALTER COLUMN district SET DEFAULT '';

UPDATE academies
SET district = COALESCE(district, '')
WHERE district IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'academies_specialization_check'
  ) THEN
    ALTER TABLE academies
      ADD CONSTRAINT academies_specialization_check
      CHECK (specialization IN ('Gi', 'NoGi', 'Gi + NoGi'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_academies_user_id ON academies (user_id);
CREATE INDEX IF NOT EXISTS idx_academies_city ON academies (city);
CREATE INDEX IF NOT EXISTS idx_academies_specialization ON academies (specialization);

CREATE POLICY "Users can read own academies"
  ON academies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own academies"
  ON academies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own academies"
  ON academies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own academies"
  ON academies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
