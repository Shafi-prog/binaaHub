-- Fix RLS policies for stores table to allow public read access

-- Add policy to allow anyone to view active stores
CREATE POLICY "Anyone can view active stores" ON stores
  FOR SELECT USING (is_active = true);

-- Add policy to allow store owners to manage their own stores
CREATE POLICY "Store owners can manage their stores" ON stores
  FOR ALL USING (auth.uid() = user_id);

-- Add policy for inserting new stores (store owners only)
CREATE POLICY "Authenticated users can create stores" ON stores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add policy to allow viewing store profiles for active stores
CREATE POLICY "Anyone can view active store profiles" ON store_profiles
  FOR SELECT USING (is_active = true);

-- Add policy for store owners to manage their profiles
CREATE POLICY "Store owners can manage their profiles" ON store_profiles
  FOR ALL USING (auth.uid() = id);

-- Ensure proper indexing for performance
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stores_rating ON stores(rating DESC) WHERE is_active = true;
