-- Add for-sale functionality to projects table
-- This migration adds the necessary columns to support selling completed projects

BEGIN;

-- Add for-sale related columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS for_sale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS advertisement_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS sale_price DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS sale_description TEXT;

-- Create unique constraint on advertisement_number when not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_advertisement_number_unique 
ON public.projects(advertisement_number) 
WHERE advertisement_number IS NOT NULL;

-- Add check constraint to ensure advertisement_number is required when for_sale is true
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_projects_for_sale_requires_ad_number'
          AND conrelid = 'projects'::regclass
    ) THEN
        ALTER TABLE projects
        ADD CONSTRAINT chk_projects_for_sale_requires_ad_number CHECK (
            NOT for_sale OR (for_sale AND advertisement_number IS NOT NULL AND advertisement_number != '')
        );
    END IF;
END $$;

-- Add check constraint to ensure sale_price is positive when provided
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_projects_sale_price_positive'
          AND conrelid = 'projects'::regclass
    ) THEN
        ALTER TABLE projects
        ADD CONSTRAINT chk_projects_sale_price_positive CHECK (
            sale_price IS NULL OR sale_price >= 0
        );
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_for_sale ON public.projects(for_sale) WHERE for_sale = true;
CREATE INDEX IF NOT EXISTS idx_projects_status_for_sale ON public.projects(status, for_sale) WHERE for_sale = true;
CREATE INDEX IF NOT EXISTS idx_projects_advertisement_number ON public.projects(advertisement_number) WHERE advertisement_number IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.projects.for_sale IS 'Whether the completed project is available for sale';
COMMENT ON COLUMN public.projects.advertisement_number IS 'Unique advertisement number required when project is for sale';
COMMENT ON COLUMN public.projects.sale_price IS 'Sale price in the project currency';
COMMENT ON COLUMN public.projects.sale_description IS 'Marketing description for the project when listed for sale';

-- Update existing completed projects to allow them to be marked for sale if needed
-- (This is just a placeholder - in practice, this would be done through the UI)

COMMIT;

-- Display success message
SELECT 'For-sale fields added to projects table successfully!' as result;
