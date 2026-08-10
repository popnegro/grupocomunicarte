-- P1.2: normalized MediaKit relations.
-- Non-destructive migration: legacy JSON columns on mediakits remain available
-- until the API/frontend migration is completed.

CREATE TABLE IF NOT EXISTS media_kit_screens (
  media_kit_id TEXT NOT NULL REFERENCES mediakits(id) ON DELETE CASCADE,
  screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (media_kit_id, screen_id)
);

CREATE TABLE IF NOT EXISTS media_kit_comments (
  id TEXT PRIMARY KEY,
  media_kit_id TEXT NOT NULL REFERENCES mediakits(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS media_kit_screens_screen_id_idx
  ON media_kit_screens (screen_id);

CREATE INDEX IF NOT EXISTS media_kit_comments_media_kit_id_idx
  ON media_kit_comments (media_kit_id);
