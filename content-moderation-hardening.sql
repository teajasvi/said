-- ============================================
-- CONTENT MODERATION HARDENING — SQL MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

BEGIN;

-- ─── 1. Add moderation_flags column ───
-- Stores an array of flag labels from the server-side moderation engine.
-- Examples: ['self-harm-encouragement'], ['violent-threat', 'identity-threat']
-- NULL or empty = no flags detected.
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS moderation_flags TEXT[] DEFAULT NULL;

-- ─── 2. Revoke excessive grants ───
-- Currently anon and authenticated have SELECT, INSERT, UPDATE, DELETE
-- on ALL tables. This is far too permissive.

-- Revoke everything first, then grant back only what's needed.
REVOKE ALL ON TABLE submissions FROM anon, authenticated;
REVOKE ALL ON TABLE banned_users FROM anon, authenticated;
REVOKE ALL ON TABLE stories FROM anon, authenticated;

-- anon: can SELECT (approved only, via RLS) and INSERT (new submissions)
GRANT SELECT, INSERT ON TABLE submissions TO anon;
-- anon: can read published stories
GRANT SELECT ON TABLE stories TO anon;
-- anon: NO access to banned_users (service_role only)

-- authenticated: same as anon for this app (no user accounts)
GRANT SELECT, INSERT ON TABLE submissions TO authenticated;
GRANT SELECT ON TABLE stories TO authenticated;

-- service_role: full access (used by admin API routes, bypasses RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE banned_users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE stories TO service_role;

-- ─── 3. Tighten the INSERT policy ───
-- The current policy is: WITH CHECK (true) — allows inserting ANY values
-- including status='approved' or manipulating approved_at from the client.
-- Replace it with a policy that enforces status='pending'.
DROP POLICY IF EXISTS "Public can insert submissions" ON submissions;
CREATE POLICY "Public can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (status = 'pending');

-- ─── 4. Index for moderation_flags (for admin filtering) ───
CREATE INDEX IF NOT EXISTS idx_submissions_moderation_flags
  ON submissions USING GIN (moderation_flags)
  WHERE moderation_flags IS NOT NULL;

COMMIT;
