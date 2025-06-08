-- Enhanced Binna Platform: Comprehensive Feature Implementation
-- This migration adds support for:
-- 1. Shared barcode system with multiple store pricing
-- 2. Enhanced invitation system with commission tracking
-- 3. Construction supervisor management
-- 4. Contract and payment scheduling
-- 5. Enhanced analytics and notifications

-- ====================================================================================
-- 1. SHARED BARCODE & INVENTORY MANAGEMENT SYSTEM
-- ====================================================================================

-- Global items table (shared barcodes)
CREATE TABLE global_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barcode TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    model TEXT,
    category TEXT,
    specifications JSONB,
    shared_image_url TEXT, -- Single shared image to reduce storage
    warranty_months INTEGER DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Store inventory linking to global items
CREATE TABLE store_inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    global_item_id UUID REFERENCES global_items(id) ON DELETE CASCADE,
    store_price DECIMAL(10,2) NOT NULL,
    store_cost DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    store_specific_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(store_id, global_item_id)
);

-- Bulk import sessions for Excel uploads
CREATE TABLE bulk_import_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT,
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    success_rows INTEGER DEFAULT 0,
    error_rows INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    error_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ====================================================================================
-- 2. ENHANCED INVITATION & COMMISSION SYSTEM
-- ====================================================================================

-- Enhanced invitation codes with commission tracking
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.01; -- 1% default
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS max_uses INTEGER;

-- Commission tracking and payouts
CREATE TABLE commissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    commission_type TEXT CHECK (commission_type IN ('user_signup', 'store_signup', 'purchase')) NOT NULL,
    commission_rate DECIMAL(5,4) NOT NULL,
    order_amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Commission payouts
CREATE TABLE commission_payouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    commission_ids UUID[] NOT NULL,
    payment_method TEXT,
    payment_reference TEXT,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ====================================================================================
-- 3. CONSTRUCTION SUPERVISOR MANAGEMENT
-- ====================================================================================

-- Construction supervisors
CREATE TABLE construction_supervisors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- The supervisor's user account
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    license_number TEXT,
    specializations TEXT[],
    hourly_rate DECIMAL(8,2),
    experience_years INTEGER,
    rating DECIMAL(3,2) DEFAULT 0,
    total_projects INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Supervisor requests and assignments
CREATE TABLE supervisor_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Project owner
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES construction_supervisors(id) ON DELETE SET NULL,
    request_type TEXT CHECK (request_type IN ('consultation', 'full_supervision', 'periodic_inspection')) NOT NULL,
    description TEXT NOT NULL,
    budget_range_min DECIMAL(10,2),
    budget_range_max DECIMAL(10,2),
    preferred_start_date DATE,
    duration_weeks INTEGER,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    supervisor_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ====================================================================================
-- 4. CONTRACT & PAYMENT MANAGEMENT
-- ====================================================================================

-- Construction contracts
CREATE TABLE construction_contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Project owner
    supervisor_id UUID REFERENCES construction_supervisors(id) ON DELETE CASCADE,
    contract_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_schedule JSONB NOT NULL, -- Array of payment milestones
    terms_and_conditions TEXT NOT NULL,
    status TEXT CHECK (status IN ('draft', 'pending_signature', 'active', 'completed', 'terminated', 'disputed')) DEFAULT 'draft',
    user_signature_date TIMESTAMP WITH TIME ZONE,
    supervisor_signature_date TIMESTAMP WITH TIME ZONE,
    contract_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Payment milestones
