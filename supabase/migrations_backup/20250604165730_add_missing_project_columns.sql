-- Add missing columns to projects table that are required by the form
-- This fixes the "Could not find the 'city' column" and related errors

-- Add the missing columns that are causing the form submission errors
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS region TEXT;  
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Saudi Arabia';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add constraints
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'projects_priority_check'
          AND conrelid = 'projects'::regclass
    ) THEN
        ALTER TABLE projects
        ADD CONSTRAINT projects_priority_check CHECK (priority IN ('low', 'medium', 'high'));
    END IF;
END $$;

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