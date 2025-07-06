import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const cacheQueryKeys = {
  all: ["cache"] as const,
  stats: () => [...cacheQueryKeys.all, "stats"] as const,
  keys: () => [...cacheQueryKeys.all, "keys"] as const,
  config: () => [...cacheQueryKeys.all, "config"] as const,
}

// Cache statistics and monitoring
export const useCacheStats = () => {
  return useQuery({
    queryKey: cacheQueryKeys.stats(),
    queryFn: async () => {
      const response = await fetch('/api/store/cache/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch cache stats')
      }
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

// Cache key management
export const useCacheKeys = (pattern?: string) => {
  return useQuery({
    queryKey: [...cacheQueryKeys.keys(), pattern],
    queryFn: async () => {
      const params = pattern ? `?pattern=${encodeURIComponent(pattern)}` : ''
      const response = await fetch(`/api/store/cache/keys${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cache keys')
      }
      return response.json()
    },
  })
}

// Cache operations
export const useClearCache = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ keys, pattern }: { keys?: string[], pattern?: string }) => {
      const response = await fetch('/api/store/cache/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys, pattern }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to clear cache')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Refresh cache stats and keys after clearing
      queryClient.invalidateQueries({ queryKey: cacheQueryKeys.stats() })
      queryClient.invalidateQueries({ queryKey: cacheQueryKeys.keys() })
    },
  })
}

export const useSetCacheValue = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      key, 
      value, 
      ttl 
    }: { 
      key: string
      value: any
      ttl?: number
    }) => {
      const response = await fetch('/api/store/cache/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value, ttl }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to set cache value')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheQueryKeys.keys() })
      queryClient.invalidateQueries({ queryKey: cacheQueryKeys.stats() })
    },
  })
}

export const useGetCacheValue = (key: string) => {
  return useQuery({
    queryKey: ["cache-value", key],
    queryFn: async () => {
      const response = await fetch(`/api/store/cache/get?key=${encodeURIComponent(key)}`)
      if (!response.ok) {
        throw new Error('Failed to get cache value')
      }
      return response.json()
    },
    enabled: !!key,
  })
}

// Cache configuration
export const useCacheConfig = () => {
  return useQuery({
    queryKey: cacheQueryKeys.config(),
    queryFn: async () => {
      const response = await fetch('/api/store/cache/config')
      if (!response.ok) {
        throw new Error('Failed to fetch cache config')
      }
      return response.json()
    },
  })
}

export const useUpdateCacheConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (config: { 
      defaultTtl?: number
      maxMemory?: string
      evictionPolicy?: string
    }) => {
      const response = await fetch('/api/store/cache/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update cache config')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheQueryKeys.config() })
    },
  })
}

// Marketplace-specific cache helpers
export const useClearStoreCache = () => {
  const clearCache = useClearCache()
  
  return useMutation({
    mutationFn: (storeId: string) => 
      clearCache.mutateAsync({ pattern: `store:${storeId}:*` }),
  })
}

export const useClearProductCache = () => {
  const clearCache = useClearCache()
  
  return useMutation({
    mutationFn: (productId?: string) => 
      clearCache.mutateAsync({ 
        pattern: productId ? `product:${productId}:*` : 'product:*' 
      }),
  })
}

export const useClearUserCache = () => {
  const clearCache = useClearCache()
  
  return useMutation({
    mutationFn: (userId: string) => 
      clearCache.mutateAsync({ pattern: `user:${userId}:*` }),
  })
}

// Cache warming for performance
export const useWarmCache = () => {
  return useMutation({
    mutationFn: async ({ 
      type, 
      ids 
    }: { 
      type: 'products' | 'stores' | 'categories'
      ids?: string[]
    }) => {
      const response = await fetch('/api/store/cache/warm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, ids }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to warm cache')
      }
      
      return response.json()
    },
  })
}

// Cache hit rate monitoring
export const useCacheMetrics = (timeframe: '1h' | '24h' | '7d' = '24h') => {
  return useQuery({
    queryKey: ["cache-metrics", timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/store/cache/metrics?timeframe=${timeframe}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cache metrics')
      }
      return response.json()
    },
    refetchInterval: 60000, // Refresh every minute
  })
}
