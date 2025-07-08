// @ts-nocheck
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

const BUNDLES_QUERY_KEY = "product_bundles" as const

export const bundlesQueryKeys = {
  all: [BUNDLES_QUERY_KEY],
  lists: () => [...bundlesQueryKeys.all, "list"],
  list: (query: any) => [...bundlesQueryKeys.lists(), query],
  details: () => [...bundlesQueryKeys.all, "detail"],
  detail: (id: string, query?: any) => [...bundlesQueryKeys.details(), id, query],
}

export interface CreateProductBundleRequest {
  title: string
  handle: string
  description?: string
  bundle_type: "fixed" | "dynamic" | "kit"
  is_bundle: boolean
  items: {
    product_id: string
    quantity: number
    required: boolean
    allow_quantity_change: boolean
    discount_percentage?: number
    sort_order: number
  }[]
}

export interface UpdateProductBundleRequest extends Partial<CreateProductBundleRequest> {
  id: string
}

export interface ProductBundleResponse {
  id: string
  title: string
  handle: string
  description?: string
  bundle_type: "fixed" | "dynamic" | "kit"
  is_bundle: boolean
  items: {
    id: string
    product_id: string
    product_title: string
    quantity: number
    required: boolean
    allow_quantity_change: boolean
    discount_percentage?: number
    sort_order: number
  }[]
  created_at: string
  updated_at: string
}

export const useProductBundles = (
  query?: any,
  options?: any
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => {
      // TODO: Replace with actual API call when backend is ready
      return Promise.resolve({
        bundles: [
          {
            id: "pb_1",
            title: "Construction Starter Kit",
            handle: "construction-starter-kit",
            description: "Essential tools for construction",
            bundle_type: "kit",
            is_bundle: true,
            items: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      })
    },
    queryKey: bundlesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useProductBundle = (
  id: string,
  query?: any,
  options?: any
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => {
      // TODO: Replace with actual API call when backend is ready
      return Promise.resolve({
        bundle: {
          id: id,
          title: "Construction Starter Kit",
          handle: "construction-starter-kit",
          description: "Essential tools for construction",
          bundle_type: "kit",
          is_bundle: true,
          items: [
            {
              id: "bi_1",
              product_id: "prod_1",
              product_title: "Hammer",
              quantity: 1,
              required: true,
              allow_quantity_change: false,
              sort_order: 1
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
    },
    queryKey: bundlesQueryKeys.detail(id, query),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateProductBundle = (options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductBundleRequest) => {
      // TODO: Replace with actual API call when backend is ready
      return Promise.resolve({
        bundle: {
          id: `pb_${Date.now()}`,
          ...payload,
          items: payload.items.map((item, index) => ({
            id: `bi_${Date.now()}_${index}`,
            ...item,
            product_title: `Product ${item.product_id}`
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: bundlesQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateProductBundle = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProductBundleRequest) => {
      // TODO: Replace with actual API call when backend is ready
      return Promise.resolve({
        bundle: {
          id: id,
          ...payload,
          updated_at: new Date().toISOString()
        }
      })
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: bundlesQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bundlesQueryKeys.detail(id) })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteProductBundle = (options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      // TODO: Replace with actual API call when backend is ready
      return Promise.resolve({ id })
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: bundlesQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}


