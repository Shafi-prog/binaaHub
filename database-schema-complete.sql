-- Comprehensive Database Schema for Binna Construction Platform
-- This schema includes all tables for projects, orders, profiles, warranties, and construction spending tracking

-- ========================================
-- 1. USERS & PROFILES
-- ========================================

-- Enhanced users table (assuming it exists, we'll add additional columns)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- User profiles table for extended information
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    occupation VARCHAR(100),
    company_name VARCHAR(200),
    national_id VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'ar',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": true, "push": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. CONSTRUCTION PROJECTS
-- ========================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL, -- villa, apartment, commercial, etc.
    location TEXT NOT NULL,
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    coordinates POINT,
    plot_area DECIMAL(10,2), -- in square meters
    building_area DECIMAL(10,2), -- in square meters
    floors_count INTEGER DEFAULT 1,
    rooms_count INTEGER,
    bathrooms_count INTEGER,
    status VARCHAR(50) DEFAULT 'planning', -- planning, design, permits, construction, finishing, completed, on_hold
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    budget_estimate DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'SAR',
    project_manager_id UUID REFERENCES auth.users(id),
    contractor_id UUID REFERENCES auth.users(id),
    architect_id UUID REFERENCES auth.users(id),
    engineer_id UUID REFERENCES auth.users(id),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project phases table
CREATE TABLE IF NOT EXISTS project_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    phase_order INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, on_hold
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    dependencies JSONB DEFAULT '[]', -- Array of phase IDs that must complete first
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, phase_order)
);

-- Project documents and files
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL, -- contract, permit, drawing, photo, invoice, receipt, etc.
    title VARCHAR(200) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. CONSTRUCTION SPENDING TRACKING
-- ========================================

-- Construction categories for spending tracking
CREATE TABLE IF NOT EXISTS construction_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    name_ar VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES construction_categories(id),
    icon VARCHAR(50),
    color VARCHAR(7), -- HEX color code
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default construction categories
INSERT INTO construction_categories (name, name_ar, description, icon, color) VALUES
('foundation', 'الأساسات', 'Foundation and structural work', 'foundation', '#8B4513'),
('concrete', 'الخرسانة', 'Concrete work and pouring', 'concrete', '#A0A0A0'),
('masonry', 'البناء والطوب', 'Brick and block work', 'brick', '#CD853F'),
('steel', 'الحديد والصلب', 'Steel reinforcement and structural steel', 'steel', '#C0C0C0'),
('roofing', 'الأسقف', 'Roofing materials and installation', 'roof', '#654321'),
('plumbing', 'السباكة', 'Plumbing materials and installation', 'plumbing', '#4169E1'),
('electrical', 'الكهرباء', 'Electrical materials and installation', 'electrical', '#FFD700'),
('hvac', 'التكييف والتهوية', 'HVAC systems and installation', 'hvac', '#00CED1'),
('insulation', 'العزل', 'Insulation materials and installation', 'insulation', '#FF6347'),
('windows', 'النوافذ والأبواب', 'Windows and doors', 'window', '#87CEEB'),
('flooring', 'الأرضيات', 'Flooring materials and installation', 'flooring', '#DEB887'),
('tiles', 'البلاط والسيراميك', 'Tiles and ceramic work', 'tiles', '#F0E68C'),
('painting', 'الدهانات', 'Paint and painting work', 'paint', '#FF69B4'),
('fixtures', 'التركيبات', 'Light fixtures and hardware', 'fixtures', '#DA70D6'),
('landscaping', 'تنسيق الحدائق', 'Landscaping and outdoor work', 'landscaping', '#32CD32'),
('permits', 'التصاريح والرسوم', 'Permits and government fees', 'permits', '#FF4500'),
('labor', 'العمالة', 'Labor costs', 'labor', '#708090'),
('equipment', 'المعدات', 'Equipment rental and tools', 'equipment', '#B22222'),
('materials_transport', 'نقل المواد', 'Material transportation', 'transport', '#4682B4'),
('safety', 'السلامة', 'Safety equipment and measures', 'safety', '#FF8C00'),
('other', 'أخرى', 'Other miscellaneous expenses', 'other', '#808080')
ON CONFLICT (name) DO NOTHING;

