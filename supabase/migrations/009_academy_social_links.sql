-- Social links for academies

ALTER TABLE academies
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT;

NOTIFY pgrst, 'reload schema';
