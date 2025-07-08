// @ts-nocheck
// Shared types for Construction Materials Management System with ERP Features

export interface ConstructionProduct {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  sku: string;
  barcode?: string;
  alternative_barcodes?: string[];
  saudi_barcode?: string; // Saudi barcode management
  gs1_barcode?: string; // GS1 compliant barcode
  category_id: string;
  category_name?: string; // Added for display
  brand_ar?: string;
  brand_en?: string;
  model?: string;
  saudi_standard?: string;
  saudi_building_code?: string; // Added for compatibility
  gsi_classification?: string;
  specifications?: any;
  unit_of_measure: string;
  unit?: string; // Added for compatibility
  minimum_stock: number;
  min_stock_level?: number; // Added for compatibility
  maximum_stock?: number;
  reorder_level?: number;
  current_stock: number;
  stock_quantity?: number; // Added for compatibility
  cost_price?: number;
  cost?: number; // Added for compatibility
  selling_price: number;
  price?: number; // Added for compatibility
  wholesale_price?: number;
  currency: string;
  vat_rate: number;
  images?: string[];
  technical_sheet_url?: string;
  safety_datasheet_url?: string;
  is_active: boolean;
  is_hazardous: boolean;
  requires_certification: boolean;
  saudi_certification?: string; // Saudi certification number
  stock_status?: 'normal' | 'low' | 'out'; // Added for ProductCatalog
  created_at: string;
  updated_at: string;
  created_by?: string;
  supplier_id?: string;
  supplier_name?: string;
  store_id?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  // ERP Features
  erp_integration?: {
    sync_status?: 'pending' | 'synced' | 'error';
    last_sync?: string;
    external_id?: string;
    accounting_code?: string;
    tax_category?: string;
  };
  purchase_info?: {
    preferred_supplier_id?: string;
    lead_time_days?: number;
    minimum_order_quantity?: number;
    last_purchase_price?: number;
    last_purchase_date?: string;
  };
  audit_trail?: {
    created_by_user?: string;
    last_modified_by?: string;
    modification_reason?: string;
    version?: number;
  };
}

export interface ConstructionCategory {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  parent_id?: string;
  icon?: string;
  sort_order: number;
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: ConstructionCategory[]; // Added for ProductCatalog
  products_count?: number; // Added for ProductCatalog
  product_count?: number; // Added for categories page
}

export interface ProductFormData {
  barcode?: string;
  saudi_barcode?: string; // Saudi barcode management
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  category_id: string;
  saudi_building_code?: string;
  saudi_certification?: string; // Saudi certification
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  specifications?: any;
  images?: string[];
  supplier_id?: string;
  is_active: boolean;
  // ERP Features
  accounting_code?: string;
  tax_category?: string;
  preferred_supplier_id?: string;
  lead_time_days?: number;
  minimum_order_quantity?: number;
  is_hazardous?: boolean;
  requires_certification?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  name_ar?: string;
  contact_info?: any;
  email?: string;
  phone?: string;
  address?: string;
  saudi_commercial_registration?: string; // Saudi business registration
  vat_number?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_active?: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

// Additional ERP Types
export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string;
  expected_delivery_date?: string;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  items: PurchaseOrderItem[];
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity?: number;
  notes?: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type?: 'purchase' | 'sale' | 'transfer' | 'adjustment';
  reference_id?: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface SaudiComplianceInfo {
  saudi_standard_number?: string;
  saso_approval?: string;
  halal_certification?: string;
  environmental_compliance?: string;
  building_code_compliance?: string;
  expiry_date?: string;
  certification_body?: string;
}


