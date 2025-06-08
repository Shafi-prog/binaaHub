-- Add project_type column to projects table
ALTER TABLE projects ADD COLUMN project_type VARCHAR(50);

-- Set default value for existing projects
UPDATE projects SET project_type = 'residential' WHERE project_type IS NULL;

-- Add constraints
ALTER TABLE projects ALTER COLUMN project_type SET NOT NULL;
ALTER TABLE projects ADD CONSTRAINT valid_project_type CHECK (
  project_type IN ('residential', 'commercial', 'industrial', 'infrastructure', 'renovation', 'other')
);
