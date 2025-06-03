

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_daily_metrics"("store_id" "uuid", "calc_date" "date" DEFAULT CURRENT_DATE) RETURNS "void"
    LANGUAGE "plpgsql"
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


ALTER FUNCTION "public"."calculate_daily_metrics"("store_id" "uuid", "calc_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_warranty_for_item"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."create_warranty_for_item"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_update_daily_metrics"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  PERFORM calculate_daily_metrics(NEW.store_id, DATE(NEW.created_at));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_update_daily_metrics"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_order_total"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."update_order_total"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."customer_loyalty_points" (
    "user_id" "uuid" NOT NULL,
    "store_id" "uuid" NOT NULL,
    "points_balance" integer DEFAULT 0,
    "total_points_earned" integer DEFAULT 0,
    "total_points_spent" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customer_loyalty_points" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customer_segments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "criteria" "jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customer_segments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_store_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "total_sales" numeric(12,2) DEFAULT 0,
    "order_count" integer DEFAULT 0,
    "customer_count" integer DEFAULT 0,
    "view_count" integer DEFAULT 0,
    "conversion_rate" numeric(5,2) DEFAULT 0,
    "average_order_value" numeric(12,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_store_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invite_code_usages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "code" "text",
    "used_by" "uuid",
    "order_id" "uuid",
    "commission_earned" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."invite_code_usages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invite_codes" (
    "user_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "usage_count" integer DEFAULT 0,
    "total_commission" double precision DEFAULT 0,
    "max_uses" integer DEFAULT 100,
    "expiry_date" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."invite_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loyalty_programs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "points_per_currency" numeric DEFAULT 1,
    "minimum_points_redemption" integer,
    "points_value_currency" numeric,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."loyalty_programs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."marketing_campaigns" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "type" character varying(50),
    "segment_id" "uuid",
    "content" "jsonb",
    "schedule_time" timestamp with time zone,
    "status" character varying(20),
    "metrics" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "marketing_campaigns_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'scheduled'::character varying, 'running'::character varying, 'completed'::character varying, 'cancelled'::character varying])::"text"[]))),
    CONSTRAINT "marketing_campaigns_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['email'::character varying, 'sms'::character varying, 'push'::character varying, 'in_app'::character varying])::"text"[])))
);


ALTER TABLE "public"."marketing_campaigns" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_settings" (
    "user_id" "uuid" NOT NULL,
    "setting_type" character varying(50) NOT NULL,
    "channel" character varying(20) NOT NULL,
    "is_enabled" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notification_settings_channel_check" CHECK ((("channel")::"text" = ANY ((ARRAY['email'::character varying, 'sms'::character varying, 'push'::character varying, 'in_app'::character varying])::"text"[])))
);


ALTER TABLE "public"."notification_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "notification_type" character varying(50),
    "is_read" boolean DEFAULT false,
    "link" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "order_id" "uuid",
    "product_id" "uuid",
    "quantity" integer NOT NULL,
    "price" numeric NOT NULL,
    "total_price" numeric GENERATED ALWAYS AS ((("quantity")::numeric * "price")) STORED,
    "has_warranty" boolean DEFAULT false,
    "warranty_duration_months" integer,
    "warranty_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "order_number" character varying(50) NOT NULL,
    "project_id" "uuid",
    "store_id" "uuid",
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "payment_status" character varying(20) DEFAULT 'pending'::character varying,
    "total_amount" numeric NOT NULL,
    "subtotal" numeric NOT NULL,
    "tax_amount" numeric DEFAULT 0,
    "shipping_amount" numeric DEFAULT 0,
    "discount_amount" numeric DEFAULT 0,
    "currency" character varying(3) DEFAULT 'SAR'::character varying,
    "delivery_type" character varying(20) DEFAULT 'standard'::character varying,
    "delivery_address_id" "uuid",
    "delivery_date" "date",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "shipping_provider_id" "uuid",
    "shipping_tracking_number" character varying(100),
    "shipping_status" character varying(50) DEFAULT 'pending'::character varying,
    "shipping_address" "jsonb",
    "from_lat" double precision,
    "from_lng" double precision,
    "to_lat" double precision,
    "to_lng" double precision,
    CONSTRAINT "delivery_type_check" CHECK ((("delivery_type")::"text" = ANY ((ARRAY['standard'::character varying, 'express'::character varying, 'pickup'::character varying])::"text"[]))),
    CONSTRAINT "payment_status_check" CHECK ((("payment_status")::"text" = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying, 'refunded'::character varying])::"text"[]))),
    CONSTRAINT "status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'delivered'::character varying, 'completed'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "name_ar" "text" NOT NULL,
    "parent_id" "uuid",
    "icon_url" "text",
    "is_active" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_reports" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "product_id" "uuid",
    "reported_by" "uuid",
    "report_type" character varying(50),
    "description" "text" NOT NULL,
    "status" character varying(20),
    "resolution_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "product_reports_report_type_check" CHECK ((("report_type")::"text" = ANY ((ARRAY['counterfeit'::character varying, 'quality'::character varying, 'misleading'::character varying, 'inappropriate'::character varying])::"text"[]))),
    CONSTRAINT "product_reports_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'investigating'::character varying, 'resolved'::character varying, 'dismissed'::character varying])::"text"[])))
);


