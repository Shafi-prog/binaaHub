-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'store', 'admin');
CREATE TYPE project_type AS ENUM ('residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other');
CREATE TYPE warranty_status AS ENUM ('active', 'expired', 'pending', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE service_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type user_role NOT NULL DEFAULT 'user',
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  preferences JSONB,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'active'
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_name VARCHAR(255) NOT NULL,
  business_license VARCHAR(100),
  description TEXT,
  category VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  website VARCHAR(255),
  logo_url TEXT,
  cover_image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  delivery_areas TEXT[],
  working_hours JSONB,
  payment_methods TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_type project_type NOT NULL DEFAULT 'residential',
  status VARCHAR(50) NOT NULL DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  location JSONB,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Warranties table
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  warranty_number VARCHAR(50) NOT NULL UNIQUE,
  item_name VARCHAR(255) NOT NULL,
  purchase_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status warranty_status NOT NULL DEFAULT 'active',
  details JSONB,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Store views table for analytics
CREATE TABLE IF NOT EXISTS store_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  session_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source VARCHAR(100),
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Create daily store metrics table
CREATE TABLE IF NOT EXISTS daily_store_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sales DECIMAL(12,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  customer_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, date)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_store_metrics ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_store_id ON projects(store_id);
CREATE INDEX idx_warranties_user_id ON warranties(user_id);
CREATE INDEX idx_warranties_store_id ON warranties(store_id);
CREATE INDEX idx_store_views_store_id ON store_views(store_id);
CREATE INDEX idx_daily_metrics_store_date ON daily_store_metrics(store_id, date);

-- Add basic RLS policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Stores can view their own data" ON stores
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own warranties" ON warranties
  FOR ALL USING (auth.uid() = user_id);

-- Functions for metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(store_id UUID, calc_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
  -- Update or insert daily metrics
  INSERT INTO daily_store_metrics (
    store_id,
    date,
    view_count
  )
  SELECT
    store_id,
    calc_date,
    COUNT(DISTINCT sv.id)
  FROM store_views sv
  WHERE sv.store_id = calculate_daily_metrics.store_id
    AND DATE(sv.created_at) = calc_date
  ON CONFLICT (store_id, date)
  DO UPDATE SET
    view_count = EXCLUDED.view_count,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
