// src/hooks/api/notifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sdk } from '../../lib/client'
import { queryKeysFactory } from '../../lib/query-key-factory'

export const notificationQueryKeys = queryKeysFactory('notifications')

export const useNotifications = (query?: any, options?: any) => {
  return useQuery({
    queryKey: notificationQueryKeys.list(query),
    queryFn: async () => {
      const data = await sdk.admin.notification?.list(query) || { notifications: [] }
      return data
    },
    select: (data: any) => {
      return {
        notifications: data?.notifications || [],
        count: data?.count || 0,
        offset: data?.offset || 0,
        limit: data?.limit || 20,
      } as {
        notifications: any[];
        count: number;
        offset: number;
        limit: number;
      }
    },
    ...options,
  })
}

export const useNotification = (id: string, query?: any, options?: any) => {
  return useQuery({
    queryKey: notificationQueryKeys.detail(id, query),
    queryFn: async () => {
      const data = await sdk.admin.notification?.retrieve(id) || { notification: {} }
      return data
    },
    enabled: !!id,
    ...options,
  })
}

export const useCreateNotification = (options?: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      return sdk.admin.notification?.create(data) || { notification: data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list() })
    },
    ...options,
  })
}

export const useUpdateNotification = (id: string, options?: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      return sdk.admin.notification?.update(id, data) || { notification: { ...data, id } }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.detail(id) })
    },
    ...options,
  })
}

export const useDeleteNotification = (id: string, options?: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      return sdk.admin.notification?.delete(id) || { deleted: true, id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list() })
    },
    ...options,
  })
}