ALTER TABLE "public"."product_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "name" character varying(255) NOT NULL,
    "description" "text",
    "category" character varying(100),
    "price" numeric NOT NULL,
    "original_price" numeric,
    "sku" character varying(100),
    "stock_quantity" integer DEFAULT 0,
    "unit" character varying(20),
    "images" "text"[],
    "specifications" "jsonb",
    "is_active" boolean DEFAULT true,
    "featured" boolean DEFAULT false,
    "weight" numeric,
    "dimensions" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "barcode" "text"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "name" character varying(255) NOT NULL,
    "description" "text",
    "project_type" character varying(50),
    "location" "text" NOT NULL,
    "address" "text",
    "city" character varying(100),
    "region" character varying(100),
    "plot_area" numeric,
    "building_area" numeric,
    "floors_count" integer,
    "rooms_count" integer,
    "bathrooms_count" integer,
    "status" character varying(20) DEFAULT 'planning'::character varying,
    "priority" character varying(20) DEFAULT 'medium'::character varying,
    "start_date" "date",
    "expected_completion_date" "date",
    "actual_completion_date" "date",
    "budget" numeric DEFAULT 0,
    "actual_cost" numeric DEFAULT 0,
    "currency" character varying(3) DEFAULT 'SAR'::character varying,
    "progress_percentage" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "location_lat" double precision,
    "location_lng" double precision,
    "end_date" "date",
    CONSTRAINT "chk_projects_actual_cost_positive" CHECK (("actual_cost" >= (0)::numeric)),
    CONSTRAINT "chk_projects_budget_positive" CHECK ((("budget" IS NULL) OR ("budget" >= (0)::numeric))),
    CONSTRAINT "chk_projects_progress_percentage" CHECK ((("progress_percentage" >= 0) AND ("progress_percentage" <= 100))),
    CONSTRAINT "priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::"text"[]))),
    CONSTRAINT "status_check" CHECK ((("status")::"text" = ANY ((ARRAY['planning'::character varying, 'design'::character varying, 'permits'::character varying, 'construction'::character varying, 'finishing'::character varying, 'completed'::character varying, 'on_hold'::character varying])::"text"[])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


COMMENT ON TABLE "public"."projects" IS 'Main projects table with standardized schema';



COMMENT ON COLUMN "public"."projects"."address" IS 'Project address/location';



COMMENT ON COLUMN "public"."projects"."budget" IS 'Project budget in the specified currency';



COMMENT ON COLUMN "public"."projects"."currency" IS 'Currency code (e.g., SAR, USD)';



COMMENT ON COLUMN "public"."projects"."end_date" IS 'Project completion date';



CREATE OR REPLACE VIEW "public"."projects_legacy" AS
 SELECT "projects"."id",
    "projects"."user_id",
    "projects"."name",
    "projects"."description",
    "projects"."project_type",
    "projects"."location",
    "projects"."address",
    "projects"."city",
    "projects"."region",
    "projects"."plot_area",
    "projects"."building_area",
    "projects"."floors_count",
    "projects"."rooms_count",
    "projects"."bathrooms_count",
    "projects"."status",
    "projects"."priority",
    "projects"."start_date",
    "projects"."expected_completion_date",
    "projects"."actual_completion_date",
    "projects"."budget",
    "projects"."actual_cost",
    "projects"."currency",
    "projects"."progress_percentage",
    "projects"."is_active",
    "projects"."created_at",
    "projects"."updated_at",
    "projects"."location_lat",
    "projects"."location_lng",
    "projects"."end_date"
   FROM "public"."projects";


ALTER TABLE "public"."projects_legacy" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promo_codes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "code" "text" NOT NULL,
    "discount_type" character varying(20),
    "discount_value" double precision NOT NULL,
    "min_purchase_amount" double precision,
    "max_discount_amount" double precision,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "usage_limit" integer,
    "usage_count" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "promo_codes_discount_type_check" CHECK ((("discount_type")::"text" = ANY ((ARRAY['percentage'::character varying, 'fixed'::character varying])::"text"[])))
);


ALTER TABLE "public"."promo_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shipping_providers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "logo_url" "text",
    "api_url" "text",
    "available_regions" "text"[],
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shipping_providers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_analytics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "date" "date" NOT NULL,
    "page_views" integer DEFAULT 0,
    "unique_visitors" integer DEFAULT 0,
    "total_orders" integer DEFAULT 0,
    "total_revenue" numeric DEFAULT 0,
    "average_order_value" numeric DEFAULT 0,
    "conversion_rate" double precision DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."store_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_operating_hours" (
    "store_id" "uuid" NOT NULL,
    "day_of_week" integer NOT NULL,
    "open_time" time without time zone,
    "close_time" time without time zone,
    "is_closed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "store_operating_hours_day_of_week_check" CHECK ((("day_of_week" >= 0) AND ("day_of_week" <= 6)))
);


ALTER TABLE "public"."store_operating_hours" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."store_revenue_by_product" AS
 SELECT "p"."id" AS "product_id",
    "p"."store_id",
    "p"."name" AS "product_name",
    "count"(DISTINCT "o"."id") AS "order_count",
    "sum"("oi"."quantity") AS "quantity_sold",
    "sum"((("oi"."quantity")::numeric * "oi"."price")) AS "revenue",
    "avg"("oi"."price") AS "average_price"
   FROM (("public"."products" "p"
     LEFT JOIN "public"."order_items" "oi" ON (("oi"."product_id" = "p"."id")))
     LEFT JOIN "public"."orders" "o" ON (("o"."id" = "oi"."order_id")))
  WHERE (("o"."status")::"text" = 'completed'::"text")
  GROUP BY "p"."id", "p"."store_id", "p"."name";


ALTER TABLE "public"."store_revenue_by_product" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_reviews" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "user_id" "uuid",
    "order_id" "uuid",
    "rating" integer,
    "review_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "store_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."store_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_verification_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid",
    "status" character varying(20),
    "business_license" "text" NOT NULL,
    "commercial_register" "text",
    "tax_certificate" "text",
    "owner_id" "text",
    "reviewed_by" "uuid",
    "review_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "store_verification_requests_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."store_verification_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_views" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "store_id" "uuid" NOT NULL,
    "session_id" "text",
    "user_id" "uuid",
    "source" "text",
    "referrer" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "ip_address" "text",
    "user_agent" "text"
);


