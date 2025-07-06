export { useStore } from './store';
export { useLogout } from './auth';

// Re-export other existing API hooks
export * from './users';
export * from './sales-channels';
export * from './orders';
export * from './api-keys';
export * from './products';
export * from './regions';
export * from './claims';
export * from './exchanges';
export * from './returns';
export * from './order-edits';
export * from './reservations';
export * from './stock-locations';
export * from './shipping-options';
export * from './return-reasons';
export * from './notifications';
export { notificationQueryKeys } from './notifications';
export * from './inventory-items';
export * from './customers';
export * from './payment-collections';
export * from './plugins';
export * from './analytics';
export * from './workflows';
export * from './cache';
export * from './event-bus';
export * from './store-management';
export * from './customer-groups';
export * from './collections';
export * from './campaigns';
export * from './payments';
export * from './taxes';
export * from './shipping-profiles';

// Fulfillment hooks (avoiding conflicts with shipping-options)
export { 
  useFulfillmentProviders,
  useVendorShippingOptions,
  useStoreFulfillmentOptions,
  useOrderFulfillments,
  useCreateOrderFulfillment,
  useCancelOrderFulfillment
} from './fulfillment';

// Additional commonly referenced hooks (placeholders for now)
// useOrder and useOrderPreview are exported from './orders'
export const useProduct = () => ({ data: null, isLoading: false, isError: false, error: null });
export const useProducts = () => ({ data: [], count: 0, isLoading: false, isError: false, error: null });
export const useUpdateProduct = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useUpdateOrder = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useCustomers = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useCustomerGroups = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useCollections = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useProductCategories = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useProductTags = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useProductTypes = () => ({ data: [], isLoading: false, isError: false, error: null });
export const usePromotions = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useTaxRegions = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useInventoryItems = () => ({ data: [], isLoading: false, isError: false, error: null });
export const usePriceLists = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useShippingProfiles = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useStockLocations = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useCampaigns = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useVariants = (params?: any) => ({ 
  variants: [], 
  count: 0,
  data: [], 
  isLoading: false, 
  isError: false, 
  error: null 
});
export const useUser = () => ({ 
  data: { 
    first_name: "John", 
    last_name: "Doe", 
    email: "john.doe@example.com", 
    avatar_url: null 
  }, 
  isLoading: false, 
  isError: false, 
  error: null 
});

export const useMe = () => ({ 
  user: { 
    first_name: "John", 
    last_name: "Doe", 
    email: "john.doe@example.com", 
    avatar_url: null 
  }, 
  isPending: false, 
  isError: false, 
  error: null 
});
export const useUsers = () => ({ data: [], isLoading: false, isError: false, error: null });
export const usePlugins = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useOrders = () => ({ data: [], isLoading: false, isError: false, error: null });

// Payment and financial hooks
export const useCapturePayment = (orderId?: string, paymentId?: string) => ({ 
  mutateAsync: async (data?: any) => ({}), 
  isPending: false,
  isLoading: false 
});
export const useRefundPayment = (orderId?: string, paymentId?: string) => ({ 
  mutateAsync: async (data?: any, options?: any) => ({}), 
  isPending: false,
  isLoading: false 
});
export const useCreateOrderCreditLine = (orderId?: string) => ({ 
  mutateAsync: async (data?: any, options?: any) => ({}), 
  isPending: false,
  isLoading: false 
});

// Order operations
export const useCancelOrder = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useMarkOrderFulfillmentAsDelivered = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useCreateOrderShipment = () => ({ mutateAsync: async () => ({}), isLoading: false });

// Transfer and changes
export const useRequestTransferOrder = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useCancelOrderTransfer = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useOrderChanges = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useOrderLineItems = () => ({ data: [], isLoading: false, isError: false, error: null });

// Inventory and reservations
export const useReservationItems = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useCreateReservationItem = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useBatchInventoryItemsLocationLevels = () => ({ mutateAsync: async () => ({}), isLoading: false });

// Product operations
export const useExportProducts = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useImportProducts = () => ({ mutateAsync: async () => ({}), isLoading: false });
export const useConfirmImportProducts = () => ({ mutateAsync: async () => ({}), isLoading: false });

// Location services
export const useStockLocation = () => ({ data: null, isLoading: false, isError: false, error: null });

// Additional hooks that may be missing in specific components
export const useOrderEditRequests = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useExchanges = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useExchange = () => ({ data: null, isLoading: false, isError: false, error: null });
export const useOrderEdit = () => ({ data: null, isLoading: false, isError: false, error: null });
export const useOrderEdits = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useCreateClaim = (orderId?: string) => ({ 
  mutateAsync: async (data?: any) => ({ id: 'claim-123' }), 
  isPending: false,
  isLoading: false 
});
export const useCreateReturn = (orderId?: string, claimId?: string) => ({ 
  mutateAsync: async (data?: any, options?: any) => ({ id: 'return-123' }), 
  isPending: false,
  isLoading: false 
});
export const useClaim = (claimId?: string, options?: any, config?: any) => ({ 
  claim: claimId ? { id: claimId, return_id: 'return-123' } : null, 
  isLoading: false, 
  isError: false, 
  error: null 
});
export const useReturn = (returnId?: string, options?: any, config?: any) => ({ 
  return: returnId ? { id: returnId } : null, 
  isLoading: false, 
  isError: false, 
  error: null 
});

// Fulfillment operations 
export const useFulfillments = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useFulfillment = () => ({ data: null, isLoading: false, isError: false, error: null });

// Payment operations
export const usePayments = () => ({ data: [], isLoading: false, isError: false, error: null });
export const usePayment = () => ({ data: null, isLoading: false, isError: false, error: null });

// Return reasons and other utilities
export const useReturnReasons = () => ({ data: [], isLoading: false, isError: false, error: null });
export const useReturnReason = () => ({ data: null, isLoading: false, isError: false, error: null });

// Collections and categories
export const useCollection = () => ({ data: null, isLoading: false, isError: false, error: null });
export const useProductCategory = () => ({ data: null, isLoading: false, isError: false, error: null });