CREATE TABLE payment_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contract_id UUID REFERENCES construction_contracts(id) ON DELETE CASCADE,
    milestone_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    completion_criteria TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'approved', 'paid', 'overdue')) DEFAULT 'pending',
    completed_date DATE,
    approved_date DATE,
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Supervisor purchase permissions
CREATE TABLE supervisor_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contract_id UUID REFERENCES construction_contracts(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES construction_supervisors(id) ON DELETE CASCADE,
    permission_type TEXT CHECK (permission_type IN ('purchase', 'payment', 'worker_hire')) NOT NULL,
    spending_limit DECIMAL(10,2),
    category_restrictions TEXT[],
    is_active BOOLEAN DEFAULT true,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    expires_at TIMESTAMP WITH TIME ZONE,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ====================================================================================
-- 5. EXPENSE & WORKER MANAGEMENT
-- ====================================================================================

-- Project expenses tracking
CREATE TABLE project_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES construction_contracts(id) ON DELETE SET NULL,
    supervisor_id UUID REFERENCES construction_supervisors(id) ON DELETE SET NULL,
    expense_type TEXT CHECK (expense_type IN ('materials', 'labor', 'equipment', 'transport', 'other')) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    receipt_url TEXT,
    vendor_name TEXT,
    vendor_contact TEXT,
    expense_date DATE NOT NULL,
    approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    category TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Workers management
CREATE TABLE project_workers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES construction_supervisors(id) ON DELETE SET NULL,
    worker_name TEXT NOT NULL,
    worker_phone TEXT,
    worker_id_number TEXT,
    specialty TEXT NOT NULL,
    daily_wage DECIMAL(8,2) NOT NULL,
    hire_date DATE NOT NULL,
    termination_date DATE,
    is_active BOOLEAN DEFAULT true,
    performance_rating DECIMAL(3,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Worker attendance and payments
CREATE TABLE worker_attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    worker_id UUID REFERENCES project_workers(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    hours_worked DECIMAL(4,2) NOT NULL,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    daily_wage DECIMAL(8,2) NOT NULL,
    overtime_rate DECIMAL(8,2),
    total_payment DECIMAL(8,2) NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid')) DEFAULT 'pending',
    paid_date DATE,
    notes TEXT,
    recorded_by UUID REFERENCES construction_supervisors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ====================================================================================
-- 6. ENHANCED ANALYTICS & NOTIFICATIONS
-- ====================================================================================

-- User analytics tracking
CREATE TABLE user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(12,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Email notification queue
CREATE TABLE email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    template_data JSONB,
    status TEXT CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- System notifications
CREATE TABLE system_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    category TEXT,
    related_entity_type TEXT,
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ====================================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ====================================================================================

-- Global items indexes
CREATE INDEX idx_global_items_barcode ON global_items(barcode);
CREATE INDEX idx_global_items_category ON global_items(category);
CREATE INDEX idx_global_items_brand ON global_items(brand);

-- Store inventory indexes
CREATE INDEX idx_store_inventory_store_id ON store_inventory(store_id);
CREATE INDEX idx_store_inventory_global_item ON store_inventory(global_item_id);
CREATE INDEX idx_store_inventory_active ON store_inventory(is_active) WHERE is_active = true;

-- Commission indexes
CREATE INDEX idx_commissions_referrer ON commissions(referrer_id);
CREATE INDEX idx_commissions_referee ON commissions(referee_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_created ON commissions(created_at);

-- Supervisor indexes
CREATE INDEX idx_supervisors_available ON construction_supervisors(is_available) WHERE is_available = true;
CREATE INDEX idx_supervisors_rating ON construction_supervisors(rating DESC);
CREATE INDEX idx_supervisor_requests_status ON supervisor_requests(status);

-- Contract indexes
CREATE INDEX idx_contracts_project ON construction_contracts(project_id);
CREATE INDEX idx_contracts_supervisor ON construction_contracts(supervisor_id);
CREATE INDEX idx_contracts_status ON construction_contracts(status);

-- Expense indexes
CREATE INDEX idx_expenses_project ON project_expenses(project_id);
CREATE INDEX idx_expenses_supervisor ON project_expenses(supervisor_id);
CREATE INDEX idx_expenses_date ON project_expenses(expense_date);
CREATE INDEX idx_expenses_approval ON project_expenses(approval_status);

-- Analytics indexes
CREATE INDEX idx_user_analytics_user_metric ON user_analytics(user_id, metric_type);
CREATE INDEX idx_user_analytics_period ON user_analytics(period_start, period_end);

-- Notification indexes
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_scheduled ON email_notifications(scheduled_for);
CREATE INDEX idx_system_notifications_user_unread ON system_notifications(user_id, is_read) WHERE is_read = false;

-- ====================================================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ====================================================================================

-- Enable RLS on new tables
ALTER TABLE global_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_import_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_supervisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisor_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;

-- Global items policies (public read for active items)
CREATE POLICY "Anyone can view global items" ON global_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create global items" ON global_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update global items they created" ON global_items FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Store inventory policies
CREATE POLICY "Anyone can view active store inventory" ON store_inventory FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage their inventory" ON store_inventory FOR ALL USING (auth.uid() = store_id);

-- Commission policies
CREATE POLICY "Users can view their own commissions" ON commissions FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "System can create commissions" ON commissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their commission payouts" ON commission_payouts FOR SELECT USING (auth.uid() = user_id);

-- Supervisor policies
CREATE POLICY "Anyone can view available supervisors" ON construction_supervisors FOR SELECT USING (is_available = true AND is_verified = true);
CREATE POLICY "Supervisors can manage their profile" ON construction_supervisors FOR ALL USING (auth.uid() = user_id);

-- Contract policies
CREATE POLICY "Project participants can view contracts" ON construction_contracts FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = (SELECT user_id FROM construction_supervisors WHERE id = supervisor_id));
CREATE POLICY "Project owners can create contracts" ON construction_contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Project participants can update contracts" ON construction_contracts FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = (SELECT user_id FROM construction_supervisors WHERE id = supervisor_id));

-- Expense policies
CREATE POLICY "Project participants can view expenses" ON project_expenses FOR SELECT
USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id) OR 
       auth.uid() = (SELECT user_id FROM construction_supervisors WHERE id = supervisor_id));
CREATE POLICY "Authorized users can create expenses" ON project_expenses FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM projects WHERE id = project_id) OR
    auth.uid() = (SELECT user_id FROM construction_supervisors WHERE id = supervisor_id)
);