ALTER TABLE "public"."store_views" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stores" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "store_name" character varying(255) NOT NULL,
    "description" "text",
    "category" character varying(100),
    "phone" character varying(20),
    "email" character varying(255),
    "address" "text",
    "city" character varying(100),
    "region" character varying(100),
    "website" character varying(255),
    "logo_url" "text",
    "cover_image_url" "text",
    "rating" numeric(2,1) DEFAULT 0.0,
    "total_reviews" integer DEFAULT 0,
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "delivery_areas" "text"[],
    "working_hours" "jsonb",
    "payment_methods" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."stores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "ticket_id" "uuid",
    "user_id" "uuid",
    "message" "text" NOT NULL,
    "attachments" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."support_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_tickets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "store_id" "uuid",
    "order_id" "uuid",
    "ticket_number" character varying(50) NOT NULL,
    "subject" "text" NOT NULL,
    "description" "text" NOT NULL,
    "status" character varying(20),
    "priority" character varying(20),
    "assigned_to" "uuid",
    "resolved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "support_tickets_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::"text"[]))),
    CONSTRAINT "support_tickets_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::"text"[])))
);


ALTER TABLE "public"."support_tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_balance" (
    "user_id" "uuid" NOT NULL,
    "amount" double precision DEFAULT 0,
    "last_transaction_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_balance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "avatar_url" "text",
    "country_code" character varying(10) DEFAULT '+966'::character varying,
    "date_of_birth" "date",
    "gender" character varying(20),
    "occupation" "text",
    "company_name" "text",
    "national_id" character varying(50),
    "emergency_contact_name" "text",
    "emergency_contact_phone" character varying(50),
    "preferred_language" character varying(10) DEFAULT 'ar'::character varying,
    "notification_preferences" "jsonb" DEFAULT '{"sms": true, "push": true, "email": true}'::"jsonb",
    "coordinates" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."warranties" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "warranty_number" character varying(50) NOT NULL,
    "product_name" character varying(255) NOT NULL,
    "brand" character varying(100),
    "model" character varying(100),
    "serial_number" character varying(100),
    "purchase_date" "date" NOT NULL,
    "warranty_start_date" "date" NOT NULL,
    "warranty_end_date" "date" NOT NULL,
    "warranty_period_months" integer NOT NULL,
    "warranty_type" character varying(50) NOT NULL,
    "coverage_description" "text",
    "status" character varying(20) DEFAULT 'active'::character varying,
    "is_transferable" boolean DEFAULT false,
    "claim_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'expired'::character varying, 'claimed'::character varying, 'voided'::character varying])::"text"[])))
);


