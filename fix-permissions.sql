-- ============================================
-- THE WORST SAID — FIX PERMISSIONS
-- Run this in the Supabase SQL Editor to fix the
-- "permission denied for table submissions" error.
-- ============================================

BEGIN;

-- 1. Grant table-level permissions to the anonymous role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO service_role;

-- 2. Ensure RLS is enabled
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 3. Ensure the public read policy exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Public can read approved submissions'
  ) THEN
    CREATE POLICY "Public can read approved submissions"
      ON submissions FOR SELECT USING (status = 'approved');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Public can insert submissions'
  ) THEN
    CREATE POLICY "Public can insert submissions"
      ON submissions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

COMMIT;
