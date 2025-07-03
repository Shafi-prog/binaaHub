// Integrated Medusa client for unified server
class IntegratedMedusaClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    // Always use localhost:3000 for unified integration
    this.baseUrl = 'http://localhost:3000';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Products API (Store)
  async getProducts(params?: { limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${this.baseUrl}/api/store/products?${searchParams}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }
  // Regions API
  async getRegions() {
    const response = await fetch(`${this.baseUrl}/api/store/regions`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch regions: ${response.statusText}`);
    }

    return response.json();
  }

  // Cart API
  async createCart(data: { region_id: string; items?: any[] }) {
    const response = await fetch(`${this.baseUrl}/api/store/carts`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create cart: ${response.statusText}`);
    }

    return response.json();
  }
  async getCart(cartId: string) {
    const response = await fetch(`${this.baseUrl}/api/store/carts?id=${cartId}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }

    return response.json();
  }

  // Customer API (integrated with Supabase)
  async createCustomer(userData: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) {
    // This will use the existing auth system
    const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        password: 'temp-password', // This should be handled by the signup flow
        accountType: 'user'
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }

    return response.json();
  }
}

// Create and export the integrated client
export const medusaClient = new IntegratedMedusaClient();

// Helper function to get the client
export const getMedusaClient = () => {
  return medusaClient;
};

// Legacy compatibility - keep for existing code
export const getServerMedusaClient = () => {
  return medusaClient;
};

export default medusaClient
