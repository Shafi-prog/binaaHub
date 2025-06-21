-- Create stores table and related structures
-- This migration creates the stores table that other tables reference

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    store_name VARCHAR(255) NOT NULL,
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
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    delivery_areas TEXT[],
    working_hours JSONB,
    payment_methods TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table that references stores
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    unit VARCHAR(20),
    images TEXT[],
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    weight NUMERIC,
    dimensions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Add missing columns to products table if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city);
CREATE INDEX IF NOT EXISTS idx_stores_rating ON stores(rating DESC);
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Create update triggers
CREATE OR REPLACE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
CREATE POLICY "Allow public read access to active stores"
    ON stores
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Store owners can manage their stores"
    ON stores
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access to active products"
    ON products
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Store owners can manage their products"
    ON products
    FOR ALL
    USING (auth.uid() = (SELECT user_id FROM stores WHERE stores.id = products.store_id));
