// @ts-nocheck
// Order types and data models
import { AdminProductVariant } from './product-types';

export interface AdminOrderLineItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id?: string;
  variant?: AdminProductVariant;
  product_id?: string;
  product?: AdminProduct;
  product_title?: string;
  product_description?: string;
  product_subtitle?: string;
  product_type?: string;
  product_collection?: string;
  product_handle?: string;
  variant_sku?: string;
  variant_barcode?: string;
  variant_title?: string;
  variant_option_values?: Record<string, string>;
  quantity: number;
  fulfilled_quantity?: number;
  returned_quantity?: number;
  refundable?: number;
  raw_unit_price?: number;
  raw_quantity?: number;
  raw_fulfilled_quantity?: number;
  raw_returned_quantity?: number;
  raw_shipped_quantity?: number;
  shipped_quantity?: number;
  refundable_amount?: number;
  subtotal?: number;
  tax_total?: number;
  total?: number;
  original_total?: number;
  original_item_total?: number;
  original_tax_total?: number;
  discount_total?: number;
  raw_discount_total?: number;
  gift_card_total?: number;
  includes_tax: boolean;
  order_id?: string;
  order?: AdminOrder;
  swap_id?: string;
  claim_order_id?: string;
  adjustments?: LineItemAdjustment[];
  tax_lines?: LineItemTaxLine[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface OrderLineItemDTO {
  id: string;
  title: string;
  subtitle?: string | null;
  thumbnail?: string;
  requires_shipping: boolean;
  is_discountable: boolean;
  is_tax_inclusive: boolean;
  compare_at_unit_price?: number;
  unit_price: number;
  quantity: number;
  detail?: any;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  product_id?: string;
  product_title?: string;
  product_description?: string;
  product_subtitle?: string;
  product_type?: string;
  product_collection?: string;
  product_handle?: string;
  variant_id?: string;
  variant_sku?: string;
  variant_barcode?: string;
  variant_title?: string;
  variant_option_values?: Record<string, string>;
  variant?: AdminProductVariant;
  returned_quantity?: number;
  refundable?: number;
  raw_unit_price: number;
  raw_quantity: number;
  raw_original_total: number;
  raw_original_unit_price: number;
  raw_subtotal: number;
  raw_discount_total: number;
  raw_tax_total: number;
  raw_total: number;
}

export interface AdminOrder {
  id: string;
  status: OrderStatus;
  fulfillment_status: FulfillmentStatus;
  payment_status: PaymentStatus;
  display_id: number;
  cart_id?: string;
  customer_id: string;
  customer?: Customer;
  email: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_address_id?: string;
  shipping_address?: Address;
  region_id: string;
  region?: Region;
  currency_code: string;
  tax_rate?: number;
  discounts?: Discount[];
  gift_cards?: GiftCard[];
  shipping_methods?: ShippingMethod[];
  payments?: Payment[];
  fulfillments?: Fulfillment[];
  returns?: Return[];
  claims?: ClaimOrder[];
  refunds?: Refund[];
  swaps?: Swap[];
  draft_order_id?: string;
  items?: AdminOrderLineItem[];
  edits?: OrderEdit[];
  gift_card_transactions?: GiftCardTransaction[];
  canceled_at?: string;
  external_id?: string;
  sales_channel_id?: string;
  sales_channel?: SalesChannel;
  shipping_total: number;
  discount_total: number;
  tax_total: number;
  refunded_total: number;
  total: number;
  subtotal: number;
  paid_total: number;
  refundable_amount: number;
  gift_card_total: number;
  gift_card_tax_total: number;
  returnable_items?: AdminOrderLineItem[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed", 
  ARCHIVED = "archived",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action"
}

export enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  PARTIALLY_SHIPPED = "partially_shipped",
  SHIPPED = "shipped",
  PARTIALLY_RETURNED = "partially_returned",
  RETURNED = "returned",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action"
}

export enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action"
}

// Import types from other modules
import { AdminProduct } from './product-types';

// Placeholder interfaces for referenced types
export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Address {
  id: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
}

export interface Region {
  id: string;
  name: string;
  currency_code: string;
}

export interface Discount {
  id: string;
  code: string;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

export interface Payment {
  id: string;
  amount: number;
  currency_code: string;
}

export interface Fulfillment {
  id: string;
  status: string;
}

export interface Return {
  id: string;
  status: string;
}

export interface ClaimOrder {
  id: string;
  type: string;
}

export interface Refund {
  id: string;
  amount: number;
}

export interface Swap {
  id: string;
  difference_due: number;
}

export interface OrderEdit {
  id: string;
  status: string;
}

export interface GiftCardTransaction {
  id: string;
  amount: number;
}

export interface SalesChannel {
  id: string;
  name: string;
}

export interface LineItemAdjustment {
  id: string;
  amount: number;
}

export interface LineItemTaxLine {
  id: string;
  rate: number;
  name: string;
  code: string;
}