ALTER TABLE "public"."warranties" OWNER TO "postgres";


ALTER TABLE ONLY "public"."customer_loyalty_points"
    ADD CONSTRAINT "customer_loyalty_points_pkey" PRIMARY KEY ("user_id", "store_id");



ALTER TABLE ONLY "public"."customer_segments"
    ADD CONSTRAINT "customer_segments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_store_metrics"
    ADD CONSTRAINT "daily_store_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_store_metrics"
    ADD CONSTRAINT "daily_store_metrics_store_id_date_key" UNIQUE ("store_id", "date");



ALTER TABLE ONLY "public"."invite_code_usages"
    ADD CONSTRAINT "invite_code_usages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invite_codes"
    ADD CONSTRAINT "invite_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."invite_codes"
    ADD CONSTRAINT "invite_codes_pkey" PRIMARY KEY ("user_id", "code");



ALTER TABLE ONLY "public"."loyalty_programs"
    ADD CONSTRAINT "loyalty_programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."marketing_campaigns"
    ADD CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("user_id", "setting_type", "channel");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_reports"
    ADD CONSTRAINT "product_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_barcode_key" UNIQUE ("barcode");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipping_providers"
    ADD CONSTRAINT "shipping_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_analytics"
    ADD CONSTRAINT "store_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_operating_hours"
    ADD CONSTRAINT "store_operating_hours_pkey" PRIMARY KEY ("store_id", "day_of_week");



ALTER TABLE ONLY "public"."store_reviews"
    ADD CONSTRAINT "store_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_verification_requests"
    ADD CONSTRAINT "store_verification_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_views"
    ADD CONSTRAINT "store_views_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_messages"
    ADD CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_ticket_number_key" UNIQUE ("ticket_number");



ALTER TABLE ONLY "public"."user_balance"
    ADD CONSTRAINT "user_balance_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_unique_user" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."warranties"
    ADD CONSTRAINT "warranties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."warranties"
    ADD CONSTRAINT "warranties_warranty_number_key" UNIQUE ("warranty_number");



CREATE INDEX "idx_invite_codes_code" ON "public"."invite_codes" USING "btree" ("code");



CREATE INDEX "idx_loyalty_points_balance" ON "public"."customer_loyalty_points" USING "btree" ("points_balance");



