-- Business Enhancement Features

-- 1. Product Categories and Attributes
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    parent_id UUID REFERENCES product_categories(id),
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Store Analytics
CREATE TABLE IF NOT EXISTS store_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0,
    average_order_value NUMERIC DEFAULT 0,
    conversion_rate FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer Support System
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    store_id UUID REFERENCES stores(id),
    order_id UUID REFERENCES orders(id),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Store Verification System
CREATE TABLE IF NOT EXISTS store_verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')),
    business_license TEXT NOT NULL,
    commercial_register TEXT,
    tax_certificate TEXT,
    owner_id TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Reports (Quality/Counterfeit)
CREATE TABLE IF NOT EXISTS product_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    reported_by UUID REFERENCES auth.users(id),
    report_type VARCHAR(50) CHECK (report_type IN ('counterfeit', 'quality', 'misleading', 'inappropriate')),
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Automated Notifications Settings
CREATE TABLE IF NOT EXISTS notification_settings (
    user_id UUID REFERENCES auth.users(id),
    setting_type VARCHAR(50),
    channel VARCHAR(20) CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, setting_type, channel)
);

-- 7. Store Operating Hours
CREATE TABLE IF NOT EXISTS store_operating_hours (
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (store_id, day_of_week)
);

-- 8. Customer Segments
CREATE TABLE IF NOT EXISTS customer_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    criteria JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    segment_id UUID REFERENCES customer_segments(id),
    content JSONB,
    schedule_time TIMESTAMPTZ,
    status VARCHAR(20) CHECK (status IN ('draft', 'scheduled', 'running', 'completed', 'cancelled')),
    metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Loyalty Program
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    points_per_currency NUMERIC DEFAULT 1,
    minimum_points_redemption INTEGER,
    points_value_currency NUMERIC,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_loyalty_points (
    user_id UUID REFERENCES auth.users(id),
    store_id UUID REFERENCES stores(id),
    points_balance INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    total_points_spent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, store_id)
);

-- 11. Order Items Table (for detailed order tracking)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    total_price NUMERIC GENERATED ALWAYS AS (quantity * price) STORED,
    has_warranty BOOLEAN DEFAULT false,
    warranty_duration_months INTEGER,
    warranty_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create trigger to update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM order_items
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    )
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_order_total_trigger ON order_items;
CREATE TRIGGER update_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

-- Create automatic warranty function
CREATE OR REPLACE FUNCTION create_warranty_for_item()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.has_warranty = true AND NEW.warranty_duration_months IS NOT NULL THEN
        INSERT INTO warranties (
            user_id,
            product_id,
            order_item_id,
            warranty_start_date,
            warranty_end_date,
            warranty_duration_months,
            status,
            notes
        ) VALUES (
            (SELECT o.user_id FROM orders o WHERE o.id = NEW.order_id),
            NEW.product_id,
            NEW.id,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + (NEW.warranty_duration_months || ' months')::INTERVAL,
            NEW.warranty_duration_months,
            'active',
            NEW.warranty_notes
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_warranty_trigger ON order_items;
CREATE TRIGGER create_warranty_trigger
AFTER INSERT ON order_items
FOR EACH ROW
WHEN (NEW.has_warranty = true)
EXECUTE FUNCTION create_warranty_for_item();

-- Add additional indexes
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_store_analytics_store_date ON store_analytics(store_id, date);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_store ON support_tickets(store_id);
CREATE INDEX IF NOT EXISTS idx_product_reports_product ON product_reports(product_id);
CREATE INDEX IF NOT EXISTS idx_store_verification_status ON store_verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_store ON marketing_campaigns(store_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_balance ON customer_loyalty_points(points_balance);

-- Update triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_product_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_product_categories_updated_at
      BEFORE UPDATE ON product_categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_tickets_updated_at'
  ) THEN
    CREATE TRIGGER update_support_tickets_updated_at
      BEFORE UPDATE ON support_tickets
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_store_verification_updated_at'
  ) THEN
    CREATE TRIGGER update_store_verification_updated_at
      BEFORE UPDATE ON store_verification_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_notification_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_notification_settings_updated_at
      BEFORE UPDATE ON notification_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_store_operating_hours_updated_at'
  ) THEN
    CREATE TRIGGER update_store_operating_hours_updated_at
      BEFORE UPDATE ON store_operating_hours
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_customer_segments_updated_at'
  ) THEN
    CREATE TRIGGER update_customer_segments_updated_at
      BEFORE UPDATE ON customer_segments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketing_campaigns_updated_at'
  ) THEN
    CREATE TRIGGER update_marketing_campaigns_updated_at
      BEFORE UPDATE ON marketing_campaigns
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_loyalty_programs_updated_at'
  ) THEN
    CREATE TRIGGER update_loyalty_programs_updated_at
      BEFORE UPDATE ON loyalty_programs
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_customer_loyalty_points_updated_at'
  ) THEN
    CREATE TRIGGER update_customer_loyalty_points_updated_at
      BEFORE UPDATE ON customer_loyalty_points
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
