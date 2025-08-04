-- ========================================
-- BinaaHub Platform Transformation
-- Database Migration: Project-Centric Schema
-- Version: 1.0.0
-- Created: August 4, 2025
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CORE PROJECT TABLES
-- ========================================

-- Projects table (Central entity)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('residential', 'commercial', 'renovation')) DEFAULT 'residential',
    budget DECIMAL(15,2),
    start_date DATE,
    expected_completion DATE,
    actual_completion DATE,
    status VARCHAR(20) CHECK (status IN ('planning', 'active', 'completed', 'on_hold', 'cancelled')) DEFAULT 'planning',
    location TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    total_area DECIMAL(10,2),
    construction_type VARCHAR(100),
    permit_number VARCHAR(100),
    contractor_id UUID REFERENCES auth.users(id),
    architect_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project stages table
CREATE TABLE IF NOT EXISTS project_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    budget_allocated DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    notes TEXT,
    dependencies UUID[], -- Array of stage IDs this stage depends on
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, order_index)
);

-- Stage images table (Photo documentation)
CREATE TABLE IF NOT EXISTS stage_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID REFERENCES project_stages(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    image_type VARCHAR(20) CHECK (image_type IN ('progress', 'before', 'after', 'issue', 'inspection', 'material')) DEFAULT 'progress',
    uploaded_by UUID REFERENCES auth.users(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size_bytes INTEGER,
    image_width INTEGER,
    image_height INTEGER,
    metadata JSONB DEFAULT '{}'
);

-- Project materials table (Inventory tracking)
CREATE TABLE IF NOT EXISTS project_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES project_stages(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    supplier_name VARCHAR(255),
    supplier_contact TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    sku VARCHAR(100),
    purchase_date DATE,
    delivery_date DATE,
    warranty_period_months INTEGER,
    warranty_start_date DATE,
    warranty_document_url TEXT,
    receipt_url TEXT,
    status VARCHAR(20) CHECK (status IN ('planned', 'ordered', 'delivered', 'installed', 'warranty_expired')) DEFAULT 'planned',
    location_in_project TEXT,
    notes TEXT,
    marketplace_order_id UUID, -- Link to marketplace orders
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project team table (Team management)
CREATE TABLE IF NOT EXISTS project_team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('owner', 'supervisor', 'contractor', 'architect', 'engineer', 'laborer', 'inspector')) NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(8,2),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'pending', 'rejected', 'completed')) DEFAULT 'pending',
    invitation_sent_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE,
    performance_rating DECIMAL(3,2), -- 0.00 to 5.00
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Project expenses table (Financial tracking)
CREATE TABLE IF NOT EXISTS project_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES project_stages(id) ON DELETE SET NULL,
    material_id UUID REFERENCES project_materials(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL, -- 'materials', 'labor', 'equipment', 'permits', 'utilities', 'other'
    subcategory VARCHAR(100),
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50), -- 'cash', 'credit_card', 'bank_transfer', 'check'
    vendor_name VARCHAR(255),
    receipt_url TEXT,
    invoice_number VARCHAR(100),
    is_budgeted BOOLEAN DEFAULT FALSE,
    is_reimbursable BOOLEAN DEFAULT FALSE,
    tax_amount DECIMAL(12,2),
    notes TEXT,
    recorded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project activities table (Activity feed)
CREATE TABLE IF NOT EXISTS project_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'stage_started', 'stage_completed', 'material_added', 'expense_recorded', 'team_member_added', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}', -- Additional data specific to activity type
    is_milestone BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) CHECK (visibility IN ('public', 'team', 'owner_only')) DEFAULT 'team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project documents table (Document management)
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES project_stages(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    document_type VARCHAR(50), -- 'contract', 'permit', 'blueprint', 'invoice', 'warranty', 'inspection_report'
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    original_filename VARCHAR(255),
    metadata JSONB DEFAULT '{}'
);

-- ========================================
-- ENHANCED EXISTING TABLES
-- ========================================