CREATE INDEX "idx_marketing_campaigns_store" ON "public"."marketing_campaigns" USING "btree" ("store_id");



CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");



CREATE INDEX "idx_order_items_product_id" ON "public"."order_items" USING "btree" ("product_id");



CREATE INDEX "idx_orders_store_id" ON "public"."orders" USING "btree" ("store_id");



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_product_categories_parent" ON "public"."product_categories" USING "btree" ("parent_id");



CREATE INDEX "idx_product_reports_product" ON "public"."product_reports" USING "btree" ("product_id");



CREATE INDEX "idx_products_active" ON "public"."products" USING "btree" ("is_active");



CREATE INDEX "idx_products_barcode" ON "public"."products" USING "btree" ("barcode");



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category");



CREATE INDEX "idx_products_sku" ON "public"."products" USING "btree" ("sku");



CREATE INDEX "idx_products_store_id" ON "public"."products" USING "btree" ("store_id");



CREATE INDEX "idx_projects_created_at" ON "public"."projects" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_projects_is_active" ON "public"."projects" USING "btree" ("is_active");



CREATE INDEX "idx_projects_status" ON "public"."projects" USING "btree" ("status");



CREATE INDEX "idx_projects_user_id" ON "public"."projects" USING "btree" ("user_id");



CREATE INDEX "idx_promo_codes_code" ON "public"."promo_codes" USING "btree" ("code");



CREATE INDEX "idx_promo_codes_store_id" ON "public"."promo_codes" USING "btree" ("store_id");



CREATE INDEX "idx_store_analytics_store_date" ON "public"."store_analytics" USING "btree" ("store_id", "date");



CREATE INDEX "idx_store_reviews_store_id" ON "public"."store_reviews" USING "btree" ("store_id");



CREATE INDEX "idx_store_verification_status" ON "public"."store_verification_requests" USING "btree" ("status");



CREATE INDEX "idx_stores_active" ON "public"."stores" USING "btree" ("is_active");



CREATE INDEX "idx_stores_category" ON "public"."stores" USING "btree" ("category");



CREATE INDEX "idx_stores_city" ON "public"."stores" USING "btree" ("city");



CREATE INDEX "idx_stores_rating" ON "public"."stores" USING "btree" ("rating" DESC);



CREATE INDEX "idx_stores_user_id" ON "public"."stores" USING "btree" ("user_id");



CREATE INDEX "idx_support_tickets_store" ON "public"."support_tickets" USING "btree" ("store_id");



CREATE INDEX "idx_support_tickets_user" ON "public"."support_tickets" USING "btree" ("user_id");



CREATE INDEX "idx_user_profiles_user_id" ON "public"."user_profiles" USING "btree" ("user_id");



CREATE INDEX "notifications_is_read_idx" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "notifications_user_id_idx" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "orders_user_id_idx" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "projects_user_id_idx" ON "public"."projects" USING "btree" ("user_id");



CREATE INDEX "warranties_user_id_idx" ON "public"."warranties" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "create_warranty_trigger" AFTER INSERT ON "public"."order_items" FOR EACH ROW WHEN (("new"."has_warranty" = true)) EXECUTE FUNCTION "public"."create_warranty_for_item"();



CREATE OR REPLACE TRIGGER "orders_daily_metrics_trigger" AFTER INSERT OR UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_update_daily_metrics"();



CREATE OR REPLACE TRIGGER "store_views_daily_metrics_trigger" AFTER INSERT ON "public"."store_views" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_update_daily_metrics"();



