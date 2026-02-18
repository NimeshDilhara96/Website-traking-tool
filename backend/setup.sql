-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pageviews table
CREATE TABLE IF NOT EXISTS pageviews (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  screen_resolution TEXT,
  language TEXT,
  
  -- Location data
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  
  -- Device & Browser info
  device_type TEXT, -- mobile, tablet, desktop
  browser_name TEXT,
  browser_version TEXT,
  os_name TEXT,
  os_version TEXT,
  is_mobile BOOLEAN DEFAULT false,
  
  -- UTM Parameters (Campaign tracking)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Performance metrics
  page_load_time INTEGER, -- milliseconds
  ttfb INTEGER, -- Time to First Byte
  fcp INTEGER, -- First Contentful Paint
  lcp INTEGER, -- Largest Contentful Paint
  
  -- User behavior
  scroll_depth INTEGER, -- percentage 0-100
  time_on_page INTEGER, -- seconds
  
  -- Visitor tracking
  visitor_id TEXT, -- unique visitor identifier
  is_new_visitor BOOLEAN DEFAULT true,
  
  -- Page flow
  is_entry BOOLEAN DEFAULT false,
  is_exit BOOLEAN DEFAULT false,
  
  session_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB,
  url TEXT NOT NULL,
  session_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table for session-level tracking
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER DEFAULT 0, -- seconds
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);

CREATE INDEX IF NOT EXISTS idx_pageviews_website_id ON pageviews(website_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON pageviews(timestamp);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON pageviews(session_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON pageviews(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_device_type ON pageviews(device_type);
CREATE INDEX IF NOT EXISTS idx_pageviews_country ON pageviews(country);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_source ON pageviews(utm_source);
CREATE INDEX IF NOT EXISTS idx_pageviews_utm_campaign ON pageviews(utm_campaign);

CREATE INDEX IF NOT EXISTS idx_sessions_website_id ON sessions(website_id);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_events_website_id ON events(website_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);

-- Enable Row Level Security (optional, for multi-tenant scenarios)
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for websites table
CREATE POLICY "Allow all operations on websites" ON websites
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a policy to allow inserts (adjust based on your security needs)
CREATE POLICY "Allow anonymous inserts on pageviews" ON pageviews
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on events" ON events
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous operations on sessions" ON sessions
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Create a policy to allow reads (adjust based on your security needs)
CREATE POLICY "Allow all operations on pageviews" ON pageviews
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on events" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
