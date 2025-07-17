// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const paymentCollectionsQueryKeys = {
  all: ["payment-collections"] as const,
  lists: () => [...paymentCollectionsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...paymentCollectionsQueryKeys.lists(), params] as const,
  details: () => [...paymentCollectionsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentCollectionsQueryKeys.details(), id] as const,
};

export const usePaymentCollections = (params?: any) => {
  return useQuery({
    queryKey: paymentCollectionsQueryKeys.list(params),
    queryFn: () => Promise.resolve({ payment_collections: [], count: 0, offset: 0, limit: 20 }), // placeholder
  });
};

export const usePaymentCollection = (id: string, options?: any) => {
  return useQuery({
    queryKey: paymentCollectionsQueryKeys.detail(id),
    queryFn: () => Promise.resolve({ payment_collection: null }), // placeholder
    ...options,
  });
};

export const useCreatePaymentCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ payment_collection: data }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentCollectionsQueryKeys.lists() });
    },
  });
};

export const useUpdatePaymentCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      Promise.resolve({ payment_collection: { id, ...data } }), // placeholder
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentCollectionsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: paymentCollectionsQueryKeys.lists() });
    },
  });
};

export const useDeletePaymentCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentCollectionsQueryKeys.lists() });
    },
  });
};