-- Construction expenses/spending table
CREATE TABLE IF NOT EXISTS construction_expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES project_phases(id) ON DELETE SET NULL,
    category_id UUID REFERENCES construction_categories(id) NOT NULL,
    subcategory VARCHAR(100),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    expense_date DATE DEFAULT CURRENT_DATE,
    vendor_name VARCHAR(200),
    vendor_contact VARCHAR(100),
    invoice_number VARCHAR(100),
    invoice_url TEXT,
    receipt_url TEXT,
    payment_method VARCHAR(50), -- cash, card, bank_transfer, check
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    paid_date DATE,
    notes TEXT,
    quantity DECIMAL(10,2),
    unit_price DECIMAL(15,2),
    unit VARCHAR(50),
    is_budgeted BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. ORDERS MANAGEMENT
-- ========================================

-- Stores/Suppliers table
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_name VARCHAR(200) NOT NULL,
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
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    delivery_areas TEXT[], -- Array of delivery areas
    working_hours JSONB DEFAULT '{}',
    payment_methods TEXT[], -- Array of accepted payment methods
    social_media JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products/Materials table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES construction_categories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    sku VARCHAR(100),
    price DECIMAL(15,2) NOT NULL,
    cost_price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'SAR',
    unit VARCHAR(50) NOT NULL, -- piece, meter, square_meter, cubic_meter, ton, kg, etc.
    minimum_quantity DECIMAL(10,2) DEFAULT 1,
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    low_stock_threshold DECIMAL(10,2) DEFAULT 10,
    is_digital BOOLEAN DEFAULT false,
    weight DECIMAL(10,3),
    dimensions JSONB DEFAULT '{}', -- {length, width, height}
    images TEXT[],
    specifications JSONB DEFAULT '{}',
    warranty_period INTEGER DEFAULT 0, -- in months
    warranty_terms TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    seo_title VARCHAR(255),
    seo_description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled, returned
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded, partial
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- Delivery information
    delivery_type VARCHAR(50) DEFAULT 'standard', -- standard, express, pickup
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_region VARCHAR(100),
    delivery_postal_code VARCHAR(20),
    delivery_instructions TEXT,
    delivery_date DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Contact information
    customer_name VARCHAR(200),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    
    -- Order metadata
    notes TEXT,
    internal_notes TEXT,
    source VARCHAR(50) DEFAULT 'website', -- website, app, phone, direct
    
    -- Tracking
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50),
    notes TEXT,
    warranty_start_date DATE,
    warranty_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. WARRANTIES MANAGEMENT
-- ========================================

-- Warranties table
CREATE TABLE IF NOT EXISTS warranties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    
    -- Warranty details
    warranty_number VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE NOT NULL,
    warranty_start_date DATE NOT NULL,
    warranty_end_date DATE NOT NULL,
    warranty_period_months INTEGER NOT NULL,
    warranty_type VARCHAR(50) DEFAULT 'manufacturer', -- manufacturer, extended, store, custom
    
    -- Coverage details
    coverage_description TEXT,
    terms_and_conditions TEXT,
    exclusions TEXT,
    
    -- Status and claims
    status VARCHAR(50) DEFAULT 'active', -- active, expired, claimed, void, transferred
    is_transferable BOOLEAN DEFAULT false,
    claim_count INTEGER DEFAULT 0,
    last_claim_date DATE,
    
    -- Documentation
    purchase_receipt_url TEXT,
    warranty_certificate_url TEXT,
    product_images TEXT[],
    
    -- Contact information
    vendor_name VARCHAR(200),
    vendor_contact TEXT,
    service_center_info JSONB DEFAULT '{}',
    
    -- Metadata
    notes TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warranty claims table
CREATE TABLE IF NOT EXISTS warranty_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    warranty_id UUID REFERENCES warranties(id) ON DELETE CASCADE,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    claim_type VARCHAR(50) NOT NULL, -- repair, replacement, refund, service
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, approved, rejected, in_progress, completed, closed
    
    -- Claim details
    issue_description TEXT NOT NULL,
    reported_date DATE DEFAULT CURRENT_DATE,
    issue_photos TEXT[],
    diagnosis TEXT,
    resolution_description TEXT,
    
    -- Service details
    service_provider VARCHAR(200),
    service_date DATE,
    completion_date DATE,
    cost_covered DECIMAL(15,2) DEFAULT 0,
    cost_customer DECIMAL(15,2) DEFAULT 0,
    
    -- Communication
    customer_notes TEXT,
    vendor_notes TEXT,
    resolution_notes TEXT,
    
    -- Ratings and feedback
    customer_satisfaction_rating INTEGER CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
    customer_feedback TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. DELIVERY LOCATIONS
