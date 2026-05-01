-- ============================================
-- CONTENT MODERATION HARDENING — SQL MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

BEGIN;

-- ─── 1. Add moderation_flags column ───
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS moderation_flags TEXT[] DEFAULT NULL;

-- ─── 2. Revoke ALL existing grants ───
-- Start from a clean slate. This is critical because Supabase's
-- auto-generated REST API exposes ANY column the role can SELECT.
-- A scraper with the anon key could dump the entire submissions table
-- including ip_address, user_uuid, moderation_flags, etc.
REVOKE ALL ON TABLE submissions FROM anon, authenticated;
REVOKE ALL ON TABLE banned_users FROM anon, authenticated;
REVOKE ALL ON TABLE stories FROM anon, authenticated;

-- ─── 3. Column-level grants for submissions ───
-- anon SELECT: ONLY the columns needed for public display.
-- This prevents the Supabase REST API from leaking ip_address,
-- user_uuid, moderation_flags, word_count, country, or status
-- even if someone queries the REST API directly with the anon key.
GRANT SELECT (id, text, tag, created_at) ON TABLE submissions TO anon;
GRANT SELECT (id, text, tag, created_at) ON TABLE submissions TO authenticated;

-- anon INSERT: allow submitting new entries with all needed fields.
-- The INSERT RLS policy enforces status='pending'.
GRANT INSERT (text, tag, status, ip_address, user_uuid, word_count, country, moderation_flags) ON TABLE submissions TO anon;
GRANT INSERT (text, tag, status, ip_address, user_uuid, word_count, country, moderation_flags) ON TABLE submissions TO authenticated;

-- ─── 4. Stories: read-only for public, only safe columns ───
GRANT SELECT (id, title, slug, excerpt, content, meta_description, created_at) ON TABLE stories TO anon;
GRANT SELECT (id, title, slug, excerpt, content, meta_description, created_at) ON TABLE stories TO authenticated;

-- ─── 5. banned_users: NO access for anon/authenticated ───
-- (no GRANT = no access). Only service_role can read/write bans.

-- ─── 6. service_role: full access (admin API routes, bypasses RLS) ───
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE banned_users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE stories TO service_role;

-- ─── 7. Tighten the INSERT RLS policy ───
-- Replace the old WITH CHECK (true) with one that enforces status='pending'.
-- This prevents a client from inserting status='approved' directly.
DROP POLICY IF EXISTS "Public can insert submissions" ON submissions;
CREATE POLICY "Public can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (status = 'pending');

-- ─── 8. Index for moderation_flags (admin filtering) ───
CREATE INDEX IF NOT EXISTS idx_submissions_moderation_flags
  ON submissions USING GIN (moderation_flags)
  WHERE moderation_flags IS NOT NULL;

COMMIT;
