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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);

CREATE INDEX IF NOT EXISTS idx_pageviews_website_id ON pageviews(website_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON pageviews(timestamp);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON pageviews(session_id);

CREATE INDEX IF NOT EXISTS idx_events_website_id ON events(website_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);

-- Enable Row Level Security (optional, for multi-tenant scenarios)
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

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

-- Create a policy to allow reads (adjust based on your security needs)
CREATE POLICY "Allow all operations on pageviews" ON pageviews
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on events" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);
