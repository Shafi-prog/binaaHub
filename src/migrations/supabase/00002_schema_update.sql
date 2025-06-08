-- Drop existing tables if they exist (will cascade to constraints and indexes)
DROP TABLE IF EXISTS public.warranties CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.store_views CASCADE;
DROP TABLE IF EXISTS public.daily_store_metrics CASCADE;
DROP TABLE IF EXISTS public.shipping CASCADE;
DROP TABLE IF EXISTS public.shipping_providers CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.invite_code_usages CASCADE;
DROP TABLE IF EXISTS public.invite_codes CASCADE;
DROP TABLE IF EXISTS public.user_balance CASCADE;
DROP TABLE IF EXISTS public.balances CASCADE;
DROP TABLE IF EXISTS public.store_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.project_type CASCADE;
DROP TYPE IF EXISTS public.warranty_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.service_status CASCADE;

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'store', 'admin');
CREATE TYPE project_type AS ENUM ('residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other');
CREATE TYPE warranty_status AS ENUM ('active', 'expired', 'pending', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE service_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'available');

-- Create users table
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create store_profiles table
CREATE TABLE public.store_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  description text,
  business_license text,
  category text,
  phone text,
  email text,
  address text,
  city text,
  region text,
  website text,
  logo_url text,
  cover_image_url text,
  location_lat double precision,
  location_lng double precision,
  business_type text,
  registration_number text,
  working_hours jsonb,
  contact_email text,
  contact_phone text,
  social_media jsonb,
  rating real DEFAULT 0,
  review_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  delivery_areas text[],
  payment_methods text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create balances table
CREATE TABLE public.balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  available_amount double precision DEFAULT 0,
  pending_amount double precision DEFAULT 0,
  total_earned double precision DEFAULT 0,
  last_payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  barcode text UNIQUE,
  price double precision NOT NULL,
  stock integer DEFAULT 0,
  image_url text,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status DEFAULT 'pending',
  total_amount double precision DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price double precision NOT NULL,
  total_price double precision NOT NULL,
  metadata jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create invite_codes table
CREATE TABLE public.invite_codes (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  usage_count integer DEFAULT 0,
  total_commission double precision DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT invite_codes_pkey PRIMARY KEY (user_id, code),
  CONSTRAINT invite_codes_code_key UNIQUE (code)
);

-- Create invite_code_usages table
CREATE TABLE public.invite_code_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text REFERENCES invite_codes(code) ON DELETE CASCADE,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  commission_earned double precision DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  project_type project_type NOT NULL DEFAULT 'residential',
  status VARCHAR(50) NOT NULL DEFAULT 'planning',
  location_lat double precision,
  location_lng double precision,
  address text,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  budget double precision,
  metadata jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create warranties table with enhanced fields
CREATE TABLE public.warranties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  warranty_number text NOT NULL UNIQUE,
  product_name text NOT NULL,
  brand text,
  model text,
  serial_number text,
  purchase_date TIMESTAMPTZ NOT NULL,
  warranty_start_date TIMESTAMPTZ NOT NULL,
  warranty_end_date TIMESTAMPTZ NOT NULL,
  warranty_period_months integer NOT NULL,
  warranty_type text NOT NULL CHECK (warranty_type = ANY (ARRAY['manufacturer', 'extended', 'store', 'custom'])),
  coverage_description text,
  status warranty_status NOT NULL DEFAULT 'active',
  is_transferable boolean DEFAULT false,
  claim_count integer DEFAULT 0,
  vendor_name text,
  vendor_contact text,
  metadata jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  price double precision,
  duration interval,
  status service_status DEFAULT 'available',
  location_radius double precision,
  metadata jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create shipping_providers table
CREATE TABLE public.shipping_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  api_url text,
  available_regions text[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create shipping table
CREATE TABLE public.shipping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES shipping_providers(id) ON DELETE SET NULL,
  status text CHECK (status = ANY (ARRAY['assigned', 'in_transit', 'delivered'])),
  tracking_url text,
  from_lat double precision,
  from_lng double precision,
  to_lat double precision,
  to_lng double precision,
  metadata jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics tables
CREATE TABLE public.store_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES store_profiles(id) ON DELETE CASCADE,
  session_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  source VARCHAR(100),
  referrer text,
  created_at TIMESTAMPTZ DEFAULT now(),
  ip_address VARCHAR(45),
  user_agent text
);

CREATE TABLE public.daily_store_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES store_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sales decimal(12,2) DEFAULT 0,
  order_count integer DEFAULT 0,
  customer_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  conversion_rate decimal(5,2) DEFAULT 0,
  average_order_value decimal(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_id, date)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_store_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_code_usages ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_store_profiles_store_name ON store_profiles(store_name);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_warranties_user_id ON warranties(user_id);
CREATE INDEX idx_warranties_store_id ON warranties(store_id);
CREATE INDEX idx_warranties_product_id ON warranties(product_id);
CREATE INDEX idx_warranties_warranty_number ON warranties(warranty_number);
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_shipping_order_id ON shipping(order_id);
CREATE INDEX idx_store_views_store_id ON store_views(store_id);
CREATE INDEX idx_daily_metrics_store_date ON daily_store_metrics(store_id, date);
CREATE INDEX idx_invite_codes_code ON invite_codes(code);

-- Basic RLS policies
CREATE POLICY "Users can view their own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view store profiles" ON store_profiles
  FOR SELECT USING (true);

CREATE POLICY "Store owners can manage their profile" ON store_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view their own balances" ON balances
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Store owners can manage products" ON products
  FOR ALL USING (auth.uid() = store_id);

CREATE POLICY "Users can view their own orders" ON orders
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = store_id);

CREATE POLICY "Users can view their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own warranties" ON warranties
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = store_id);

-- Functions for metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(store_id UUID, calc_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
  -- Update or insert daily metrics
  INSERT INTO daily_store_metrics (
    store_id,
    date,
    view_count,
    order_count,
    total_sales
  )
  SELECT
    store_id,
    calc_date,
    COUNT(DISTINCT sv.id) as view_count,
    COUNT(DISTINCT o.id) as order_count,
    COALESCE(SUM(o.total_amount), 0) as total_sales
  FROM store_profiles sp
  LEFT JOIN store_views sv ON sp.id = sv.store_id 
    AND DATE(sv.created_at) = calc_date
  LEFT JOIN orders o ON sp.id = o.store_id 
    AND DATE(o.created_at) = calc_date
  WHERE sp.id = calculate_daily_metrics.store_id
  GROUP BY sp.id
  ON CONFLICT (store_id, date)
  DO UPDATE SET
    view_count = EXCLUDED.view_count,
    order_count = EXCLUDED.order_count,
    total_sales = EXCLUDED.total_sales,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
