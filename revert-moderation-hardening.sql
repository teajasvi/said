-- ============================================
-- THE WORST SAID — SAFE RE-RUN (idempotent)
-- Creates anything missing, skips what exists
-- Will NOT delete or modify existing data
-- ============================================

begin;

-- ============================================
-- 1. TABLES (IF NOT EXISTS = safe to re-run)
-- ============================================

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  tag TEXT NOT NULL CHECK (tag IN ('i_said_it', 'said_to_me')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address TEXT,
  user_uuid TEXT NOT NULL,
  word_count INTEGER NOT NULL CHECK (word_count >= 1 AND word_count <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Country column (added later, safe to re-run)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'XX';

CREATE TABLE IF NOT EXISTS banned_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_uuid TEXT,
  reason TEXT,
  banned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Undo FORCE RLS if ChatGPT set it
ALTER TABLE submissions NO FORCE ROW LEVEL SECURITY;
ALTER TABLE banned_users NO FORCE ROW LEVEL SECURITY;

-- ============================================
-- 3. RLS POLICIES (create only if missing)
-- ============================================

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

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stories' AND policyname = 'Public can read published stories'
  ) THEN
    CREATE POLICY "Public can read published stories"
      ON stories FOR SELECT USING (published = true);
  END IF;
END $$;

-- ============================================
-- 4. INDEXES (IF NOT EXISTS = safe to re-run)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);
CREATE INDEX IF NOT EXISTS idx_submissions_approved ON submissions (status, approved_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_submissions_tag ON submissions (tag) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_banned_ip ON banned_users (ip_address);
CREATE INDEX IF NOT EXISTS idx_banned_uuid ON banned_users (user_uuid);
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories (slug) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_stories_published ON stories (published, created_at DESC);

-- ============================================
-- 5. PERMISSIONS (restore defaults)
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE banned_users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE stories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE submissions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE banned_users TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE stories TO service_role;

commit;
