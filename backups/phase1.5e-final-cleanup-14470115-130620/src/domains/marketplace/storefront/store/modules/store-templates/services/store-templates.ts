// @ts-nocheck
/**
 * Store Templates Service
 * Provides sector-specific store templates and configurations
 * Inspired by Salla's industry-focused approach
 */
export class StoreTemplatesService {
  /**
   * Get predefined store templates by sector
   */
  static getTemplatesBySector(sector: string) {
    const templates = this.getAllTemplates()
    return templates.filter(template => template.sector === sector)
  }

  /**
   * Get all available store templates
   */
  static getAllTemplates() {
    return [
      // Fashion & Apparel Templates (inspired by Salla fashion sector)
      {
        id: "fashion-basic",
        name: "Fashion Store",
        description: "Perfect for clothing, accessories, and fashion brands",
        sector: "fashion",
        saudi_specific: false,
        config: {
          features: {
            size_charts: true,
            product_variants: true,
            image_gallery: true,
            wish_lists: true,
            quick_view: true,
            size_guide: true,
            color_swatches: true
          },
          payment_methods: ["card", "apple_pay", "google_pay", "cash_on_delivery"],
          shipping_options: ["standard", "express", "same_day"],
          product_categories: [
            { name: "Men's Clothing", slug: "mens-clothing" },
            { name: "Women's Clothing", slug: "womens-clothing" },
            { name: "Accessories", slug: "accessories" },
            { name: "Shoes", slug: "shoes" }
          ]
        }
      },
      {
        id: "fashion-saudi",
        name: "Saudi Fashion Store",
        description: "Fashion store optimized for Saudi Arabian market",
        sector: "fashion",
        saudi_specific: true,
        config: {
          features: {
            size_charts: true,
            product_variants: true,
            image_gallery: true,
            arabic_product_names: true,
            rtl_layout: true,
            prayer_time_aware: true
          },
          payment_methods: ["mada", "stc_pay", "tabby", "tamara", "cash_on_delivery"],
          shipping_options: ["saudi_post", "smsa", "aramex", "same_day_riyadh"],
          product_categories: [
            { name: "عبايات", slug: "abayas" },
            { name: "أزياء رجالية", slug: "mens-fashion" },
            { name: "أزياء نسائية", slug: "womens-fashion" },
            { name: "إكسسوارات", slug: "accessories" }
          ]
        }
      },

      // Digital Products Templates (inspired by Salla digital sector)
      {
        id: "digital-basic",
        name: "Digital Products Store",
        description: "For selling digital goods, courses, and downloads",
        sector: "digital",
        saudi_specific: false,
        config: {
          features: {
            instant_delivery: true,
            digital_downloads: true,
            license_management: true,
            course_access: true,
            file_protection: true
          },
          payment_methods: ["card", "paypal", "apple_pay", "google_pay"],
          shipping_options: [], // No physical shipping needed
          product_categories: [
            { name: "Software", slug: "software" },
            { name: "E-books", slug: "ebooks" },
            { name: "Courses", slug: "courses" },
            { name: "Music", slug: "music" },
            { name: "Graphics", slug: "graphics" }
          ]
        }
      },

      // Electronics Templates
      {
        id: "electronics-basic",
        name: "Electronics Store",
        description: "For electronics, gadgets, and tech products",
        sector: "electronics",
        saudi_specific: false,
        config: {
          features: {
            product_comparisons: true,
            specifications_table: true,
            warranty_info: true,
            technical_support: true,
            bulk_ordering: true
          },
          payment_methods: ["card", "bank_transfer", "installments", "cash_on_delivery"],
          shipping_options: ["standard", "express", "white_glove"],
          product_categories: [
            { name: "Smartphones", slug: "smartphones" },
            { name: "Laptops", slug: "laptops" },
            { name: "Home Appliances", slug: "appliances" },
            { name: "Gaming", slug: "gaming" }
          ]
        }
      },

      // Beauty & Cosmetics Templates
      {
        id: "beauty-basic",
        name: "Beauty & Cosmetics",
        description: "For beauty products, cosmetics, and personal care",
        sector: "beauty",
        saudi_specific: false,
        config: {
          features: {
            ingredient_lists: true,
            skin_type_filter: true,
            virtual_try_on: true,
            beauty_blog: true,
            subscription_boxes: true
          },
          payment_methods: ["card", "apple_pay", "google_pay", "cash_on_delivery"],
          shipping_options: ["standard", "express", "subscription"],
          product_categories: [
            { name: "Skincare", slug: "skincare" },
            { name: "Makeup", slug: "makeup" },
            { name: "Fragrance", slug: "fragrance" },
            { name: "Hair Care", slug: "hair-care" }
          ]
        }
      },

      // Food & Restaurant Templates
      {
        id: "food-basic",
        name: "Food & Restaurant",
        description: "For restaurants, food delivery, and culinary businesses",
        sector: "food",
        saudi_specific: false,
        config: {
          features: {
            menu_management: true,
            order_scheduling: true,
            delivery_zones: true,
            nutritional_info: true,
            loyalty_program: true
          },
          payment_methods: ["card", "cash_on_delivery", "apple_pay", "google_pay"],
          shipping_options: ["pickup", "delivery", "scheduled_delivery"],
          product_categories: [
            { name: "Main Dishes", slug: "main-dishes" },
            { name: "Appetizers", slug: "appetizers" },
            { name: "Desserts", slug: "desserts" },
            { name: "Beverages", slug: "beverages" }
          ]
        }
      },

      // Jewelry Templates
      {
        id: "jewelry-basic",
        name: "Jewelry Store",
        description: "For jewelry, precious metals, and luxury accessories",
        sector: "jewelry",
        saudi_specific: false,
        config: {
          features: {
            product_360_view: true,
            certification_display: true,
            custom_sizing: true,
            appointment_booking: true,
            insurance_options: true
          },
          payment_methods: ["card", "bank_transfer", "installments", "financing"],
          shipping_options: ["insured_shipping", "pickup", "white_glove"],
          product_categories: [
            { name: "Rings", slug: "rings" },
            { name: "Necklaces", slug: "necklaces" },
            { name: "Earrings", slug: "earrings" },
            { name: "Watches", slug: "watches" }
          ]
        }
      }
    ]
  }

  /**
   * Get template by ID
   */
  static getTemplate(id: string) {
    const templates = this.getAllTemplates()
    return templates.find(template => template.id === id)
  }

  /**
   * Get Saudi-specific templates
   */
  static getSaudiTemplates() {
    const templates = this.getAllTemplates()
    return templates.filter(template => template.saudi_specific === true)
  }

  /**
   * Get featured templates (first template of each sector)
   */
  static getFeaturedTemplates() {
    const templates = this.getAllTemplates()
    const sectors = [...new Set(templates.map(t => t.sector))]
    return sectors.map(sector => templates.find(t => t.sector === sector)!).filter(Boolean)
  }

  /**
   * Apply template configuration to store
   */
  static applyTemplateToStore(templateId: string, customizations?: any) {
    const template = this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    return {
      template,
      config: {
        ...template.config,
        ...customizations
      },
      applied_at: new Date()
    }
  }
}


