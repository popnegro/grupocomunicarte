-- PMV production repair: align the existing Neon screens table with the
-- application schema used by the featured inventory experience.
-- Idempotent by design: safe to run against an already-repaired database.

ALTER TABLE screens
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

ALTER TABLE screens
  ADD COLUMN IF NOT EXISTS featured_order integer;
