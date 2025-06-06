-- Store Enhancements Migration
-- Add logo, working hours, and invitation code to stores
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS working_hours TEXT,
ADD COLUMN IF NOT EXISTS invitation_code TEXT;

-- Add location, سجل تجاري, and verification fields
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS location JSONB,
ADD COLUMN IF NOT EXISTS sijil TEXT,
ADD COLUMN IF NOT EXISTS sijil_verified BOOLEAN DEFAULT FALSE;

-- Add public page support (id is already present, just ensure index)
CREATE INDEX IF NOT EXISTS idx_stores_id ON stores(id);

-- Product returnable flag
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_returnable BOOLEAN DEFAULT TRUE;

-- Orders: status, shipment, delivery, returns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS shipment_company VARCHAR(64),
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(128),
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS return_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS return_reason TEXT,
ADD COLUMN IF NOT EXISTS return_status VARCHAR(32);

-- Add driver assignment, delivery confirmation photo, and user building photo
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS driver_id UUID,
ADD COLUMN IF NOT EXISTS delivery_confirmation_photo_url TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS building_photo_url TEXT;

-- Add discounted and top_sold flags to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_discounted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_top_sold BOOLEAN DEFAULT FALSE;

-- Add map_url to stores
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS map_url TEXT;

-- Add invitation analytics tables for users (if not exist)
CREATE TABLE IF NOT EXISTS user_invite_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(32), -- 'visit' or 'purchase'
  created_at TIMESTAMP DEFAULT NOW()
);