-- Add project linking to orders table (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        -- Add project_id column to orders if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'project_id') THEN
            ALTER TABLE orders ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
        END IF;
        
        -- Add stage_id column to orders if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'stage_id') THEN
            ALTER TABLE orders ADD COLUMN stage_id UUID REFERENCES project_stages(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- Add project linking to marketplace_orders table (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'marketplace_orders') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_orders' AND column_name = 'project_id') THEN
            ALTER TABLE marketplace_orders ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Project stages indexes
CREATE INDEX IF NOT EXISTS idx_project_stages_project_id ON project_stages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_stages_status ON project_stages(status);
CREATE INDEX IF NOT EXISTS idx_project_stages_order_index ON project_stages(project_id, order_index);

-- Stage images indexes
CREATE INDEX IF NOT EXISTS idx_stage_images_stage_id ON stage_images(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_images_project_id ON stage_images(project_id);
CREATE INDEX IF NOT EXISTS idx_stage_images_upload_date ON stage_images(upload_date);

-- Project materials indexes
CREATE INDEX IF NOT EXISTS idx_project_materials_project_id ON project_materials(project_id);
CREATE INDEX IF NOT EXISTS idx_project_materials_stage_id ON project_materials(stage_id);
CREATE INDEX IF NOT EXISTS idx_project_materials_category ON project_materials(category);
CREATE INDEX IF NOT EXISTS idx_project_materials_status ON project_materials(status);

-- Project team indexes
CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON project_team(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user_id ON project_team(user_id);
CREATE INDEX IF NOT EXISTS idx_project_team_role ON project_team(role);
CREATE INDEX IF NOT EXISTS idx_project_team_status ON project_team(status);

-- Project expenses indexes
CREATE INDEX IF NOT EXISTS idx_project_expenses_project_id ON project_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_project_expenses_stage_id ON project_expenses(stage_id);
CREATE INDEX IF NOT EXISTS idx_project_expenses_category ON project_expenses(category);
CREATE INDEX IF NOT EXISTS idx_project_expenses_expense_date ON project_expenses(expense_date);

-- Project activities indexes
CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON project_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_user_id ON project_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_created_at ON project_activities(created_at);

-- Project documents indexes
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_stage_id ON project_documents(stage_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_document_type ON project_documents(document_type);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all project tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        id IN (
            SELECT project_id FROM project_team 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects" ON projects
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects" ON projects
    FOR DELETE USING (owner_id = auth.uid());

-- Project stages policies
CREATE POLICY "Team members can view project stages" ON project_stages
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Project owners and supervisors can manage stages" ON project_stages
    FOR ALL USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team 
            WHERE user_id = auth.uid() AND role IN ('supervisor', 'contractor') AND status = 'active'
        )
    );

-- Stage images policies
CREATE POLICY "Team members can view stage images" ON stage_images
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can upload stage images" ON stage_images
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid() AND
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Project materials policies
CREATE POLICY "Team members can view project materials" ON project_materials
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Project owners can manage materials" ON project_materials
    FOR ALL USING (
        project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid())
    );

-- Project team policies
CREATE POLICY "Team members can view project team" ON project_team
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Project owners can manage team" ON project_team
    FOR ALL USING (
        project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid())
    );

-- Project expenses policies
CREATE POLICY "Team members can view project expenses" ON project_expenses
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Authorized users can record expenses" ON project_expenses
    FOR INSERT WITH CHECK (
        recorded_by = auth.uid() AND
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team 
            WHERE user_id = auth.uid() AND role IN ('owner', 'supervisor', 'contractor') AND status = 'active'
        )
    );

