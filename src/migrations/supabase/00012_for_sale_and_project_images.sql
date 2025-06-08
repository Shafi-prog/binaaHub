-- Migration: Add 'for_sale' column to projects and create project_images table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS for_sale BOOLEAN DEFAULT false;
COMMENT ON COLUMN public.projects.for_sale IS 'Whether the project is marked as for sale';

CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
COMMENT ON TABLE public.project_images IS 'Stores multiple images for each project';
