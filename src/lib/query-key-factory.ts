export type TQueryKey<
  T extends string,
  TListQueryType = any,
  TDetailQueryType = any
> = {
  all: readonly [T];
  list: (query?: TListQueryType) => readonly [T, "list", { query: TListQueryType }];
  detail: (id: TDetailQueryType, query?: TListQueryType) => readonly [T, "detail", TDetailQueryType, { query: TListQueryType }];
};

export function queryKeysFactory<
  T extends string,
  TListQueryType = any,
  TDetailQueryType = any
>(scope: T): TQueryKey<T, TListQueryType, TDetailQueryType> {
  return {
    all: [scope] as const,
    list: (query?: TListQueryType) => 
      [scope, "list", { query: query as TListQueryType }] as const,
    detail: (id: TDetailQueryType, query?: TListQueryType) => 
      [scope, "detail", id, { query: query as TListQueryType }] as const,
  };
}

// Pre-defined query key factories for common entities
export const productsQueryKeys = queryKeysFactory("products");
export const ordersQueryKeys = queryKeysFactory("orders");
export const customersQueryKeys = queryKeysFactory("customers");
export const regionsQueryKeys = queryKeysFactory("regions");
export const salesChannelsQueryKeys = queryKeysFactory("sales-channels");
export const inventoryQueryKeys = queryKeysFactory("inventory");
export const collectionsQueryKeys = queryKeysFactory("collections");
export const productTypesQueryKeys = queryKeysFactory("product-types");
export const productTagsQueryKeys = queryKeysFactory("product-tags");
export const stockLocationsQueryKeys = queryKeysFactory("stock-locations");
export const priceListsQueryKeys = queryKeysFactory("price-lists");
export const usersQueryKeys = queryKeysFactory("users");
export const storeQueryKeys = queryKeysFactory("store");
export const shippingOptionsQueryKeys = queryKeysFactory("shipping-options");
export const promotionsQueryKeys = queryKeysFactory("promotions");
export const claimsQueryKeys = queryKeysFactory("claims");
export const exchangesQueryKeys = queryKeysFactory("exchanges");
export const returnsQueryKeys = queryKeysFactory("returns");
export const fulfillmentQueryKeys = queryKeysFactory("fulfillment");
export const paymentsQueryKeys = queryKeysFactory("payments");
export const paymentCollectionsQueryKeys = queryKeysFactory("payment-collections");
export const orderEditsQueryKeys = queryKeysFactory("order-edits");
export const reservationsQueryKeys = queryKeysFactory("reservations");
export const returnReasonsQueryKeys = queryKeysFactory("return-reasons");
export const shippingProfilesQueryKeys = queryKeysFactory("shipping-profiles");
export const taxRegionsQueryKeys = queryKeysFactory("tax-regions");
export const taxRatesQueryKeys = queryKeysFactory("tax-rates");
export const tagsQueryKeys = queryKeysFactory("tags");
export const campaignsQueryKeys = queryKeysFactory("campaigns");
export const customerGroupsQueryKeys = queryKeysFactory("customer-groups");
export const invitesQueryKeys = queryKeysFactory("invites");
export const notificationsQueryKeys = queryKeysFactory("notifications");
export const apiKeysQueryKeys = queryKeysFactory("api-keys");
export const fulfillmentProvidersQueryKeys = queryKeysFactory("fulfillment-providers");
export const fulfillmentSetsQueryKeys = queryKeysFactory("fulfillment-sets");
export const workflowExecutionsQueryKeys = queryKeysFactory("workflow-executions");
export const pricePreferencesQueryKeys = queryKeysFactory("price-preferences");

export { queryKeysFactory as queryKeys };
