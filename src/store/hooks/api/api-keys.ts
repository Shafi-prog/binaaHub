import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdminApiKeyResponse } from "@medusajs/types"

export interface CreateApiKeyRequest {
  title: string
  type: string
}

export const useCreateApiKey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateApiKeyRequest): Promise<AdminApiKeyResponse> => {
      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create API key')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export const useApiKey = (id: string, options?: any) => {
  // This is a placeholder hook
  return {
    api_key: null as AdminApiKeyResponse["api_key"] | null,
    data: null,
    isLoading: false,
    isError: false,
    error: null
  }
}

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete API key')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<AdminApiKeyResponse> => {
      const response = await fetch(`/api/admin/api-keys/${id}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to revoke API key')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export const useBatchRemoveSalesChannelsFromApiKey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ apiKeyId, salesChannelIds }: { apiKeyId: string, salesChannelIds: string[] }): Promise<void> => {
      const response = await fetch(`/api/admin/api-keys/${apiKeyId}/sales-channels/batch`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sales_channel_ids: salesChannelIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove sales channels from API key')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export const useUpdateApiKey = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any): Promise<AdminApiKeyResponse> => {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update API key')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      queryClient.invalidateQueries({ queryKey: ['api-key', id] })
    },
  })
}

interface ApiKeysQueryResult {
  api_keys: any[];
  count: number;
  offset: number;
  limit: number;
}

export const useApiKeys = (query?: any, options?: any) => {
  return useQuery<ApiKeysQueryResult>({
    queryKey: ["api-keys", query],
    queryFn: async (): Promise<ApiKeysQueryResult> => {
      // Placeholder implementation
      return {
        api_keys: [],
        count: 0,
        offset: 0,
        limit: 20
      };
    },
    ...options
  });
};

export const apiKeysQueryKeys = {
  all: ["api-keys"] as const,
  lists: () => [...apiKeysQueryKeys.all, "list"] as const,
  list: (query?: any) => [...apiKeysQueryKeys.lists(), query] as const,
  details: () => [...apiKeysQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...apiKeysQueryKeys.details(), id] as const,
};

export const useBatchAddSalesChannelsToApiKey = (keyId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { sales_channel_ids: string[] }) => {
      // Placeholder implementation
      return Promise.resolve({ success: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.detail(keyId) })
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })
    },
  })
}
