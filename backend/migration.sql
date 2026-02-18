-- ============================================
-- MIGRATION SCRIPT: Upgrade Existing Database
-- Run this FIRST if you already have pageviews/events tables
-- ============================================

-- Step 1: Add new columns to pageviews table
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS browser_name TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS browser_version TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS os_name TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS os_version TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT false;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS page_load_time INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS ttfb INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS fcp INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS lcp INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS scroll_depth INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS time_on_page INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS visitor_id TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS is_new_visitor BOOLEAN DEFAULT true;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS is_entry BOOLEAN DEFAULT false;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS is_exit BOOLEAN DEFAULT false;

-- Step 2: Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER DEFAULT 0,
  pageview_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,
  is_bounce BOOLEAN DEFAULT true,
  entry_page TEXT,
  exit_page TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser_name TEXT,
  os_name TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create new indexes
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON pageviews(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_device_type ON pageviews(device_type);
CREATE INDEX IF NOT EXISTS idx_pageviews_country ON pageviews(country);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_source ON pageviews(utm_source);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_campaign ON pageviews(utm_campaign);

CREATE INDEX IF NOT EXISTS idx_sessions_website_id ON sessions(website_id);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);

-- Step 4: Enable RLS on sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for sessions table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous operations on sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all operations on sessions" ON sessions;

-- Create new policies
CREATE POLICY "Allow anonymous operations on sessions" ON sessions
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Done! Your database is now upgraded with all new analytics features
