// @ts-nocheck
// E-commerce integration utilities for BINNA platform
import Medusa from '@medusajs/medusa-js';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface EcommerceAdminAPI {
  auth: any;
  customers: {
    list: () => Promise<{ customers: any[] }>;
    create: (data: any) => Promise<{ customer: any }>;
  };
  products: {
    list: () => Promise<{ products: any[] }>;
    create: (data: any) => Promise<{ product: any }>;
  };
}

interface EcommerceStoreAPI {
  carts: {
    create: (data?: any) => Promise<{ cart: any }>;
  };
  products: {
    list: (query?: { limit?: number; offset?: number; q?: string }) => Promise<{ products: any[] }>;
  };
  regions: {
    list: () => Promise<{ regions: any[] }>;
  };
}

interface ExtendedEcommerce extends Omit<Medusa, 'admin' | 'store'> {
  admin: EcommerceAdminAPI;
  store: EcommerceStoreAPI;
}

export const ecommerceClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  maxRetries: 3,
}) as unknown as ExtendedEcommerce;

// Legacy export for backward compatibility
export const medusaClient = ecommerceClient;

const supabase = createClient(supabaseUrl, supabaseKey)

export interface MedusaCustomer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  has_account: boolean
}

export interface CreateMedusaCustomerData {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  password?: string
}

/**
 * Create or get customer in Medusa when user signs up in your app
 */
export const syncUserWithMedusa = async (userData: {
  id: string
  email: string
  name?: string
  account_type: string
}) => {
  try {
    // Get all customers and filter in memory
    const { customers } = await medusaClient.admin.customers.list()
    const existingCustomer = customers.find(c => c.email === userData.email)

    if (existingCustomer) {
      console.log('Customer already exists in Medusa')
      return existingCustomer
    }

    // Create new customer if not found
    const customerData = {
      email: userData.email,
      first_name: userData.name,
      metadata: {
        supabase_id: userData.id
      }
    }

    const { customer } = await medusaClient.admin.customers.create(customerData)
    
    // Store Medusa customer ID in your Supabase users table
    await supabase
      .from('users')
      .update({ medusa_customer_id: customer.id })
      .eq('id', userData.id)

    console.log('Created Medusa customer:', customer.id)
    return customer

  } catch (error) {
    console.error('Error syncing user with Medusa:', error)
    throw error
  }
}

/**
 * Get customer from Medusa by email
 */
export const getMedusaCustomerByEmail = async (email: string): Promise<MedusaCustomer | null> => {
  try {
    const { customers } = await medusaClient.admin.customers.list()
    return customers.find(c => c.email === email)
  } catch (error) {
    console.error('Error getting Medusa customer:', error)
    return null
  }
}

/**
 * Create a cart for a customer
 */
export const createMedusaCart = async (customerId?: string, region_id?: string) => {
  try {
    const cartData: any = {
      region_id: region_id || 'reg_01JGE1A36QRQT7WZPN4SQ9P9NW' // Default region
    }

    if (customerId) {
      cartData.customer_id = customerId
    }

    const { cart } = await medusaClient.store.carts.create(cartData)
    return cart
  } catch (error) {
    console.error('Error creating Medusa cart:', error)
    throw error
  }
}

/**
 * Get products from Medusa
 */
export const getMedusaProducts = async (limit = 20, offset = 0) => {
  try {
    const { products } = await medusaClient.store.products.list({
      limit,
      offset
    })
    return products
  } catch (error) {
    console.error('Error getting Medusa products:', error)
    return []
  }
}

/**
 * Search products in Medusa
 */
export const searchMedusaProducts = async (query: string) => {
  try {
    const { products } = await medusaClient.store.products.list({
      q: query
    })
    return products
  } catch (error) {
    console.error('Error searching Medusa products:', error)
    return []
  }
}

/**
 * Get regions from Medusa
 */
export const getMedusaRegions = async () => {
  try {
    const { regions } = await medusaClient.store.regions.list()
    return regions
  } catch (error) {
    console.error('Error getting Medusa regions:', error)
    return []
  }
}

export async function findUserByEmail(email: string) {
  try {
    const { customers } = await medusaClient.admin.customers.list()
    return customers.find(customer => customer.email === email)
  } catch (error) {
    console.error('Error finding user:', error)
    return null
  }
}

export default {
  syncUserWithMedusa,
  getMedusaCustomerByEmail,
  createMedusaCart,
  getMedusaProducts,
  searchMedusaProducts,
  getMedusaRegions
}


