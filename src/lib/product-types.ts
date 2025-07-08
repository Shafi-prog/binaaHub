// @ts-nocheck
// Data types and utilities for products

export interface AdminProductVariant {
  id: string;
  title?: string;
  sku?: string;
  barcode?: string;
  ean?: string;
  upc?: string;
  variant_rank?: number;
  inventory_quantity?: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  options?: ProductOptionValue[];
  inventory?: InventoryItemDTO[];
  inventory_items?: AdminProductVariantInventoryItemLink[];
  prices?: MoneyAmount[];
  product?: AdminProduct;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  metadata?: Record<string, any>;
}

export interface AdminProductVariantInventoryItemLink {
  inventory_item_id: string;
  required_quantity: number;
  inventory_item?: InventoryItemDTO;
}

export interface ProductVariantInventory {
  inventory_item_id: string;
  variant_id: string;
  quantity: number;
}

export interface ProductOptionValue {
  id: string;
  value: string;
  option_id: string;
  variant_id: string;
}

export interface MoneyAmount {
  id: string;
  currency_code: string;
  amount: number;
  region_id?: string;
  price_list_id?: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  is_giftcard: boolean;
  status: ProductStatus;
  thumbnail?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  collection_id?: string;
  collection?: ProductCollection;
  type_id?: string;
  type?: ProductType;
  tags?: ProductTag[];
  variants?: AdminProductVariant[];
  options?: ProductOption[];
  images?: Image[];
  discountable: boolean;
  external_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  metadata?: Record<string, any>;
}

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed", 
  PUBLISHED = "published",
  REJECTED = "rejected"
}

export interface ProductCollection {
  id: string;
  title: string;
  handle?: string;
}

export interface ProductType {
  id: string;
  value: string;
}

export interface ProductTag {
  id: string;
  value: string;
}

export interface ProductOption {
  id: string;
  title: string;
  values?: ProductOptionValue[];
}

export interface Image {
  id: string;
  url: string;
}

import { InventoryItemDTO } from './inventory';


