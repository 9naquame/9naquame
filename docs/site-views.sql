CREATE TABLE IF NOT EXISTS site_views (
  key TEXT PRIMARY KEY CHECK (key = 'portfolio'),
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  visits INTEGER NOT NULL DEFAULT 0 CHECK (visits >= 0)
);
