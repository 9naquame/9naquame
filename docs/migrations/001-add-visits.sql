-- Existing counters only. Run once before deploying dual-count support.
-- New databases should use docs/site-views.sql instead.
ALTER TABLE site_views ADD COLUMN visits INTEGER NOT NULL DEFAULT 0 CHECK (visits >= 0);
