-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Building Advice Table
CREATE TABLE IF NOT EXISTS building_advice (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    content text NOT NULL,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- User Extra Materials Table (for selling unused items)
CREATE TABLE IF NOT EXISTS user_extra_materials (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    quantity int,
    price numeric,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add index for fast lookup
CREATE INDEX IF NOT EXISTS idx_building_advice_created_by ON building_advice(created_by);
CREATE INDEX IF NOT EXISTS idx_user_extra_materials_user_id ON user_extra_materials(user_id);
