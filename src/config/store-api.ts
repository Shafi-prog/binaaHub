// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdmin
}

// Store management utilities
export const storeApi = {
  // Get real-time stock levels
  async getStockLevels(userId: string) {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('id, name, current_stock, min_stock_level, sku, category')
      .eq('user_id', userId)
      .order('current_stock', { ascending: true })

    if (error) {
      console.error('Error fetching stock levels:', error)
      return []
    }

    return data || []
  },

  // Get low stock items
  async getLowStockItems(userId: string) {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .select('id, name, current_stock, min_stock_level, sku, category')
      .eq('user_id', userId)
      .lt('current_stock', 'min_stock_level')
      .gt('min_stock_level', 0)

    if (error) {
      console.error('Error fetching low stock items:', error)
      return []
    }

    return data || []
  },

  // Get recent orders
  async getRecentOrders(userId: string, limit = 10) {
    const { data, error } = await getSupabaseAdmin()
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        total_amount,
        status,
        payment_status,
        created_at,
        updated_at,
        order_items(count)
      `)
      .eq('store_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent orders:', error)
      return []
    }

    return data?.map(order => ({
      ...order,
      items_count: order.order_items?.[0]?.count || 0
    })) || []
  },

  // Get store analytics
  async getStoreAnalytics(userId: string) {
    try {
      const supabase = getSupabaseAdmin()
      const [
        productsCount,
        ordersCount,
        revenueSum,
        lowStockCount
      ] = await Promise.all([
        // Total products
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Active orders
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', userId)
          .in('status', ['pending', 'confirmed', 'processing', 'shipped']),
        
        // Monthly revenue
        supabase
          .from('orders')
          .select('total_amount')
          .eq('store_id', userId)
          .eq('payment_status', 'paid')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        // Low stock items
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .lt('current_stock', 'min_stock_level')
          .gt('min_stock_level', 0)
      ])

      const monthlyRevenue = revenueSum.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      return {
        totalProducts: productsCount.count || 0,
        activeOrders: ordersCount.count || 0,
        monthlyRevenue,
        lowStockItems: lowStockCount.count || 0
      }
    } catch (error) {
      console.error('Error fetching store analytics:', error)
      return {
        totalProducts: 0,
        activeOrders: 0,
        monthlyRevenue: 0,
        lowStockItems: 0
      }
    }
  },

  // Update stock level
  async updateStockLevel(productId: string, newStock: number) {
    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .update({ current_stock: newStock })
      .eq('id', productId)
      .select()

    if (error) {
      console.error('Error updating stock level:', error)
      return null
    }

    return data?.[0] || null
  },

  // Create stock movement record
  async createStockMovement(userId: string, productId: string, movementType: string, quantity: number, reason?: string) {
    const { data, error } = await getSupabaseAdmin()
      .from('stock_movements')
      .insert({
        user_id: userId,
        product_id: productId,
        movement_type: movementType,
        quantity,
        reason,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error creating stock movement:', error)
      return null
    }

    return data?.[0] || null
  },

  // Get store settings
  async getStoreSettings(userId: string) {
    const { data, error } = await getSupabaseAdmin()
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching store settings:', error)
      return null
    }

    return data
  },

  // Update store settings
  async updateStoreSettings(userId: string, settings: any) {
    const { data, error } = await getSupabaseAdmin()
      .from('stores')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error updating store settings:', error)
      return null
    }

    return data?.[0] || null
  }
}

export default storeApi


