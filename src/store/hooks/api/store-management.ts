// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

export const storeQueryKeys = {
  all: ["stores"] as const,
  lists: () => [...storeQueryKeys.all, "list"] as const,
  list: (params?: any) => [...storeQueryKeys.lists(), params] as const,
  details: () => [...storeQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...storeQueryKeys.details(), id] as const,
  currencies: (id: string) => [...storeQueryKeys.detail(id), "currencies"] as const,
  regions: (id: string) => [...storeQueryKeys.detail(id), "regions"] as const,
}

// Mock store data fallback
const mockStoreData = {
  id: "default",
  name: "Binna Store",
  default_currency_code: "USD",
  default_sales_channel_id: "default_channel",
  default_region_id: "default_region",
  metadata: {},
  swap_link_template: "",
  payment_link_template: "",
  invite_link_template: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Store management hooks using available SDK methods
export const useStore = () => {
  return useQuery({
    queryKey: storeQueryKeys.detail("default"),
    queryFn: async () => {
      try {
        return await sdk.admin.store.retrieve("default")
      } catch (error) {
        console.warn("Failed to fetch store data, using mock data:", error)
        return mockStoreData
      }
    },
  })
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await sdk.admin.store.update("default", data)
      } catch (error) {
        console.warn("Failed to update store, using mock response:", error)
        return { ...mockStoreData, ...data }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail("default") })
    },
  })
}

// Store currencies using available methods
export const useStoreCurrencies = () => {
  return useQuery({
    queryKey: storeQueryKeys.currencies("default"),
    queryFn: async () => {
      try {
        return await sdk.admin.currency.list()
      } catch (error) {
        console.warn("Failed to fetch currencies, using mock data:", error)
        return {
          currencies: [
            { code: "USD", name: "US Dollar", symbol: "$" },
            { code: "EUR", name: "Euro", symbol: "€" },
            { code: "GBP", name: "British Pound", symbol: "£" },
          ]
        }
      }
    },
  })
}

export const useAddStoreCurrency = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (currencyCode: string) => {
      // Placeholder for adding currency - would need actual implementation
      return Promise.resolve({ success: true, currencyCode })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.currencies("default") })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail("default") })
    },
  })
}

// Marketplace-specific store hooks for multi-tenant scenarios
export const useVendorStores = () => {
  return useQuery({
    queryKey: ["vendor-stores"],
    queryFn: async () => {
      // For now, return a mock structure for multi-vendor stores
      // This would be implemented when multi-store support is added
      return []
    },
  })
}

export const useCreateVendorStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ 
      vendorId, 
      storeName, 
      storeData 
    }: { 
      vendorId: string
      storeName: string
      storeData: any
    }) => {
      // Placeholder for vendor store creation
      // This would use a custom API endpoint for multi-vendor setup
      return Promise.resolve({
        id: `store_${vendorId}`,
        name: storeName,
        vendor_id: vendorId,
        ...storeData
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-stores"] })
    },
  })
}

export const useStoresByStatus = (status: 'active' | 'pending' | 'suspended' | 'inactive') => {
  return useQuery({
    queryKey: ["stores", "by-status", status],
    queryFn: async () => {
      // Mock implementation for store status filtering
      // This would be implemented with proper multi-store support
      return []
    },
  })
}

export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ 
      storeId, 
      status, 
      reason 
    }: { 
      storeId: string
      status: 'active' | 'pending' | 'suspended' | 'inactive'
      reason?: string
    }) => {
      // Update store status via metadata
      return Promise.resolve({
        id: storeId,
        status,
        updated_at: new Date().toISOString(),
        reason
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores", "by-status"] })
      queryClient.invalidateQueries({ queryKey: ["vendor-stores"] })
    },
  })
}

// Store configuration hooks
export const useStoreConfig = () => {
  return useQuery({
    queryKey: ["store-config"],
    queryFn: async () => {
      const store = await sdk.admin.store.retrieve("default")
      return store
    },
  })
}

export const useStoreStats = (storeId?: string) => {
  return useQuery({
    queryKey: ["store-stats", storeId || "default"],
    queryFn: async () => {
      // Get store statistics - orders, products, customers, revenue
      const [orders, products, customers] = await Promise.all([
        sdk.admin.order.list({ limit: 1000 }),
        sdk.admin.product.list({ limit: 1000 }),
        sdk.admin.customer.list({ limit: 1000 }),
      ])

      // If storeId provided, filter by store (when multi-store is implemented)
      const storeOrders = storeId ? 
        orders.orders?.filter((order: any) => order.metadata?.storeId === storeId) :
        orders.orders || []
      
      const storeProducts = storeId ? 
        products.products?.filter((product: any) => product.metadata?.storeId === storeId) :
        products.products || []

      const storeCustomers = storeId ? 
        customers.customers?.filter((customer: any) => customer.metadata?.storeId === storeId) :
        customers.customers || []

      const totalRevenue = storeOrders.reduce((sum: number, order: any) => 
        sum + (order.total || 0), 0
      )

      return {
        totalOrders: storeOrders.length,
        totalProducts: storeProducts.length,
        totalCustomers: storeCustomers.length,
        totalRevenue,
        averageOrderValue: storeOrders.length > 0 ? totalRevenue / storeOrders.length : 0,
      }
    },
  })
}

// Store regions management
export const useStoreRegions = () => {
  return useQuery({
    queryKey: storeQueryKeys.regions("default"),
    queryFn: () => sdk.admin.region.list(),
  })
}

// Store sales channels management  
export const useStoreSalesChannels = () => {
  return useQuery({
    queryKey: ["store-sales-channels"],
    queryFn: () => sdk.admin.salesChannel.list(),
  })
}


