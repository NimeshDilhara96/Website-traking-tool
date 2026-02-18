-- ============================================
-- MIGRATION: Add visitor_id to events table
-- Run this to enable active users tracking
-- ============================================

-- Add visitor_id column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS visitor_id TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events';

-- Done! Now restart your tracking server to start collecting active user data
