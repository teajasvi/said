-- ============================================
-- THE WORST SAID — SCHEMA V3: SAID BY FIELD
-- ============================================
-- Adds optional 'said_by' column to submissions.
-- Single word, max 20 chars. Nullable (optional).
-- Examples: "parent", "friend", "stranger", "ex"
-- ============================================

BEGIN;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS said_by TEXT DEFAULT NULL;

-- Enforce single-word, max 20 chars, letters/hyphens only
ALTER TABLE submissions
  ADD CONSTRAINT chk_said_by_format
  CHECK (
    said_by IS NULL
    OR (
      char_length(said_by) BETWEEN 1 AND 20
      AND said_by ~ '^[a-zA-Z\-]+$'
    )
  );

COMMIT;
