// @ts-nocheck
// Construction-related types

export interface ConstructionCategory {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  parent_id?: string;
  sort_order?: number;
  level?: number;
  is_active: boolean;
  children?: ConstructionCategory[];
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ConstructionProject {
  id: string;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  location?: string;
  contractor_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstructionContractor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  license_number?: string;
  specializations?: string[];
  rating?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstructionMaterial {
  id: string;
  name: string;
  description?: string;
  unit: string;
  price_per_unit?: number;
  category_id?: string;
  supplier_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstructionSupplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  rating?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstructionProduct {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  images?: string[];
  category_id?: string;
  category_name?: string;
  unit: string;
  unit_of_measure?: string;
  price?: number;
  selling_price?: number;
  cost?: number;
  stock_quantity?: number;
  current_stock?: number;
  minimum_stock?: number;
  stock_status?: string;
  min_stock_level?: number;
  price_per_unit?: number;
  supplier_id?: string;
  supplier_name?: string;
  barcode?: string;
  sku?: string;
  currency?: string;
  specifications?: Record<string, any>;
  is_active: boolean;
  is_hazardous?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  rating?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  id?: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  category_id?: string;
  unit: string;
  price?: number;
  cost?: number;
  stock_quantity?: number;
  min_stock_level?: number;
  price_per_unit?: number;
  supplier_id?: string;
  barcode?: string;
  sku?: string;
  saudi_building_code?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}


