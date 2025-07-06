import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"

const marketingQueryKeys = {
  all: ["marketing"] as const,
  segments: () => [...marketingQueryKeys.all, "segments"] as const,
  segment: (id: string) => [...marketingQueryKeys.segments(), id] as const,
  campaigns: () => [...marketingQueryKeys.all, "campaigns"] as const,
  campaign: (id: string) => [...marketingQueryKeys.campaigns(), id] as const,
  automations: () => [...marketingQueryKeys.all, "automations"] as const,
  automation: (id: string) => [...marketingQueryKeys.automations(), id] as const,
  recommendations: () => [...marketingQueryKeys.all, "recommendations"] as const,
  wishlists: () => [...marketingQueryKeys.all, "wishlists"] as const,
}

// Customer Segments API hooks
export const useCustomerSegments = () => {
  return useQuery({
    queryKey: marketingQueryKeys.segments(),
    queryFn: async () => {
      const response = await fetch('/api/store/marketing/segments')
      if (!response.ok) {
        throw new Error('Failed to fetch customer segments')
      }
      return response.json()
    },
  })
}

export const useCustomerSegment = (id: string) => {
  return useQuery({
    queryKey: marketingQueryKeys.segment(id),
    queryFn: async () => {
      const response = await fetch(`/api/store/marketing/segments/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch customer segment')
      }
      return response.json()
    },
    enabled: !!id,
  })
}

export const useCreateCustomerSegment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/store/marketing/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create customer segment')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.segments() })
    },
  })
}

export const useUpdateCustomerSegment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/store/marketing/segments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update customer segment')
      }
      
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.segments() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.segment(id) })
    },
  })
}

export const useDeleteCustomerSegment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/marketing/segments/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete customer segment')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.segments() })
    },
  })
}

// Calculate segment members
export const useCalculateSegmentMembers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (segmentId: string) => {
      const response = await fetch(`/api/store/marketing/segments/${segmentId}/calculate`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to calculate segment members')
      }
      
      return response.json()
    },
    onSuccess: (_, segmentId) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.segment(segmentId) })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.segments() })
    },
  })
}

// Email Campaigns API hooks
export const useEmailCampaigns = () => {
  return useQuery({
    queryKey: marketingQueryKeys.campaigns(),
    queryFn: async () => {
      const response = await fetch('/api/store/marketing/campaigns')
      if (!response.ok) {
        throw new Error('Failed to fetch email campaigns')
      }
      return response.json()
    },
  })
}

export const useEmailCampaign = (id: string) => {
  return useQuery({
    queryKey: marketingQueryKeys.campaign(id),
    queryFn: async () => {
      const response = await fetch(`/api/store/marketing/campaigns/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch email campaign')
      }
      return response.json()
    },
    enabled: !!id,
  })
}

export const useCreateEmailCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/store/marketing/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create email campaign')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

export const useUpdateEmailCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/store/marketing/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update email campaign')
      }
      
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(id) })
    },
  })
}

export const useDeleteEmailCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/marketing/campaigns/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete email campaign')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

// Campaign control actions
export const useSendEmailCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/marketing/campaigns/${id}/send`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to send email campaign')
      }
      
      return response.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(id) })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

export const usePauseEmailCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/marketing/campaigns/${id}/pause`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to pause email campaign')
      }
      
      return response.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(id) })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

export const useResumeEmailCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/store/marketing/campaigns/${id}/resume`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to resume email campaign')
      }
      
      return response.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaign(id) })
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.campaigns() })
    },
  })
}

// Marketing Automations API hooks
export const useMarketingAutomations = () => {
  return useQuery({
    queryKey: marketingQueryKeys.automations(),
    queryFn: async () => {
      const response = await fetch('/api/store/marketing/automations')
      if (!response.ok) {
        throw new Error('Failed to fetch marketing automations')
      }
      return response.json()
    },
  })
}

export const useMarketingAutomation = (id: string) => {
  return useQuery({
    queryKey: marketingQueryKeys.automation(id),
    queryFn: async () => {
      const response = await fetch(`/api/store/marketing/automations/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch marketing automation')
      }
      return response.json()
    },
    enabled: !!id,
  })
}

export const useCreateMarketingAutomation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/store/marketing/automations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create marketing automation')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.automations() })
    },
  })
}

// Product Recommendations API hooks
export const useProductRecommendations = (context: string, customerId?: string, productId?: string) => {
  return useQuery({
    queryKey: [...marketingQueryKeys.recommendations(), context, customerId, productId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (customerId) params.append('customer_id', customerId)
      if (productId) params.append('product_id', productId)
      
      const response = await fetch(`/api/store/marketing/recommendations/${context}?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product recommendations')
      }
      return response.json()
    },
  })
}

export const useTrackRecommendationView = () => {
  return useMutation({
    mutationFn: async (data: { recommendation_id: string; product_id: string }) => {
      const response = await fetch('/api/store/marketing/recommendations/track/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to track recommendation view')
      }
      
      return response.json()
    },
  })
}

export const useTrackRecommendationClick = () => {
  return useMutation({
    mutationFn: async (data: { recommendation_id: string; product_id: string }) => {
      const response = await fetch('/api/store/marketing/recommendations/track/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to track recommendation click')
      }
      
      return response.json()
    },
  })
}

// Wishlist API hooks
export const useWishlists = (customerId?: string) => {
  return useQuery({
    queryKey: [...marketingQueryKeys.wishlists(), customerId],
    queryFn: async () => {
      const params = customerId ? `?customer_id=${customerId}` : ''
      const response = await fetch(`/api/store/marketing/wishlists${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch wishlists')
      }
      return response.json()
    },
  })
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { customer_id: string; product_id: string; variant_id?: string }) => {
      const response = await fetch('/api/store/marketing/wishlists/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add to wishlist')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.wishlists() })
    },
  })
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { customer_id: string; product_id: string }) => {
      const response = await fetch('/api/store/marketing/wishlists/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketingQueryKeys.wishlists() })
    },
  })
}
