// @ts-nocheck
// Order item utilities
import type { AdminOrderLineItem } from '@medusajs/types'
import { OrderLineItemDTO } from './order-types'

export function getFulfillableQuantity(item: AdminOrderLineItem): number
export function getFulfillableQuantity(item: OrderLineItemDTO): number
export function getFulfillableQuantity(item: AdminOrderLineItem | OrderLineItemDTO): number {
  const fulfilled = (item as any).fulfilled_quantity || (item as any).detail?.fulfilled_quantity || 0
  const returned = (item as any).returned_quantity || 0
  return Math.max(0, item.quantity - fulfilled - returned)
}

export function getReturnableQuantity(item: AdminOrderLineItem): number
export function getReturnableQuantity(item: OrderLineItemDTO): number
export function getReturnableQuantity(item: AdminOrderLineItem | OrderLineItemDTO): number {
  const fulfilled = (item as any).fulfilled_quantity || (item as any).detail?.fulfilled_quantity || 0
  const returned = (item as any).returned_quantity || 0
  return Math.max(0, fulfilled - returned)
}

export function getQuantityAvailableForReturn(item: AdminOrderLineItem): number {
  return getReturnableQuantity(item)
}

export function getItemTotal(item: AdminOrderLineItem): number {
  return item.total || 0
}

export function getItemSubtotal(item: AdminOrderLineItem): number {
  return item.subtotal || 0
}

export function getItemTaxTotal(item: AdminOrderLineItem): number {
  return item.tax_total || 0
}

export function getItemDiscountTotal(item: AdminOrderLineItem): number {
  return item.discount_total || 0
}

export function getItemUnitPrice(item: AdminOrderLineItem): number {
  return item.unit_price || 0
}

export function isItemFulfilled(item: AdminOrderLineItem): boolean
export function isItemFulfilled(item: OrderLineItemDTO): boolean
export function isItemFulfilled(item: AdminOrderLineItem | OrderLineItemDTO): boolean {
  const fulfilled = (item as any).fulfilled_quantity || (item as any).detail?.fulfilled_quantity || 0
  return fulfilled >= item.quantity
}

export function isItemReturned(item: AdminOrderLineItem): boolean
export function isItemReturned(item: OrderLineItemDTO): boolean
export function isItemReturned(item: AdminOrderLineItem | OrderLineItemDTO): boolean {
  const returned = (item as any).returned_quantity || 0
  return returned > 0
}

export function isItemPartiallyFulfilled(item: AdminOrderLineItem): boolean
export function isItemPartiallyFulfilled(item: OrderLineItemDTO): boolean
export function isItemPartiallyFulfilled(item: AdminOrderLineItem | OrderLineItemDTO): boolean {
  const fulfilled = (item as any).fulfilled_quantity || (item as any).detail?.fulfilled_quantity || 0
  return fulfilled > 0 && fulfilled < item.quantity
}


