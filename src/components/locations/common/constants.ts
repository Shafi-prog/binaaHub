// Location-related constants
export const LOCATION_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

export const LOCATION_TYPES = {
  WAREHOUSE: 'warehouse',
  STORE: 'store',
  FULFILLMENT_CENTER: 'fulfillment_center',
} as const;

export const FULFILLMENT_STATUSES = {
  NOT_FULFILLED: 'not_fulfilled',
  PARTIALLY_FULFILLED: 'partially_fulfilled',
  FULFILLED: 'fulfilled',
  PARTIALLY_SHIPPED: 'partially_shipped',
  SHIPPED: 'shipped',
  PARTIALLY_RETURNED: 'partially_returned',
  RETURNED: 'returned',
  CANCELED: 'canceled',
  REQUIRES_ACTION: 'requires_action',
} as const;

export const SHIPMENT_STATUSES = {
  NOT_SHIPPED: 'not_shipped',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
} as const;

export type LocationStatus = typeof LOCATION_STATUSES[keyof typeof LOCATION_STATUSES];
export type LocationType = typeof LOCATION_TYPES[keyof typeof LOCATION_TYPES];
export type FulfillmentStatus = typeof FULFILLMENT_STATUSES[keyof typeof FULFILLMENT_STATUSES];
export type ShipmentStatus = typeof SHIPMENT_STATUSES[keyof typeof SHIPMENT_STATUSES];
