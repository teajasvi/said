-- ============================================
-- THE WORST SAID — SCHEMA V2 MIGRATION
-- ============================================
-- Changes:
--   1. Drop stories table (no longer used)
--   2. Update submissions.tag default to 'said_to_me'
--      (existing 'i_said_it' rows are left as-is)
--   3. Drop stories-related RLS policies and indexes
-- ============================================

BEGIN;

-- ── Drop Stories ──

-- Drop RLS policies on stories
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stories' AND policyname = 'Public can read published stories'
  ) THEN
    DROP POLICY "Public can read published stories" ON stories;
  END IF;
END $$;

-- Drop stories indexes
DROP INDEX IF EXISTS idx_stories_slug;
DROP INDEX IF EXISTS idx_stories_published;

-- Drop stories table
DROP TABLE IF EXISTS stories;

-- ── Update Submissions ──

-- Set default tag to 'said_to_me' (the only tag going forward)
ALTER TABLE submissions ALTER COLUMN tag SET DEFAULT 'said_to_me';

-- Drop the old tag filter index (was for approved + tag filtering)
DROP INDEX IF EXISTS idx_submissions_tag;

COMMIT;
