-- Enhanced Store Features Database Schema
-- Phase 1 Implementation: POS System, User Search, Advanced Inventory

-- POS Transactions Table
CREATE TABLE IF NOT EXISTS pos_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'digital')),
  items JSONB NOT NULL, -- Array of cart items
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'cancelled')),
  receipt_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Movements Table for Advanced Inventory Tracking
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'transfer', 'sale', 'return')),
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL DEFAULT 0,
  new_quantity INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  reason TEXT,
  reference VARCHAR(100), -- PO number, adjustment ref, etc.
  source_location VARCHAR(100),
  destination_location VARCHAR(100),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Products Table (add missing columns)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS barcode VARCHAR(100),
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_stock_level INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS location VARCHAR(100) DEFAULT 'Main Store',
ADD COLUMN IF NOT EXISTS supplier VARCHAR(200),
ADD COLUMN IF NOT EXISTS last_restocked TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_backorder BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS weight DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS dimensions JSONB; -- {length, width, height}

-- Inventory Locations Table
CREATE TABLE IF NOT EXISTS inventory_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  description TEXT,
  address TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, code)
);

-- Product Locations (for multi-location inventory)
CREATE TABLE IF NOT EXISTS product_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES inventory_locations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, location_id)
);

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name VARCHAR(200) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date DATE,
  received_date DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  unit_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50),
  contact_person VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Saudi Arabia',
  tax_number VARCHAR(50),
  payment_terms VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, code)
);

-- Enhanced User Search Index for POS
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING gin(to_tsvector('arabic', name || ' ' || email || ' ' || COALESCE(phone, '')));
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Product Search Indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('arabic', name || ' ' || category || ' ' || COALESCE(sku, '') || ' ' || COALESCE(barcode, '')));
CREATE INDEX IF NOT EXISTS idx_products_store_status ON products(store_id, status);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_pos_transactions_store_date ON pos_transactions(store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_date ON stock_movements(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_store_date ON stock_movements(store_id, created_at DESC);

-- Update triggers for stock movements
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product stock quantity when stock movement is inserted
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET 
      stock_quantity = NEW.new_quantity,
      updated_at = NOW(),
      last_restocked = CASE 
        WHEN NEW.movement_type IN ('in', 'adjustment') AND NEW.quantity > 0 THEN NOW()
        ELSE last_restocked
      END
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_product_stock ON stock_movements;
CREATE TRIGGER trigger_update_product_stock
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();

-- Function to automatically generate SKU
CREATE OR REPLACE FUNCTION generate_sku()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sku IS NULL OR NEW.sku = '' THEN
    NEW.sku := 'SKU-' || UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create SKU trigger
DROP TRIGGER IF EXISTS trigger_generate_sku ON products;
CREATE TRIGGER trigger_generate_sku
  BEFORE INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION generate_sku();

-- Insert default inventory location for existing stores
INSERT INTO inventory_locations (store_id, name, code, description, is_default, is_active)
SELECT 
  u.id,
  'المخزن الرئيسي',
  'MAIN',
  'المخزن الافتراضي',
  true,
  true
FROM auth.users u
WHERE u.account_type = 'store' 
AND NOT EXISTS (
  SELECT 1 FROM inventory_locations il WHERE il.store_id = u.id
);

-- Update existing products with default values
UPDATE products 
SET 
  min_stock_level = COALESCE(min_stock_level, 5),
  max_stock_level = COALESCE(max_stock_level, 1000),
  location = COALESCE(location, 'Main Store'),
  track_inventory = COALESCE(track_inventory, true),
  cost_price = COALESCE(cost_price, price * 0.7) -- Assume 30% markup
WHERE min_stock_level IS NULL OR max_stock_level IS NULL OR location IS NULL;

-- Enhanced RLS Policies

-- POS Transactions policies
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their POS transactions" ON pos_transactions
  FOR ALL USING (store_id = auth.uid());

-- Stock Movements policies  
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their stock movements" ON stock_movements
  FOR ALL USING (store_id = auth.uid());

-- Inventory Locations policies
ALTER TABLE inventory_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their inventory locations" ON inventory_locations
  FOR ALL USING (store_id = auth.uid());

-- Product Locations policies
ALTER TABLE product_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their product locations" ON product_locations
  FOR ALL USING (
    product_id IN (
      SELECT id FROM products WHERE store_id = auth.uid()
    )
  );

-- Purchase Orders policies
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their purchase orders" ON purchase_orders
  FOR ALL USING (store_id = auth.uid());

-- Purchase Order Items policies
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their purchase order items" ON purchase_order_items
  FOR ALL USING (
    purchase_order_id IN (
      SELECT id FROM purchase_orders WHERE store_id = auth.uid()
    )
  );

-- Suppliers policies
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their suppliers" ON suppliers
  FOR ALL USING (store_id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON pos_transactions TO authenticated;
GRANT ALL ON stock_movements TO authenticated;
GRANT ALL ON inventory_locations TO authenticated;
GRANT ALL ON product_locations TO authenticated;
GRANT ALL ON purchase_orders TO authenticated;
GRANT ALL ON purchase_order_items TO authenticated;
GRANT ALL ON suppliers TO authenticated;

-- Comments for documentation
COMMENT ON TABLE pos_transactions IS 'Point of Sale transactions with customer and payment details';
COMMENT ON TABLE stock_movements IS 'Complete inventory movement tracking for advanced inventory management';
COMMENT ON TABLE inventory_locations IS 'Multiple warehouse/location support for inventory';
COMMENT ON TABLE product_locations IS 'Product quantities per location for multi-location inventory';
COMMENT ON TABLE purchase_orders IS 'Purchase order management for supplier ordering';
COMMENT ON TABLE suppliers IS 'Supplier management for purchase orders';

-- Create some sample data for testing (optional)
/*
INSERT INTO inventory_locations (store_id, name, code, description, is_default)
VALUES 
  ('sample-store-id', 'Main Warehouse', 'MAIN', 'Primary storage location', true),
  ('sample-store-id', 'Retail Floor', 'FLOOR', 'Showroom and retail area', false);
*/
