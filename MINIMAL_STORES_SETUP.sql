-- ================================================================
-- MINIMAL STORES TABLE SETUP FOR TESTING
-- ================================================================
-- Apply this through Supabase Dashboard > SQL Editor
-- ================================================================

-- Create stores table first
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
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

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to active stores
CREATE POLICY "Allow public read access to active stores" 
ON public.stores 
FOR SELECT 
USING (is_active = true);

-- Create policy for store owners to manage their stores
CREATE POLICY "Store owners can manage their stores" 
ON public.stores 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- Insert sample data
INSERT INTO public.stores (
  store_name, description, category, phone, email, address, city, region,
  rating, total_reviews, is_verified, is_active,
  delivery_areas, payment_methods
) VALUES 
(
  'متجر البناء المحترف',
  'متجر متخصص في مواد البناء والتشييد عالية الجودة',
  'مواد البناء',
  '+966501234567',
  'info@building-pro.com',
  'حي الملك فهد، الرياض',
  'الرياض',
  'الرياض',
  4.8,
  127,
  true,
  true,
  ARRAY['الرياض', 'جدة', 'الدمام'],
  ARRAY['cash', 'card', 'transfer']
),
(
  'سوق الأدوات الكهربائية',
  'تشكيلة واسعة من الأدوات الكهربائية والمعدات',
  'أدوات كهربائية',
  '+966507654321',
  'sales@electric-tools.com',
  'طريق الملك عبدالعزيز، جدة',
  'جدة',
  'مكة المكرمة',
  4.5,
  89,
  true,
  true,
  ARRAY['جدة', 'مكة', 'الطائف'],
  ARRAY['cash', 'card']
),
(
  'مركز الديكور العصري',
  'أفضل أنواع الديكورات والتصاميم الداخلية',
  'ديكور',
  '+966556789123',
  'contact@modern-decor.com',
  'شارع التحلية، الخبر',
  'الخبر',
  'الشرقية',
  4.7,
  156,
  false,
  true,
  ARRAY['الخبر', 'الدمام', 'القطيف'],
  ARRAY['cash', 'card', 'transfer']
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_active ON public.stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_city ON public.stores(city);
CREATE INDEX IF NOT EXISTS idx_stores_rating ON public.stores(rating DESC);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at 
    BEFORE UPDATE ON public.stores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
