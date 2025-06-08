-- Create projects table for construction projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) DEFAULT 'residential', -- villa, apartment, commercial, etc.
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);
