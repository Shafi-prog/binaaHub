// @ts-nocheck
import { model } from "@medusajs/framework/utils"

/**
 * Store Template Model
 * Defines pre-configured store templates for different business sectors
 * Inspired by Salla's sector-specific configurations
 */
export const StoreTemplate = model.define("store_template", {
  id: model.id({ prefix: "stpl" }).primaryKey(),
  name: model.text(), // Template name (e.g., "Fashion Store", "Digital Products")
  description: model.text().nullable(),
  sector: model.text(), // fashion, digital, electronics, beauty, food, etc.
  
  // Template Configuration
  config: model.json(), // Store settings, payment methods, shipping options, etc.
  theme_config: model.json().nullable(), // Default theme configuration
  product_categories: model.json().nullable(), // Pre-defined categories for this sector
  payment_methods: model.json().nullable(), // Recommended payment methods
  shipping_options: model.json().nullable(), // Sector-specific shipping options
  
  // Localization Support
  locale_configs: model.json().nullable(), // Locale-specific configurations
  saudi_specific: model.boolean().default(false), // Saudi market optimizations
  
  // Template Assets
  preview_images: model.json().nullable(), // Template preview images
  demo_data: model.json().nullable(), // Sample products/data for this sector
  
  // Status and Metadata
  is_active: model.boolean().default(true),
  is_featured: model.boolean().default(false),
  sort_order: model.number().default(0),
  
  // Audit fields
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

/**
 * Store Template Usage Model
 * Tracks which templates are used by which stores
 */
export const StoreTemplateUsage = model.define("store_template_usage", {
  id: model.id({ prefix: "stpu" }).primaryKey(),
  store_id: model.text(), // Reference to store
  template_id: model.text(), // Reference to template
  applied_at: model.dateTime().default(new Date()),
  customizations: model.json().nullable(), // Store-specific customizations to template
  
  // Audit fields
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})


