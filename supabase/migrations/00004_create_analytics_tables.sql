-- Create store_views table to track store views
CREATE TABLE IF NOT EXISTS store_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  source TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  budget DECIMAL(12,2),
  spend DECIMAL(12,2) DEFAULT 0,
  target_audience JSONB,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_segments table
CREATE TABLE IF NOT EXISTS customer_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB,
  customer_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  average_order_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_store_metrics table for rollup analytics
CREATE TABLE IF NOT EXISTS daily_store_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  date DATE NOT NULL,
  total_sales DECIMAL(12,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  customer_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  average_order_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (store_id, date)
);

-- Create store_revenue_by_product view
CREATE OR REPLACE VIEW store_revenue_by_product AS
SELECT 
  p.id as product_id,
  p.store_id,
  p.name as product_name,
  COUNT(DISTINCT o.id) as order_count,
  SUM(oi.quantity) as quantity_sold,
  SUM(oi.quantity * oi.price) as revenue,
  AVG(oi.price) as average_price
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY p.id, p.store_id, p.name;

-- Function to calculate and store daily metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(
  store_id UUID,
  calc_date DATE DEFAULT CURRENT_DATE
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO daily_store_metrics (
    store_id,
    date,
    total_sales,
    order_count,
    customer_count,
    view_count,
    conversion_rate,
    average_order_value
  )
  SELECT 
    store_id,
    calc_date,
    COALESCE(SUM(o.total_amount), 0) as total_sales,
    COUNT(DISTINCT o.id) as order_count,
    COUNT(DISTINCT o.user_id) as customer_count,
    COUNT(DISTINCT sv.id) as view_count,
    CASE 
      WHEN COUNT(DISTINCT sv.id) > 0 
      THEN (COUNT(DISTINCT o.id)::DECIMAL / COUNT(DISTINCT sv.id)) * 100
      ELSE 0 
    END as conversion_rate,
    CASE 
      WHEN COUNT(DISTINCT o.id) > 0 
      THEN COALESCE(SUM(o.total_amount), 0) / COUNT(DISTINCT o.id)
      ELSE 0 
    END as average_order_value
  FROM stores s
  LEFT JOIN orders o ON o.store_id = s.id 
    AND DATE(o.created_at) = calc_date
    AND o.status = 'completed'
  LEFT JOIN store_views sv ON sv.store_id = s.id 
    AND DATE(sv.created_at) = calc_date
  WHERE s.id = store_id
  GROUP BY s.id
  ON CONFLICT (store_id, date) 
  DO UPDATE SET
    total_sales = EXCLUDED.total_sales,
    order_count = EXCLUDED.order_count,
    customer_count = EXCLUDED.customer_count,
    view_count = EXCLUDED.view_count,
    conversion_rate = EXCLUDED.conversion_rate,
    average_order_value = EXCLUDED.average_order_value,
    updated_at = NOW();
END;
$$;

-- Trigger to update daily metrics when orders are updated
CREATE OR REPLACE FUNCTION trigger_update_daily_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM calculate_daily_metrics(NEW.store_id, DATE(NEW.created_at));
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_daily_metrics_trigger
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION trigger_update_daily_metrics();

-- Trigger to update daily metrics when views are recorded
CREATE TRIGGER store_views_daily_metrics_trigger
AFTER INSERT ON store_views
FOR EACH ROW
EXECUTE FUNCTION trigger_update_daily_metrics();