CREATE OR REPLACE TRIGGER "update_customer_loyalty_points_updated_at" BEFORE UPDATE ON "public"."customer_loyalty_points" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_customer_segments_updated_at" BEFORE UPDATE ON "public"."customer_segments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_invite_codes_updated_at" BEFORE UPDATE ON "public"."invite_codes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_loyalty_programs_updated_at" BEFORE UPDATE ON "public"."loyalty_programs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_marketing_campaigns_updated_at" BEFORE UPDATE ON "public"."marketing_campaigns" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notification_settings_updated_at" BEFORE UPDATE ON "public"."notification_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notifications_updated_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_order_total_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."order_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_order_total"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_product_categories_updated_at" BEFORE UPDATE ON "public"."product_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_promo_codes_updated_at" BEFORE UPDATE ON "public"."promo_codes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_store_operating_hours_updated_at" BEFORE UPDATE ON "public"."store_operating_hours" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_store_reviews_updated_at" BEFORE UPDATE ON "public"."store_reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_store_verification_updated_at" BEFORE UPDATE ON "public"."store_verification_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_stores_updated_at" BEFORE UPDATE ON "public"."stores" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_support_tickets_updated_at" BEFORE UPDATE ON "public"."support_tickets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_balance_updated_at" BEFORE UPDATE ON "public"."user_balance" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_warranties_updated_at" BEFORE UPDATE ON "public"."warranties" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."customer_loyalty_points"
    ADD CONSTRAINT "customer_loyalty_points_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id");



ALTER TABLE ONLY "public"."customer_loyalty_points"
    ADD CONSTRAINT "customer_loyalty_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."customer_segments"
    ADD CONSTRAINT "customer_segments_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."daily_store_metrics"
    ADD CONSTRAINT "daily_store_metrics_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id");



ALTER TABLE ONLY "public"."invite_code_usages"
    ADD CONSTRAINT "invite_code_usages_code_fkey" FOREIGN KEY ("code") REFERENCES "public"."invite_codes"("code");



ALTER TABLE ONLY "public"."invite_code_usages"
    ADD CONSTRAINT "invite_code_usages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."invite_code_usages"
    ADD CONSTRAINT "invite_code_usages_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."invite_codes"
    ADD CONSTRAINT "invite_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."loyalty_programs"
    ADD CONSTRAINT "loyalty_programs_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."marketing_campaigns"
    ADD CONSTRAINT "marketing_campaigns_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "public"."customer_segments"("id");



ALTER TABLE ONLY "public"."marketing_campaigns"
    ADD CONSTRAINT "marketing_campaigns_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_shipping_provider_id_fkey" FOREIGN KEY ("shipping_provider_id") REFERENCES "public"."shipping_providers"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id");



ALTER TABLE ONLY "public"."product_reports"
    ADD CONSTRAINT "product_reports_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."product_reports"
    ADD CONSTRAINT "product_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_analytics"
    ADD CONSTRAINT "store_analytics_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_operating_hours"
    ADD CONSTRAINT "store_operating_hours_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_reviews"
    ADD CONSTRAINT "store_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."store_reviews"
    ADD CONSTRAINT "store_reviews_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_reviews"
    ADD CONSTRAINT "store_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."store_verification_requests"
    ADD CONSTRAINT "store_verification_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."store_verification_requests"
    ADD CONSTRAINT "store_verification_requests_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_views"
    ADD CONSTRAINT "store_views_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id");



ALTER TABLE ONLY "public"."store_views"
    ADD CONSTRAINT "store_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."support_messages"
    ADD CONSTRAINT "support_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."support_messages"
    ADD CONSTRAINT "support_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_balance"
    ADD CONSTRAINT "user_balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."warranties"
    ADD CONSTRAINT "warranties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Allow public read access to active products" ON "public"."products" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Allow public read access to active stores" ON "public"."stores" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Store owners can manage their products" ON "public"."products" USING (("auth"."uid"() = ( SELECT "stores"."user_id"
   FROM "public"."stores"
  WHERE ("stores"."id" = "products"."store_id"))));



CREATE POLICY "Store owners can manage their stores" ON "public"."stores" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stores" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."calculate_daily_metrics"("store_id" "uuid", "calc_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_daily_metrics"("store_id" "uuid", "calc_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_daily_metrics"("store_id" "uuid", "calc_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_warranty_for_item"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_warranty_for_item"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_warranty_for_item"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_update_daily_metrics"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_update_daily_metrics"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_update_daily_metrics"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_order_total"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_order_total"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_order_total"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."customer_loyalty_points" TO "anon";
GRANT ALL ON TABLE "public"."customer_loyalty_points" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_loyalty_points" TO "service_role";



