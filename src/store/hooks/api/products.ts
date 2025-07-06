import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"
import { productsQueryKeys, variantsQueryKeys } from "../../products"

export const useProducts = (query?: any, options?: any) => {
  return useQuery({
    queryKey: productsQueryKeys.list(query),
    queryFn: () => sdk.admin.product.list(query),
    ...options,
  })
}

export const useProduct = (id: string, options?: any) => {
  return useQuery({
    queryKey: productsQueryKeys.detail(id),
    queryFn: () => sdk.admin.product.retrieve(id),
    enabled: !!id,
    ...options,
  })
}

export const useCreateProduct = (options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productData: any) => sdk.admin.product.create(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.list() })
    },
    ...options,
  })
}

export const useUpdateProduct = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productData: any) => sdk.admin.product.update(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) })
    },
    ...options,
  })
}

export const useDeleteProduct = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.list() })
    },
    ...options,
  })
}

export const useCreateProductOption = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (optionData: any) => Promise.resolve({ option: { id: 'opt-123', ...optionData } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) })
    },
    ...options,
  })
}

export const useUpdateProductOption = (productId: string, optionId: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (optionData: any) => Promise.resolve({ option: { id: optionId, ...optionData } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(productId) })
    },
    ...options,
  })
}

export const useDeleteProductOption = (productId: string, optionId: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.resolve({ success: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(productId) })
    },
    ...options,
  })
}

export const useCreateProductVariant = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variantData: any) => Promise.resolve({ variant: { id: 'var-123', ...variantData } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) })
    },
    ...options,
  })
}

export const useUpdateProductVariantsBatch = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variantsData: any) => Promise.resolve({ variants: variantsData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) })
    },
    ...options,
  })
}

export const useVariants = (query?: any, options?: any) => {
  return useQuery({
    queryKey: ["variants", query],
    queryFn: () => Promise.resolve({ variants: [], count: 0 }),
    ...options,
  })
}

export const useProductVariant = (productId: string, variantId: string, query?: any, options?: any) => {
  return useQuery({
    queryKey: variantsQueryKeys.detail(variantId, query),
    queryFn: async () => {
      const response = await sdk.admin.product.retrieveVariant(productId, variantId, query)
      return { variant: response.product_variant || response }
    },
    enabled: !!(productId && variantId),
    ...options,
  })
}

export const useExportProducts = (options?: any) => {
  return useMutation({
    mutationFn: (exportData: any) => Promise.resolve({ export_id: 'exp-123' }),
    ...options,
  })
}

export const useImportProducts = (options?: any) => {
  return useMutation({
    mutationFn: (importData: any) => Promise.resolve({ import_id: 'imp-123' }),
    ...options,
  })
}

export const useConfirmImportProducts = (options?: any) => {
  return useMutation({
    mutationFn: (confirmData: any) => Promise.resolve({ success: true }),
    ...options,
  })
}

export const useDeleteVariant = (productId: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (variantId: string) => sdk.admin.product.deleteVariant(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(productId) })
      queryClient.invalidateQueries({ queryKey: variantsQueryKeys.list() })
    },
  })
}
