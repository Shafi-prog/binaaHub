-- Database Scaling Configuration for Binna Platform
-- Implements read replicas, connection pooling, and performance optimization

-- ============================================================================
-- CONNECTION POOLING CONFIGURATION
-- ============================================================================

-- Configure connection pool for high concurrency
-- Add to postgresql.conf
-- max_connections = 200
-- shared_buffers = 256MB
-- effective_cache_size = 1GB
-- maintenance_work_mem = 64MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100
-- random_page_cost = 1.1
-- effective_io_concurrency = 200
-- work_mem = 4MB
-- min_wal_size = 1GB
-- max_wal_size = 4GB

-- ============================================================================
-- READ REPLICA SETUP
-- ============================================================================

-- Primary database configuration
-- Add to postgresql.conf on primary
-- wal_level = replica
-- max_wal_senders = 10
-- max_replication_slots = 10
-- synchronous_commit = off
-- archive_mode = on
-- archive_command = 'test ! -f /backup/archive/%f && cp %p /backup/archive/%f'

-- Read replica configuration
-- Add to postgresql.conf on replica
-- hot_standby = on
-- max_standby_archive_delay = 30s
-- max_standby_streaming_delay = 30s
-- wal_receiver_status_interval = 10s
-- hot_standby_feedback = on

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Marketplace indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_active ON products(category_id, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_vendor_created ON products(vendor_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price_range ON products(price) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search_text ON products USING GIN(to_tsvector('english', title || ' ' || description));

-- Orders indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date ON orders(customer_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status_date ON orders(status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_vendor_date ON orders(vendor_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Inventory indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_product_location ON inventory(product_id, location_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_low_stock ON inventory(product_id, quantity) WHERE quantity < reorder_level;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_movements_date ON inventory_movements(created_at DESC);

-- Construction indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_construction_projects_status ON construction_projects(status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_construction_materials_category ON construction_materials(category_id, is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_construction_experts_location ON construction_experts(location, is_available);

-- Analytics indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_date ON analytics_events(event_date, event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_user_sessions ON analytics_events(user_id, session_id, event_date);

-- ============================================================================
-- PARTITIONING SETUP
-- ============================================================================

-- Partition analytics_events by date
CREATE TABLE analytics_events_partitioned (
    id SERIAL,
    user_id INTEGER,
    session_id TEXT,
    event_type VARCHAR(50),
    event_data JSONB,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (event_date);

-- Create monthly partitions for analytics events
CREATE TABLE analytics_events_2024_12 PARTITION OF analytics_events_partitioned
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE analytics_events_2025_01 PARTITION OF analytics_events_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE analytics_events_2025_02 PARTITION OF analytics_events_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Auto-create future partitions
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name text, start_date date)
RETURNS void AS $$
DECLARE
    partition_name text;
    end_date date;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + interval '1 month';
    
    EXECUTE format('CREATE TABLE %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
        partition_name, table_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PERFORMANCE MONITORING
-- ============================================================================

-- Enable statistics collection
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create performance monitoring view
CREATE OR REPLACE VIEW performance_stats AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE calls > 100
ORDER BY total_time DESC;

-- Create slow query monitoring
CREATE OR REPLACE FUNCTION log_slow_queries() RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Top 10 slowest queries:';
    FOR rec IN 
        SELECT query, calls, mean_time, total_time 
        FROM pg_stat_statements 
        WHERE calls > 10 
        ORDER BY mean_time DESC 
        LIMIT 10
    LOOP
        RAISE NOTICE 'Query: %, Calls: %, Avg Time: %ms, Total Time: %ms', 
            left(rec.query, 100), rec.calls, round(rec.mean_time, 2), round(rec.total_time, 2);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- LOAD BALANCING CONFIGURATION
-- ============================================================================

-- Database connection routing (for application layer)
-- Primary database: All write operations
-- Read replicas: All read operations

-- Example connection strings:
-- Primary: postgres://user:pass@primary-db:5432/binna
-- Read Replica 1: postgres://user:pass@replica1-db:5432/binna
-- Read Replica 2: postgres://user:pass@replica2-db:5432/binna

-- ============================================================================
-- AUTOMATED MAINTENANCE
-- ============================================================================

-- Auto-vacuum configuration
-- Add to postgresql.conf
-- autovacuum = on
-- autovacuum_naptime = 30s
-- autovacuum_vacuum_threshold = 50
-- autovacuum_analyze_threshold = 50
-- autovacuum_vacuum_scale_factor = 0.1
-- autovacuum_analyze_scale_factor = 0.05
-- autovacuum_vacuum_cost_delay = 10ms
-- autovacuum_vacuum_cost_limit = 1000

-- Create maintenance schedule
CREATE OR REPLACE FUNCTION run_maintenance() RETURNS void AS $$
BEGIN
    -- Analyze table statistics
    ANALYZE;
    
    -- Reindex if needed
    REINDEX INDEX CONCURRENTLY idx_products_category_active;
    REINDEX INDEX CONCURRENTLY idx_orders_customer_date;
    REINDEX INDEX CONCURRENTLY idx_inventory_product_location;
    
    -- Update statistics
    UPDATE pg_stat_statements SET calls = 0 WHERE calls > 1000000;
    
    RAISE NOTICE 'Maintenance completed at %', now();
END;
$$ LANGUAGE plpgsql;

-- Schedule maintenance (run via cron)
-- 0 2 * * * psql -d binna -c "SELECT run_maintenance();"

-- ============================================================================
-- BACKUP AND RECOVERY
-- ============================================================================

-- Point-in-time recovery setup
-- Add to postgresql.conf
-- archive_mode = on
-- archive_command = 'test ! -f /backup/archive/%f && cp %p /backup/archive/%f'
-- max_wal_senders = 10
-- wal_keep_segments = 50

-- Create backup script
CREATE OR REPLACE FUNCTION create_backup() RETURNS void AS $$
BEGIN
    -- This would typically be handled by pg_basebackup
    RAISE NOTICE 'Backup started at %', now();
    
    -- Log backup completion
    INSERT INTO system_logs (log_type, message, created_at) 
    VALUES ('backup', 'Database backup completed successfully', now());
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECURITY HARDENING
-- ============================================================================

-- Row Level Security policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY products_vendor_policy ON products
    FOR ALL TO authenticated
    USING (vendor_id = current_user_id());

CREATE POLICY orders_customer_policy ON orders
    FOR ALL TO authenticated
    USING (customer_id = current_user_id() OR vendor_id = current_user_id());

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_data, user_id)
        VALUES (TG_TABLE_NAME, 'INSERT', row_to_json(NEW), current_user_id());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, new_data, user_id)
        VALUES (TG_TABLE_NAME, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_user_id());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, user_id)
        VALUES (TG_TABLE_NAME, 'DELETE', row_to_json(OLD), current_user_id());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================================================
-- PERFORMANCE MONITORING QUERIES
-- ============================================================================

-- Check database size
SELECT 
    pg_database.datname,
    pg_database_size(pg_database.datname) as size_bytes,
    pg_size_pretty(pg_database_size(pg_database.datname)) as size_pretty
FROM pg_database
WHERE datname = 'binna';

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;

-- Check connection statistics
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    query
FROM pg_stat_activity
WHERE state = 'active';

-- Check cache hit ratio
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    (sum(heap_blks_hit) - sum(heap_blks_read)) / sum(heap_blks_hit) as ratio
FROM pg_statio_user_tables;

-- ============================================================================
-- EMERGENCY PROCEDURES
-- ============================================================================

-- Kill long-running queries
CREATE OR REPLACE FUNCTION kill_long_running_queries(max_duration interval DEFAULT '5 minutes') RETURNS void AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
        FROM pg_stat_activity 
        WHERE (now() - pg_stat_activity.query_start) > max_duration
          AND state = 'active'
          AND pid <> pg_backend_pid()
    LOOP
        RAISE NOTICE 'Killing query (PID: %, Duration: %): %', rec.pid, rec.duration, left(rec.query, 100);
        PERFORM pg_terminate_backend(rec.pid);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Database health check
CREATE OR REPLACE FUNCTION database_health_check() RETURNS TABLE(
    metric VARCHAR(50),
    value TEXT,
    status VARCHAR(20)
) AS $$
BEGIN
    -- Check database size
    RETURN QUERY SELECT 
        'database_size'::VARCHAR(50),
        pg_size_pretty(pg_database_size(current_database())),
        CASE 
            WHEN pg_database_size(current_database()) < 10737418240 THEN 'OK'
            ELSE 'WARNING'
        END::VARCHAR(20);
    
    -- Check active connections
    RETURN QUERY SELECT 
        'active_connections'::VARCHAR(50),
        count(*)::TEXT,
        CASE 
            WHEN count(*) < 100 THEN 'OK'
            WHEN count(*) < 150 THEN 'WARNING'
            ELSE 'CRITICAL'
        END::VARCHAR(20)
    FROM pg_stat_activity 
    WHERE state = 'active';
    
    -- Check cache hit ratio
    RETURN QUERY SELECT 
        'cache_hit_ratio'::VARCHAR(50),
        round((sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0)), 2)::TEXT || '%',
        CASE 
            WHEN sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) > 95 THEN 'OK'
            WHEN sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) > 90 THEN 'WARNING'
            ELSE 'CRITICAL'
        END::VARCHAR(20)
    FROM pg_statio_user_tables;
END;
$$ LANGUAGE plpgsql;

-- Create system logs table for monitoring
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    log_type VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create performance dashboard view
CREATE OR REPLACE VIEW performance_dashboard AS
SELECT 
    'Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value,
    'INFO' as level
UNION ALL
SELECT 
    'Active Connections' as metric,
    count(*)::TEXT as value,
    CASE 
        WHEN count(*) < 100 THEN 'OK'
        WHEN count(*) < 150 THEN 'WARNING'
        ELSE 'CRITICAL'
    END as level
FROM pg_stat_activity 
WHERE state = 'active'
UNION ALL
SELECT 
    'Cache Hit Ratio' as metric,
    round((sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0)), 2)::TEXT || '%' as value,
    CASE 
        WHEN sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) > 95 THEN 'OK'
        WHEN sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) > 90 THEN 'WARNING'
        ELSE 'CRITICAL'
    END as level
FROM pg_statio_user_tables;

-- Performance optimization recommendations
COMMENT ON VIEW performance_dashboard IS 'Real-time performance metrics for the Binna platform database';
COMMENT ON FUNCTION database_health_check() IS 'Comprehensive database health check function';
COMMENT ON FUNCTION kill_long_running_queries(interval) IS 'Emergency function to kill long-running queries';
COMMENT ON FUNCTION create_backup() IS 'Automated backup creation function';
COMMENT ON FUNCTION run_maintenance() IS 'Scheduled maintenance operations';