GRANT ALL ON TABLE "public"."customer_segments" TO "anon";
GRANT ALL ON TABLE "public"."customer_segments" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_segments" TO "service_role";



GRANT ALL ON TABLE "public"."daily_store_metrics" TO "anon";
GRANT ALL ON TABLE "public"."daily_store_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_store_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."invite_code_usages" TO "anon";
GRANT ALL ON TABLE "public"."invite_code_usages" TO "authenticated";
GRANT ALL ON TABLE "public"."invite_code_usages" TO "service_role";



GRANT ALL ON TABLE "public"."invite_codes" TO "anon";
GRANT ALL ON TABLE "public"."invite_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."invite_codes" TO "service_role";



GRANT ALL ON TABLE "public"."loyalty_programs" TO "anon";
GRANT ALL ON TABLE "public"."loyalty_programs" TO "authenticated";
GRANT ALL ON TABLE "public"."loyalty_programs" TO "service_role";



GRANT ALL ON TABLE "public"."marketing_campaigns" TO "anon";
GRANT ALL ON TABLE "public"."marketing_campaigns" TO "authenticated";
GRANT ALL ON TABLE "public"."marketing_campaigns" TO "service_role";



GRANT ALL ON TABLE "public"."notification_settings" TO "anon";
GRANT ALL ON TABLE "public"."notification_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_settings" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."product_categories" TO "anon";
GRANT ALL ON TABLE "public"."product_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."product_categories" TO "service_role";



GRANT ALL ON TABLE "public"."product_reports" TO "anon";
GRANT ALL ON TABLE "public"."product_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."product_reports" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."projects_legacy" TO "anon";
GRANT ALL ON TABLE "public"."projects_legacy" TO "authenticated";
GRANT ALL ON TABLE "public"."projects_legacy" TO "service_role";



GRANT ALL ON TABLE "public"."promo_codes" TO "anon";
GRANT ALL ON TABLE "public"."promo_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."promo_codes" TO "service_role";



GRANT ALL ON TABLE "public"."shipping_providers" TO "anon";
GRANT ALL ON TABLE "public"."shipping_providers" TO "authenticated";
GRANT ALL ON TABLE "public"."shipping_providers" TO "service_role";



GRANT ALL ON TABLE "public"."store_analytics" TO "anon";
GRANT ALL ON TABLE "public"."store_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."store_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."store_operating_hours" TO "anon";
GRANT ALL ON TABLE "public"."store_operating_hours" TO "authenticated";
GRANT ALL ON TABLE "public"."store_operating_hours" TO "service_role";



GRANT ALL ON TABLE "public"."store_revenue_by_product" TO "anon";
GRANT ALL ON TABLE "public"."store_revenue_by_product" TO "authenticated";
GRANT ALL ON TABLE "public"."store_revenue_by_product" TO "service_role";



GRANT ALL ON TABLE "public"."store_reviews" TO "anon";
GRANT ALL ON TABLE "public"."store_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."store_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."store_verification_requests" TO "anon";
GRANT ALL ON TABLE "public"."store_verification_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."store_verification_requests" TO "service_role";



GRANT ALL ON TABLE "public"."store_views" TO "anon";
GRANT ALL ON TABLE "public"."store_views" TO "authenticated";
GRANT ALL ON TABLE "public"."store_views" TO "service_role";



GRANT ALL ON TABLE "public"."stores" TO "anon";
GRANT ALL ON TABLE "public"."stores" TO "authenticated";
GRANT ALL ON TABLE "public"."stores" TO "service_role";



GRANT ALL ON TABLE "public"."support_messages" TO "anon";
GRANT ALL ON TABLE "public"."support_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."support_messages" TO "service_role";



GRANT ALL ON TABLE "public"."support_tickets" TO "anon";
GRANT ALL ON TABLE "public"."support_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."support_tickets" TO "service_role";



GRANT ALL ON TABLE "public"."user_balance" TO "anon";
GRANT ALL ON TABLE "public"."user_balance" TO "authenticated";
GRANT ALL ON TABLE "public"."user_balance" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."warranties" TO "anon";
GRANT ALL ON TABLE "public"."warranties" TO "authenticated";
GRANT ALL ON TABLE "public"."warranties" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
