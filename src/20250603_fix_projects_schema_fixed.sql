-- Add missing columns to projects table to match form expectations
-- This fixes the "Could not find the 'city' column" error

-- Add missing location columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Saudi Arabia';

-- Add missing project management columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Note: Skipping date column type changes as they conflict with existing views/rules
-- The form will work with TIMESTAMPTZ columns as well

-- Update existing records to have default values
UPDATE public.projects SET 
  country = 'Saudi Arabia' WHERE country IS NULL;
UPDATE public.projects SET 
  priority = 'medium' WHERE priority IS NULL;
UPDATE public.projects SET 
  is_active = true WHERE is_active IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_region ON public.projects(region);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON public.projects(is_active);

-- Update the projects table to have the correct schema
COMMENT ON TABLE public.projects IS 'Construction projects with complete location and management fields';
COMMENT ON COLUMN public.projects.city IS 'Project city location';
COMMENT ON COLUMN public.projects.region IS 'Project region location';
COMMENT ON COLUMN public.projects.district IS 'Project district location';
COMMENT ON COLUMN public.projects.country IS 'Project country location (default: Saudi Arabia)';
COMMENT ON COLUMN public.projects.priority IS 'Project priority level (low, medium, high, urgent)';
COMMENT ON COLUMN public.projects.is_active IS 'Whether the project is currently active';
COMMENT ON COLUMN public.projects.image_url IS 'URL to project image/photo';
