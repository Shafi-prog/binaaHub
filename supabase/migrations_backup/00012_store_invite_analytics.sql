-- Migration: Store invite analytics table
CREATE TABLE IF NOT EXISTS store_invite_analytics (
  id SERIAL PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  event_type VARCHAR(16) NOT NULL, -- 'visit' or 'purchase'
  used_at TIMESTAMP NOT NULL DEFAULT NOW()
);
