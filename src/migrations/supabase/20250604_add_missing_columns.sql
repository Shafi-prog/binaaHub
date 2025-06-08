-- Add missing columns to projects table
-- File: 20250604_add_missing_columns.sql

-- Add the missing columns that are causing the form submission errors
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS region TEXT;  
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Saudi Arabia';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add constraints
ALTER TABLE public.projects ADD CONSTRAINT projects_priority_check 
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_region ON public.projects(region);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON public.projects(is_active);

-- Update existing records to have default values
UPDATE public.projects SET 
  country = COALESCE(country, 'Saudi Arabia'),
  priority = COALESCE(priority, 'medium'),
  is_active = COALESCE(is_active, true);
