import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

const TAX_REGIONS_QUERY_KEY = ["tax-regions"] as const

// Fetch tax regions
export const useTaxRegions = (query?: any) => {
  return useQuery({
    queryKey: [...TAX_REGIONS_QUERY_KEY, query],
    queryFn: async () => {
      const response = await sdk.admin.taxRegion.list(query)
      return response
    },
  })
}

// Fetch single tax region
export const useTaxRegion = (id: string) => {
  return useQuery({
    queryKey: [...TAX_REGIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await sdk.admin.taxRegion.retrieve(id)
      return response
    },
    enabled: !!id,
  })
}

// Create tax region
export const useCreateTaxRegion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.taxRegion.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAX_REGIONS_QUERY_KEY })
    },
  })
}

// Update tax region
export const useUpdateTaxRegion = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.taxRegion.update(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAX_REGIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...TAX_REGIONS_QUERY_KEY, id] })
    },
  })
}

// Delete tax region
export const useDeleteTaxRegion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.admin.taxRegion.delete(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAX_REGIONS_QUERY_KEY })
    },
  })
}