-- Notification policies
CREATE POLICY "Users can view their notifications" ON system_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON system_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON system_notifications FOR INSERT WITH CHECK (true);

-- ====================================================================================
-- 9. FUNCTIONS FOR AUTOMATION
-- ====================================================================================

-- Function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(
    p_order_id UUID,
    p_invite_code TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
    v_order_amount DECIMAL(10,2);
    v_referrer_id UUID;
    v_referee_id UUID;
    v_commission_rate DECIMAL(5,4);
BEGIN
    -- Get order details
    SELECT total_amount, user_id INTO v_order_amount, v_referee_id
    FROM orders WHERE id = p_order_id;
    
    -- Get referrer and commission rate from invite code
    IF p_invite_code IS NOT NULL THEN
        SELECT user_id, commission_rate INTO v_referrer_id, v_commission_rate
        FROM invite_codes 
        WHERE code = p_invite_code AND is_active = true;
        
        -- Create commission record
        IF v_referrer_id IS NOT NULL AND v_commission_rate > 0 THEN
            INSERT INTO commissions (
                referrer_id, referee_id, order_id, commission_type,
                commission_rate, order_amount, commission_amount
            ) VALUES (
                v_referrer_id, v_referee_id, p_order_id, 'purchase',
                v_commission_rate, v_order_amount, v_order_amount * v_commission_rate
            );
            
            -- Update invite code usage
            UPDATE invite_codes 
            SET usage_count = usage_count + 1,
                total_commission = total_commission + (v_order_amount * v_commission_rate)
            WHERE code = p_invite_code;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-approve expenses within supervisor limits
CREATE OR REPLACE FUNCTION auto_approve_expense() RETURNS TRIGGER AS $$
DECLARE
    v_spending_limit DECIMAL(10,2);
    v_has_permission BOOLEAN := false;
BEGIN
    -- Check if supervisor has permission for this expense type
    SELECT spending_limit INTO v_spending_limit
    FROM supervisor_permissions sp
    JOIN construction_contracts cc ON cc.id = sp.contract_id
    WHERE sp.supervisor_id = NEW.supervisor_id
    AND sp.permission_type = 'purchase'
    AND sp.is_active = true
    AND cc.project_id = NEW.project_id
    AND (sp.expires_at IS NULL OR sp.expires_at > NOW())
    AND (sp.category_restrictions IS NULL OR NEW.category = ANY(sp.category_restrictions))
    LIMIT 1;
    
    -- Auto-approve if within limit
    IF v_spending_limit IS NOT NULL AND NEW.amount <= v_spending_limit THEN
        NEW.approval_status := 'approved';
        NEW.approved_at := NOW();
        NEW.approved_by := (SELECT user_id FROM construction_supervisors WHERE id = NEW.supervisor_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_approve_expense_trigger
    BEFORE INSERT ON project_expenses
    FOR EACH ROW
    EXECUTE FUNCTION auto_approve_expense();

-- Function to update user analytics
CREATE OR REPLACE FUNCTION update_user_analytics(
    p_user_id UUID,
    p_metric_type TEXT,
    p_value DECIMAL(12,2),
    p_date DATE DEFAULT CURRENT_DATE
) RETURNS void AS $$
BEGIN
    INSERT INTO user_analytics (user_id, metric_type, metric_value, period_start, period_end)
    VALUES (p_user_id, p_metric_type, p_value, p_date, p_date)
    ON CONFLICT (user_id, metric_type, period_start, period_end) 
    DO UPDATE SET 
        metric_value = user_analytics.metric_value + EXCLUDED.metric_value,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ====================================================================================
-- 10. INITIAL DATA & SAMPLE RECORDS
-- ====================================================================================

-- Insert some sample global items for testing
INSERT INTO global_items (barcode, name, description, brand, category, shared_image_url) VALUES
('1234567890123', 'أسمنت أبيض 50 كيلو', 'أسمنت أبيض عالي الجودة للإنشاءات', 'العربية للأسمنت', 'مواد البناء', 'https://example.com/cement.jpg'),
('2345678901234', 'طوب أحمر 20x10x6', 'طوب أحمر للبناء مقاس 20x10x6 سم', 'مصنع الطوب الأحمر', 'مواد البناء', 'https://example.com/brick.jpg'),
('3456789012345', 'حديد تسليح 12 ملم', 'حديد تسليح قطر 12 ملم طول 12 متر', 'حديد الخليج', 'حديد ومعادن', 'https://example.com/rebar.jpg');

-- Insert sample invitation codes for testing
INSERT INTO invite_codes (user_id, code, commission_rate, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'STORE2024', 0.01, true),
('00000000-0000-0000-0000-000000000002', 'BUILD2024', 0.015, true);

COMMIT;
