// @ts-nocheck
// E-commerce API Configuration and Helper Functions
// This file provides the connection and API helpers for integrating with BINNA's e-commerce system

export interface EcommerceConfig {
  apiUrl: string;
  apiKey?: string;
  publishableKey?: string;
}

// Default configuration - update these values based on your e-commerce setup
const defaultConfig: EcommerceConfig = {
  apiUrl: process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'http://localhost:9000',
  apiKey: process.env.MEDUSA_API_KEY,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
};

class EcommerceAPI {
  private config: EcommerceConfig;

  constructor(config: EcommerceConfig = defaultConfig) {
    this.config = config;
  }
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.apiUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add API key if available (for admin operations)
    if (this.config.apiKey) {
      headers['x-medusa-access-token'] = this.config.apiKey;
    }

    // Add publishable key if available (for storefront operations)
    if (this.config.publishableKey) {
      headers['x-publishable-api-key'] = this.config.publishableKey;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Products API
  async getProducts(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/products?${searchParams}`);
  }

  async getProduct(id: string) {
    return this.request(`/admin/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/admin/products/${id}`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/orders?${searchParams}`);
  }

  async getOrder(id: string) {
    return this.request(`/admin/orders/${id}`);
  }

  async updateOrder(id: string, orderData: any) {
    return this.request(`/admin/orders/${id}`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Inventory API
  async getInventoryItems(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/inventory-items?${searchParams}`);
  }

  async getStockLevels(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/stock-levels?${searchParams}`);
  }

  async updateStockLevel(inventoryItemId: string, locationId: string, data: any) {
    return this.request(`/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics API (if available)
  async getAnalytics(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/analytics?${searchParams}`);
  }

  // Customers API
  async getCustomers(params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/admin/customers?${searchParams}`);
  }

  async getCustomer(id: string) {
    return this.request(`/admin/customers/${id}`);
  }

  // Regions API
  async getRegions() {
    return this.request('/admin/regions');
  }

  // Store API
  async getStore() {
    return this.request('/admin/store');
  }

  // Currency API
  async getCurrencies() {
    return this.request('/admin/currencies');
  }
}

// Export singleton instance
export const ecommerceAPI = new EcommerceAPI();

// Export helper functions
export const formatMedusaPrice = (amount: number, currencyCode: string = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount / 100); // Medusa stores prices in cents
};

export const getMedusaStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    // Order statuses
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    requires_action: 'bg-orange-100 text-orange-800',
    
    // Product statuses
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    proposed: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    
    // Fulfillment statuses
    not_fulfilled: 'bg-gray-100 text-gray-800',
    partially_fulfilled: 'bg-blue-100 text-blue-800',
    fulfilled: 'bg-green-100 text-green-800',
    shipped: 'bg-green-100 text-green-800',
    
    // Payment statuses
    not_paid: 'bg-gray-100 text-gray-800',
    awaiting: 'bg-yellow-100 text-yellow-800',
    captured: 'bg-green-100 text-green-800',
    refunded: 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const convertToMedusaProduct = (legacyProduct: any) => {
  return {
    title: legacyProduct.name,
    handle: legacyProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
    description: legacyProduct.description,
    status: legacyProduct.disabled ? 'draft' : 'published',
    variants: [
      {
        title: 'Default Variant',
        sku: legacyProduct.barcode || legacyProduct.item_code,
        inventory_quantity: legacyProduct.stock || 0,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          {
            currency_code: 'SAR',
            amount: Math.round((legacyProduct.price || 0) * 100), // Convert to cents
          },
        ],
      },
    ],
    images: legacyProduct.image_url ? [{ url: legacyProduct.image_url }] : [],
    metadata: {
      legacy_id: legacyProduct.id,
      item_code: legacyProduct.item_code,
      item_group: legacyProduct.item_group,
      brand: legacyProduct.brand,
      manufacturer: legacyProduct.manufacturer,
    },
  };
};

export default EcommerceAPI;


