-- Fix Construction Tables - Add missing construction_categories and construction_expenses tables
-- This SQL should be run in your Supabase SQL Editor

-- 1. Create construction_categories table
CREATE TABLE IF NOT EXISTS construction_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    name_ar VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES construction_categories(id),
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#999999', -- HEX color code
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create construction_expenses table
CREATE TABLE IF NOT EXISTS construction_expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category_id UUID REFERENCES construction_categories(id) NOT NULL,
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

-- 3. Insert default construction categories
INSERT INTO construction_categories (name, name_ar, description, color) VALUES
('concrete', 'الخرسانة', 'Concrete and cement materials', '#8B4513'),
('steel', 'الحديد والصلب', 'Steel and iron materials', '#708090'),
('bricks', 'الطوب والكتل', 'Bricks and building blocks', '#CD853F'),
('tiles', 'البلاط والسيراميك', 'Tiles, ceramics and flooring', '#DEB887'),
('paint', 'الدهانات', 'Paint and coating materials', '#87CEEB'),
('electrical', 'الكهرباء', 'Electrical materials and installation', '#FFD700'),
('plumbing', 'السباكة', 'Plumbing materials and installation', '#4169E1'),
('doors_windows', 'الأبواب والنوافذ', 'Doors, windows and frames', '#D2691E'),
('insulation', 'العزل', 'Insulation materials', '#F0E68C'),
('permits', 'التصاريح والرسوم', 'Permits and government fees', '#FF4500'),
('labor', 'العمالة', 'Labor costs', '#708090'),
('equipment', 'المعدات', 'Equipment rental and tools', '#B22222'),
('transport', 'النقل', 'Material transportation', '#4682B4'),
('safety', 'السلامة', 'Safety equipment and measures', '#FF8C00'),
('other', 'أخرى', 'Other miscellaneous expenses', '#808080')
ON CONFLICT (name) DO NOTHING;

-- 4. Enable Row Level Security
ALTER TABLE construction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_expenses ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for construction_categories
CREATE POLICY "Anyone can view construction categories" ON construction_categories 
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" ON construction_categories 
FOR ALL USING (auth.uid() IS NOT NULL);

-- 6. Create RLS policies for construction_expenses
CREATE POLICY "Users can view their project expenses" ON construction_expenses 
FOR SELECT USING (
    created_by = auth.uid() OR 
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create expenses for their projects" ON construction_expenses 
FOR INSERT WITH CHECK (
    created_by = auth.uid() AND 
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their expenses" ON construction_expenses 
FOR UPDATE USING (
    created_by = auth.uid() OR 
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete their expenses" ON construction_expenses 
FOR DELETE USING (
    created_by = auth.uid() OR 
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_construction_categories_active ON construction_categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_construction_categories_sort ON construction_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_project_id ON construction_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_category_id ON construction_expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_expense_date ON construction_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_created_by ON construction_expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_construction_expenses_payment_status ON construction_expenses(payment_status);

-- 8. Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_construction_categories_updated_at 
    BEFORE UPDATE ON construction_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_construction_expenses_updated_at 
    BEFORE UPDATE ON construction_expenses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Construction tables created successfully!' as message;
