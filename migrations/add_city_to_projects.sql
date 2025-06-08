-- Add city column to projects table if it does not exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS city text;
