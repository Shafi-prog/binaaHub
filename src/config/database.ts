// src/config/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          account_type: 'user' | 'store' | 'admin';
          name: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          region: string | null;
          created_at: string;
          updated_at: string;
          preferences: Json | null;
          is_verified: boolean;
          status: string;
        };
        Insert: {
          id?: string;
          account_type?: 'user' | 'store' | 'admin';
          name?: string | null;
          email: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
          preferences?: Json | null;
          is_verified?: boolean;
          status?: string;
        };
        Update: {
          id?: string;
          account_type?: 'user' | 'store' | 'admin';
          name?: string | null;
          email?: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
          preferences?: Json | null;
          is_verified?: boolean;
          status?: string;
        };
      };
      store_profiles: {
        Row: {
          id: string;
          store_name: string;
          description: string | null;
          business_license: string | null;
          category: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          city: string | null;
          region: string | null;
          website: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          location_lat: number | null;
          location_lng: number | null;
          business_type: string | null;
          registration_number: string | null;
          working_hours: Json | null;
          contact_email: string | null;
          contact_phone: string | null;
          social_media: Json | null;
          rating: number;
          review_count: number;
          is_verified: boolean;
          is_active: boolean;
          delivery_areas: string[] | null;
          payment_methods: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          store_name: string;
          description?: string | null;
          business_license?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          business_type?: string | null;
          registration_number?: string | null;
          working_hours?: Json | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          social_media?: Json | null;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          is_active?: boolean;
          delivery_areas?: string[] | null;
          payment_methods?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_name?: string;
          description?: string | null;
          business_license?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          business_type?: string | null;
          registration_number?: string | null;
          working_hours?: Json | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          social_media?: Json | null;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          is_active?: boolean;
          delivery_areas?: string[] | null;
          payment_methods?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          user_id: string;
          store_name: string;
          business_license: string | null;
          description: string | null;
          category: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          city: string | null;
          region: string | null;
          website: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          rating: number;
          total_reviews: number;
          is_verified: boolean;
          is_active: boolean;
          delivery_areas: string[] | null;
          working_hours: Json | null;
          payment_methods: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_name: string;
          business_license?: string | null;
          description?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          rating?: number;
          total_reviews?: number;
          is_verified?: boolean;
          is_active?: boolean;
          delivery_areas?: string[] | null;
          working_hours?: Json | null;
          payment_methods?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_name?: string;
          business_license?: string | null;
          description?: string | null;
          category?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          region?: string | null;
          website?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          rating?: number;
          total_reviews?: number;
          is_verified?: boolean;
          is_active?: boolean;
          delivery_areas?: string[] | null;
          working_hours?: Json | null;
          payment_methods?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          description: string | null;
          barcode: string | null;
          price: number;
          stock: number;
          image_url: string | null;
          category: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          description?: string | null;
          barcode?: string | null;
          price: number;
          stock: number;
          image_url?: string | null;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          description?: string | null;
          barcode?: string | null;
          price?: number;
          stock?: number;
          image_url?: string | null;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      store_views: {
        Row: {
          id: string;
          store_id: string;
          session_id: string | null;
          user_id: string | null;
          source: string | null;
          referrer: string | null;
          created_at: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          store_id: string;
          session_id?: string | null;
          user_id?: string | null;
          source?: string | null;
          referrer?: string | null;
          created_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          store_id?: string;
          session_id?: string | null;
          user_id?: string | null;
          source?: string | null;
          referrer?: string | null;
          created_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
      marketing_campaigns: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          description: string | null;
          type: string;
          status: string;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          spend: number;
          target_audience: Json | null;
          impressions: number;
          clicks: number;
          conversions: number;
          revenue: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          description?: string | null;
          type: string;
          status?: string;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          spend?: number;
          target_audience?: Json | null;
          impressions?: number;
          clicks?: number;
          conversions?: number;
          revenue?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          description?: string | null;
          type?: string;
          status?: string;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          spend?: number;
          target_audience?: Json | null;
          impressions?: number;
          clicks?: number;
          conversions?: number;
          revenue?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_segments: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          description: string | null;
          criteria: Json | null;
          customer_count: number;
          total_revenue: number;
          average_order_value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          description?: string | null;
          criteria?: Json | null;
          customer_count?: number;
          total_revenue?: number;
          average_order_value?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          description?: string | null;
          criteria?: Json | null;
          customer_count?: number;
          total_revenue?: number;
          average_order_value?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_store_metrics: {
        Row: {
          id: string;
          store_id: string;
          date: string;
          total_sales: number;
          order_count: number;
          customer_count: number;
          view_count: number;
          conversion_rate: number;
          average_order_value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          date: string;
          total_sales?: number;
          order_count?: number;
          customer_count?: number;
          view_count?: number;
          conversion_rate?: number;
          average_order_value?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          date?: string;
          total_sales?: number;
          order_count?: number;
          customer_count?: number;
          view_count?: number;
          conversion_rate?: number;
          average_order_value?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      store_revenue_by_product: {
        Row: {
          product_id: string;
          store_id: string;
          product_name: string;
          order_count: number;
          quantity_sold: number;
          revenue: number;
          average_price: number;
        };
      };
    };
    Enums: {
      user_role: 'user' | 'store' | 'admin';
      project_type:
        | 'residential'
        | 'commercial'
        | 'industrial'
        | 'infrastructure'
        | 'renovation'
        | 'other';
      warranty_status: 'active' | 'expired' | 'pending' | 'rejected';
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      service_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'available';
    };
    Functions: {
      calculate_daily_metrics: {
        Args: {
          store_id: string;
          calc_date?: string;
        };
        Returns: void;
      };
    };
  };
}
