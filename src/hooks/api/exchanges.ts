// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/lib/client";

export const exchangesQueryKeys = {
  all: ["exchanges"] as const,
  lists: () => [...exchangesQueryKeys.all, "list"] as const,
  list: (params?: any) => [...exchangesQueryKeys.lists(), params] as const,
  details: () => [...exchangesQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...exchangesQueryKeys.details(), id] as const,
};

export const useExchanges = (params?: any) => {
  return useQuery({
    queryKey: exchangesQueryKeys.list(params),
    queryFn: () => Promise.resolve({ exchanges: [], count: 0, offset: 0, limit: 20 }), // placeholder
  });
};

export const useExchange = (id: string, options?: any) => {
  return useQuery({
    queryKey: exchangesQueryKeys.detail(id),
    queryFn: () => Promise.resolve({ exchange: null }), // placeholder
    ...options,
  });
};

export const useCreateExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exchangeData: any) => Promise.resolve({ exchange: exchangeData }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangesQueryKeys.lists() });
    },
  });
};

export const useUpdateExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      Promise.resolve({ exchange: { id, ...data } }), // placeholder
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: exchangesQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: exchangesQueryKeys.lists() });
    },
  });
};

export const useDeleteExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangesQueryKeys.lists() });
    },
  });
};

export const useCancelExchange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true }), // placeholder
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: exchangesQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: exchangesQueryKeys.lists() });
    },
  });
};