-- ========================================

-- User delivery addresses
CREATE TABLE IF NOT EXISTS delivery_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- Home, Office, Construction Site, etc.
    recipient_name VARCHAR(200),
    phone VARCHAR(20),
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Saudi Arabia',
    coordinates POINT,
    delivery_instructions TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. REPORTS AND ANALYTICS
-- ========================================

-- User reports/exports history
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- expense_summary, project_status, warranty_list, order_history
    report_format VARCHAR(10) NOT NULL, -- pdf, excel, csv
    parameters JSONB DEFAULT '{}',
    file_url TEXT,
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'generating', -- generating, completed, failed, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- ========================================
-- 8. NOTIFICATIONS AND COMMUNICATIONS
-- ========================================

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- order_update, project_milestone, warranty_expiry, expense_alert, etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    channel VARCHAR(20) DEFAULT 'app', -- app, email, sms, push
    related_entity_type VARCHAR(50), -- project, order, warranty, expense
    related_entity_id UUID,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 9. INDEXES FOR PERFORMANCE
-- ========================================

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_construction_expenses_project_id ON construction_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_category_id ON construction_expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_expense_date ON construction_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_created_by ON construction_expenses(created_by);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Warranties indexes
CREATE INDEX IF NOT EXISTS idx_warranties_user_id ON warranties(user_id);
CREATE INDEX IF NOT EXISTS idx_warranties_status ON warranties(status);
CREATE INDEX IF NOT EXISTS idx_warranties_warranty_end_date ON warranties(warranty_end_date);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_warranty_id ON warranty_claims(warranty_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at);

-- ========================================
-- 10. TRIGGERS FOR AUTOMATED UPDATES
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_phases_updated_at BEFORE UPDATE ON project_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_expenses_updated_at BEFORE UPDATE ON construction_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warranties_updated_at BEFORE UPDATE ON warranties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warranty_claims_updated_at BEFORE UPDATE ON warranty_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_addresses_updated_at BEFORE UPDATE ON delivery_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user data access
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view project phases for own projects" ON project_phases 
    FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage project phases for own projects" ON project_phases 
    FOR ALL USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own expenses" ON construction_expenses 
    FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own expenses" ON construction_expenses 
    FOR ALL USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own warranties" ON warranties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own warranties" ON warranties FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own delivery addresses" ON delivery_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own delivery addresses" ON delivery_addresses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Store policies (stores can view their own data)
CREATE POLICY "Stores can view own store data" ON stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Stores can update own store data" ON stores FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Stores can view own products" ON products 
    FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));
CREATE POLICY "Stores can manage own products" ON products 
    FOR ALL USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

-- Public read access for some tables
CREATE POLICY "Public can view construction categories" ON construction_categories FOR SELECT USING (true);
CREATE POLICY "Public can view active stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);

-- ========================================
-- 12. SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample data only if tables are empty
DO $$
BEGIN
    -- Insert sample user profile (replace with actual user ID)
    IF NOT EXISTS (SELECT 1 FROM user_profiles LIMIT 1) THEN
        INSERT INTO user_profiles (user_id, occupation, company_name, preferred_language) 
        SELECT id, 'Engineer', 'Construction Co.', 'ar' 
        FROM auth.users 
        WHERE email = 'user@user.com' 
        LIMIT 1;
    END IF;
    
    -- Insert sample project
    IF NOT EXISTS (SELECT 1 FROM projects LIMIT 1) THEN
        INSERT INTO projects (
            user_id, name, description, project_type, location, 
            city, region, plot_area, building_area, status, 
            budget_estimate, start_date, expected_completion_date
        ) 
        SELECT 
            id, 
            'مشروع فيلا العائلة', 
            'بناء فيلا سكنية من دورين مع حديقة',
            'villa',
            'حي النرجس، الرياض',
            'الرياض',
            'الرياض',
            600.00,
            400.00,
            'construction',
            500000.00,
            '2024-01-15',
            '2024-12-15'
        FROM auth.users 
        WHERE email = 'user@user.com' 
        LIMIT 1;
    END IF;
END $$;

-- Success message
SELECT 'Database schema created successfully! All tables, indexes, triggers, and RLS policies are in place.' AS status;
