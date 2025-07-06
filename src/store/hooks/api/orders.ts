import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/client";

export const ordersQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersQueryKeys.all, "list"] as const,
  list: (params?: any) => [...ordersQueryKeys.lists(), params] as const,
  details: () => [...ordersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...ordersQueryKeys.details(), id] as const,
  preview: () => [...ordersQueryKeys.all, "preview"] as const,
  changes: (id: string) => [...ordersQueryKeys.detail(id), "changes"] as const,
  lineItems: (id: string) => [...ordersQueryKeys.detail(id), "line-items"] as const,
};

export const useOrders = (params?: any) => {
  return useQuery({
    queryKey: ordersQueryKeys.list(params),
    queryFn: () => sdk.admin.order.list(params),
  });
};

export const useOrder = (id: string, options?: any) => {
  return useQuery({
    queryKey: ordersQueryKeys.detail(id),
    queryFn: () => sdk.admin.order.retrieve(id),
    select: (data: any) => {
      // Return the data with the order property extracted
      const order = data?.order || data;
      return {
        order,
        ...data,
      };
    },
    enabled: !!id,
    ...options,
  });
};

export const useOrderPreview = (id: string, options?: any) => {
  return useQuery({
    queryKey: [...ordersQueryKeys.preview(), id],
    queryFn: () => sdk.admin.order.retrievePreview(id),
    select: (data: any) => {
      const order = data?.order || data;
      return {
        order,
        ...data,
      };
    },
    enabled: !!id,
    ...options,
  });
};

export const useOrderChanges = (id: string, options?: any) => {
  return useQuery({
    queryKey: ordersQueryKeys.changes(id),
    queryFn: () => sdk.admin.order.retrieveChanges(id),
    ...options,
  });
};

export const useOrderLineItems = (id: string, options?: any) => {
  return useQuery({
    queryKey: ordersQueryKeys.lineItems(id),
    queryFn: () => sdk.admin.order.retrieveLineItems(id),
    ...options,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: any) => sdk.admin.order.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.order.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.order.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.lists() });
    },
  });
};

export const useCreateOrderFulfillment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, ...data }: { orderId: string } & any) => 
      sdk.admin.order.createFulfillment(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(variables.orderId) });
    },
  });
};

export const useCancelOrderFulfillment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, fulfillmentId }: { orderId: string; fulfillmentId: string }) => 
      sdk.admin.order.cancelFulfillment(orderId, fulfillmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(variables.orderId) });
    },
  });
};

export const useCreateOrderShipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, fulfillmentId, ...data }: { orderId: string; fulfillmentId: string } & any) => 
      sdk.admin.order.createShipment(orderId, fulfillmentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(variables.orderId) });
    },
  });
};

export const useMarkOrderFulfillmentAsDelivered = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, fulfillmentId }: { orderId: string; fulfillmentId: string }) => 
      sdk.admin.order.markFulfillmentAsDelivered(orderId, fulfillmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(variables.orderId) });
    },
  });
};

export const useRequestTransferOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, ...data }: { orderId: string } & any) => 
      sdk.admin.order.requestTransfer(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(variables.orderId) });
    },
  });
};

export const useCancelOrderTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => sdk.admin.order.cancelTransfer(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.detail(orderId) });
    },
  });
};
