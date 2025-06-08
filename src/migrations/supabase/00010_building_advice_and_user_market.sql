-- Building Advice Table
CREATE TABLE IF NOT EXISTS building_advice (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- User Extra Materials Table (for selling unused items)
CREATE TABLE IF NOT EXISTS user_extra_materials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Store Communication Table (for order support)
CREATE TABLE IF NOT EXISTS store_communications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
    order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
    message text NOT NULL,
    status text DEFAULT 'open',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add index for fast lookup
CREATE INDEX IF NOT EXISTS idx_building_advice_created_by ON building_advice(created_by);
CREATE INDEX IF NOT EXISTS idx_user_extra_materials_user_id ON user_extra_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_store_communications_user_id ON store_communications(user_id);
CREATE INDEX IF NOT EXISTS idx_store_communications_store_id ON store_communications(store_id);
