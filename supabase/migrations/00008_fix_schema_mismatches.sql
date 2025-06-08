-- Migration: Fix schema mismatches and add missing columns
-- This migration ensures the database schema matches the application code expectations

-- Add missing currency column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'currency') THEN
        ALTER TABLE projects ADD COLUMN currency VARCHAR(3) DEFAULT 'SAR';
    END IF;
END $$;

-- Ensure budget column exists (rename from budget_estimate if needed)
DO $$ 
BEGIN
    -- Check if budget_estimate exists but budget doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'projects' AND column_name = 'budget_estimate')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'projects' AND column_name = 'budget') THEN
        -- Rename budget_estimate to budget
        ALTER TABLE projects RENAME COLUMN budget_estimate TO budget;
    END IF;
    
    -- If budget doesn't exist at all, create it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'budget') THEN
        ALTER TABLE projects ADD COLUMN budget DECIMAL(12,2);
    END IF;
END $$;

-- Ensure address column exists (rename from location if needed)  
DO $$ 
BEGIN
    -- If address doesn't exist but location does, keep both for compatibility
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'address') THEN
        ALTER TABLE projects ADD COLUMN address TEXT;
        
        -- Copy location data to address if location exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'location') THEN
            UPDATE projects SET address = location WHERE location IS NOT NULL AND address IS NULL;
        END IF;
    END IF;
END $$;

-- Ensure end_date column exists (rename from expected_completion_date if needed)
DO $$ 
BEGIN
    -- If end_date doesn't exist but expected_completion_date does, keep both for compatibility
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'end_date') THEN
        ALTER TABLE projects ADD COLUMN end_date DATE;
        
        -- Copy expected_completion_date data to end_date if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'expected_completion_date') THEN
            UPDATE projects SET end_date = expected_completion_date::DATE 
            WHERE expected_completion_date IS NOT NULL AND end_date IS NULL;
        END IF;
    END IF;
END $$;

-- Add missing commonly used columns
DO $$ 
BEGIN
    -- Progress percentage
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'progress_percentage') THEN
        ALTER TABLE projects ADD COLUMN progress_percentage INTEGER DEFAULT 0;
    END IF;
    
    -- Active status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'is_active') THEN
        ALTER TABLE projects ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Actual cost
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'actual_cost') THEN
        ALTER TABLE projects ADD COLUMN actual_cost DECIMAL(12,2) DEFAULT 0;
    END IF;
END $$;

-- Create useful indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);

-- Add constraints to ensure data quality
ALTER TABLE projects 
ADD CONSTRAINT chk_projects_budget_positive 
CHECK (budget IS NULL OR budget >= 0);

ALTER TABLE projects 
ADD CONSTRAINT chk_projects_actual_cost_positive 
CHECK (actual_cost >= 0);

ALTER TABLE projects 
ADD CONSTRAINT chk_projects_progress_percentage 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Update any NULL values to defaults
UPDATE projects SET 
    currency = 'SAR' 
WHERE currency IS NULL;

UPDATE projects SET 
    progress_percentage = 0 
WHERE progress_percentage IS NULL;

UPDATE projects SET 
    is_active = true 
WHERE is_active IS NULL;

UPDATE projects SET 
    actual_cost = 0 
WHERE actual_cost IS NULL;

-- Add helpful comments
COMMENT ON TABLE projects IS 'Main projects table with standardized schema';
COMMENT ON COLUMN projects.budget IS 'Project budget in the specified currency';
COMMENT ON COLUMN projects.address IS 'Project address/location';
COMMENT ON COLUMN projects.end_date IS 'Project completion date';
COMMENT ON COLUMN projects.currency IS 'Currency code (e.g., SAR, USD)';

-- Create a view for backward compatibility if needed
CREATE OR REPLACE VIEW projects_legacy AS
SELECT 
    *
FROM projects;
