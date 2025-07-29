
-- Fix 1: Add missing 'city' column to stores table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stores' AND column_name='city') THEN
        ALTER TABLE stores ADD COLUMN city VARCHAR(100) DEFAULT 'الرياض';
        UPDATE stores SET city = 'الرياض' WHERE city IS NULL;
        RAISE NOTICE 'Added city column to stores table';
    ELSE
        RAISE NOTICE 'City column already exists in stores table';
    END IF;
END $$;

-- Fix 2: Add missing 'store_name' column to warranties table  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='warranties' AND column_name='store_name') THEN
        ALTER TABLE warranties ADD COLUMN store_name VARCHAR(255);
        UPDATE warranties SET store_name = 'متجر بناء' WHERE store_name IS NULL;
        RAISE NOTICE 'Added store_name column to warranties table';
    ELSE
        RAISE NOTICE 'Store_name column already exists in warranties table';
    END IF;
END $$;
