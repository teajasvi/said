-- ============================================
-- THE WORST SAID — SCHEMA V4: AI MODERATION
-- ============================================
-- Adds columns for Groq AI-powered content moderation.
-- Run this in the Supabase SQL Editor.
-- ============================================

BEGIN;

-- AI marks submissions as sensitive (replaces regex-based contentWarning)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS is_sensitive BOOLEAN DEFAULT FALSE;

-- AI verdict: approve, sensitive, review, reject
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_verdict TEXT DEFAULT NULL;

-- AI's short explanation for the verdict
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_reason TEXT DEFAULT NULL;

COMMIT;
