-- Connect orders with projects and add warranty tracking
ALTER TABLE orders
ADD COLUMN project_id UUID REFERENCES projects(id) NULL,
ADD COLUMN has_warranty BOOLEAN DEFAULT false,
ADD COLUMN warranty_duration_months INTEGER NULL,
ADD COLUMN warranty_notes TEXT NULL,
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add tracking for order items
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    has_warranty BOOLEAN DEFAULT false,
    warranty_duration_months INTEGER NULL,
    warranty_notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Add indexes for performance
CREATE INDEX idx_orders_project_id ON orders(project_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Create trigger to automatically update order total amount
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT SUM(total_price)
        FROM order_items
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

-- Add automatic warranty creation
CREATE OR REPLACE FUNCTION create_warranty_for_item()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.has_warranty = true THEN
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

CREATE TRIGGER create_warranty_trigger
AFTER INSERT ON order_items
FOR EACH ROW
WHEN (NEW.has_warranty = true)
EXECUTE FUNCTION create_warranty_for_item();
