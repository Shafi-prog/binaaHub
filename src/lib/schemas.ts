// @ts-nocheck
import { z } from "zod";

// Address schema
export const AddressSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address_1: z.string().min(1, "Address line 1 is required"),
  address_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  province: z.string().optional(),
  country_code: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type AddressFormData = z.infer<typeof AddressSchema>;

// Email schema
export const EmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type EmailFormData = z.infer<typeof EmailSchema>;

// Customer schema
export const CustomerSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email format"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  billing_address: AddressSchema.optional(),
  shipping_addresses: z.array(AddressSchema).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;

// Product schema
export const ProductSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Product title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  handle: z.string().optional(),
  is_giftcard: z.boolean().default(false),
  discountable: z.boolean().default(true),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  hs_code: z.string().optional(),
  origin_country: z.string().optional(),
  mid_code: z.string().optional(),
  material: z.string().optional(),
  collection_id: z.string().optional(),
  type_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "proposed", "published", "rejected"]).default("draft"),
  metadata: z.record(z.any()).optional(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;

// Order schema
export const OrderSchema = z.object({
  id: z.string().optional(),
  status: z.enum(["pending", "completed", "archived", "canceled", "requires_action"]),
  fulfillment_status: z.enum(["not_fulfilled", "partially_fulfilled", "fulfilled", "partially_shipped", "shipped", "partially_returned", "returned", "canceled", "requires_action"]),
  payment_status: z.enum(["not_paid", "awaiting", "captured", "partially_refunded", "refunded", "canceled", "requires_action"]),
  display_id: z.number(),
  cart_id: z.string().optional(),
  customer_id: z.string().optional(),
  email: z.string().email(),
  billing_address: AddressSchema.optional(),
  shipping_address: AddressSchema.optional(),
  region_id: z.string(),
  currency_code: z.string(),
  tax_rate: z.number().optional(),
  discounts: z.array(z.any()).optional(),
  gift_cards: z.array(z.any()).optional(),
  shipping_methods: z.array(z.any()).optional(),
  payments: z.array(z.any()).optional(),
  fulfillments: z.array(z.any()).optional(),
  returns: z.array(z.any()).optional(),
  claims: z.array(z.any()).optional(),
  refunds: z.array(z.any()).optional(),
  swaps: z.array(z.any()).optional(),
  draft_order_id: z.string().optional(),
  items: z.array(z.any()).optional(),
  edits: z.array(z.any()).optional(),
  gift_card_transactions: z.array(z.any()).optional(),
  canceled_at: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  no_notification: z.boolean().optional(),
  idempotency_key: z.string().optional(),
  external_id: z.string().optional(),
  sales_channel_id: z.string().optional(),
});

export type OrderFormData = z.infer<typeof OrderSchema>;

// Region schema
export const RegionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Region name is required"),
  currency_code: z.string().min(3, "Currency code is required"),
  tax_rate: z.number().min(0).max(1),
  tax_code: z.string().optional(),
  gift_cards_taxable: z.boolean().default(true),
  automatic_taxes: z.boolean().default(true),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  payment_providers: z.array(z.string()).optional(),
  fulfillment_providers: z.array(z.string()).optional(),
  includes_tax: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export type RegionFormData = z.infer<typeof RegionSchema>;

// Sales Channel schema
export const SalesChannelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Sales channel name is required"),
  description: z.string().optional(),
  is_disabled: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export type SalesChannelFormData = z.infer<typeof SalesChannelSchema>;

// Inventory schema
export const InventoryItemSchema = z.object({
  id: z.string().optional(),
  sku: z.string().optional(),
  hs_code: z.string().optional(),
  origin_country: z.string().optional(),
  mid_code: z.string().optional(),
  material: z.string().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  requires_shipping: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

export type InventoryItemFormData = z.infer<typeof InventoryItemSchema>;

// Common validation helpers
export const requiredString = (message = "This field is required") =>
  z.string().min(1, message);

export const optionalString = z.string().optional();

export const requiredNumber = (message = "This field is required") =>
  z.number({ invalid_type_error: message });

export const optionalNumber = z.number().optional();

export const requiredEmail = z.string().email("Invalid email format");

export const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
export const optionalPhone = z.string().regex(phoneRegex, "Invalid phone number").optional().or(z.literal(""));

// Export all schemas
export const schemas = {
  AddressSchema,
  EmailSchema,
  CustomerSchema,
  ProductSchema,
  OrderSchema,
  RegionSchema,
  SalesChannelSchema,
  InventoryItemSchema,
};

export default schemas;