-- Project activities policies
CREATE POLICY "Team members can view project activities" ON project_activities
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can create activities" ON project_activities
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Project documents policies
CREATE POLICY "Team members can view project documents" ON project_documents
    FOR SELECT USING (
        is_public = true OR
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can upload documents" ON project_documents
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid() AND
        project_id IN (
            SELECT id FROM projects WHERE owner_id = auth.uid()
            UNION
            SELECT project_id FROM project_team WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_stages_updated_at BEFORE UPDATE ON project_stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_materials_updated_at BEFORE UPDATE ON project_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_team_updated_at BEFORE UPDATE ON project_team
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_expenses_updated_at BEFORE UPDATE ON project_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create default project stages
CREATE OR REPLACE FUNCTION create_default_project_stages(project_id UUID, project_type VARCHAR)
RETURNS VOID AS $$
DECLARE
    stage_names TEXT[];
    stage_name TEXT;
    stage_order INTEGER := 1;
BEGIN
    -- Define default stages based on project type
    IF project_type = 'residential' THEN
        stage_names := ARRAY[
            'Planning & Permits',
            'Site Preparation',
            'Foundation',
            'Framing',
            'Roofing',
            'Plumbing & Electrical',
            'Insulation & Drywall',
            'Flooring',
            'Interior Finishing',
            'Exterior Finishing',
            'Final Inspection'
        ];
    ELSIF project_type = 'commercial' THEN
        stage_names := ARRAY[
            'Planning & Design',
            'Permits & Approvals',
            'Site Preparation',
            'Foundation & Structure',
            'Building Envelope',
            'MEP Systems',
            'Interior Build-out',
            'Exterior Finishing',
            'Testing & Commissioning',
            'Final Inspection & Handover'
        ];
    ELSE -- renovation
        stage_names := ARRAY[
            'Planning & Design',
            'Permits',
            'Demolition',
            'Structural Work',
            'MEP Updates',
            'Insulation & Drywall',
            'Flooring & Finishes',
            'Final Touches',
            'Cleanup & Inspection'
        ];
    END IF;

    -- Create stages
    FOREACH stage_name IN ARRAY stage_names
    LOOP
        INSERT INTO project_stages (project_id, name, order_index, status)
        VALUES (project_id, stage_name, stage_order, 'pending');
        stage_order := stage_order + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default stages when a project is created
CREATE OR REPLACE FUNCTION trigger_create_default_stages()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_project_stages(NEW.id, NEW.type);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_stages_trigger
    AFTER INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_default_stages();

-- ========================================
-- SAMPLE DATA (Optional)
-- ========================================

-- Insert sample project types and categories
INSERT INTO project_materials (project_id, name, category, subcategory, quantity, unit, unit_cost, total_cost, status)
SELECT 
    p.id,
    'Sample Material',
    'Construction',
    'Structural',
    100,
    'units',
    10.00,
    1000.00,
    'planned'
FROM projects p
LIMIT 0; -- Remove LIMIT 0 to actually insert sample data

-- ========================================
-- VIEWS FOR REPORTING
-- ========================================

-- Project overview view
CREATE OR REPLACE VIEW project_overview AS
SELECT 
    p.id,
    p.name,
    p.type,
    p.status,
    p.budget,
    p.start_date,
    p.expected_completion,
    p.actual_completion,
    COALESCE(pe.total_expenses, 0) as total_expenses,
    COALESCE(pe.total_expenses, 0) - COALESCE(p.budget, 0) as budget_variance,
    ps.total_stages,
    ps.completed_stages,
    CASE 
        WHEN ps.total_stages > 0 THEN (ps.completed_stages::DECIMAL / ps.total_stages::DECIMAL * 100)
        ELSE 0 
    END as completion_percentage,
    pt.team_count
FROM projects p
LEFT JOIN (
    SELECT 
        project_id,
        SUM(amount) as total_expenses
    FROM project_expenses
    GROUP BY project_id
) pe ON p.id = pe.project_id
LEFT JOIN (
    SELECT 
        project_id,
        COUNT(*) as total_stages,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_stages
    FROM project_stages
    GROUP BY project_id
) ps ON p.id = ps.project_id
LEFT JOIN (
    SELECT 
        project_id,
        COUNT(*) as team_count
    FROM project_team
    WHERE status = 'active'
    GROUP BY project_id
) pt ON p.id = pt.project_id;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'BinaaHub Project-Centric Schema Migration Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Created Tables:';
    RAISE NOTICE '- projects (main project entity)';
    RAISE NOTICE '- project_stages (construction phases)';
    RAISE NOTICE '- stage_images (photo documentation)';
    RAISE NOTICE '- project_materials (inventory tracking)';
    RAISE NOTICE '- project_team (team management)';
    RAISE NOTICE '- project_expenses (financial tracking)';
    RAISE NOTICE '- project_activities (activity feed)';
    RAISE NOTICE '- project_documents (document management)';
    RAISE NOTICE '';
    RAISE NOTICE 'Features Enabled:';
    RAISE NOTICE '- Row Level Security (RLS) on all tables';
    RAISE NOTICE '- Automatic default stage creation';
    RAISE NOTICE '- Comprehensive indexing for performance';
    RAISE NOTICE '- Project overview reporting view';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Run application migration scripts';
    RAISE NOTICE '2. Test project creation and management';
    RAISE NOTICE '3. Verify RLS policies with different user roles';
    RAISE NOTICE '4. Import existing data if applicable';
    RAISE NOTICE '========================================';
END $$;
