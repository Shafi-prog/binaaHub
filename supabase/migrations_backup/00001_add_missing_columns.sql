-- Add missing columns to products table for remote database compatibility
-- This migration adds any missing columns from products table

-- Add is_active column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add featured column if it doesn't exist  
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add weight column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight NUMERIC;

-- Add dimensions column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS dimensions JSONB;

-- Add specifications column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS specifications JSONB;

-- Add other potentially missing columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS unit VARCHAR(20);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[];

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- Now create the indexes safely
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
