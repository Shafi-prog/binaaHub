// @ts-nocheck
// RMA (Return Merchandise Authorization) utilities
import type { AdminOrderLineItem, AdminReturn, AdminReturnItem } from '@medusajs/types'

export function getReturnableQuantity(item: AdminOrderLineItem): number {
  const fulfilled = item.fulfilled_quantity || 0
  const returned = (item as any).returned_quantity || 0
  return Math.max(0, fulfilled - returned)
}

export function getRefundableAmount(item: AdminOrderLineItem): number {
  return (item as any).refundable || 0
}

export function isItemReturnable(item: AdminOrderLineItem): boolean {
  return getReturnableQuantity(item) > 0
}

export function isItemRefundable(item: AdminOrderLineItem): boolean {
  return getRefundableAmount(item) > 0
}

export function getReturnTotal(returnOrder: AdminReturn): number {
  return returnOrder.total || 0
}

export function getReturnRefundAmount(returnOrder: AdminReturn): number {
  return returnOrder.refund_amount || 0
}

export function isReturnRequested(returnOrder: AdminReturn): boolean {
  return returnOrder.status === 'requested'
}

export function isReturnReceived(returnOrder: AdminReturn): boolean {
  return returnOrder.status === 'received'
}

export function isReturnCanceled(returnOrder: AdminReturn): boolean {
  return returnOrder.status === 'canceled'
}

export function getReturnItemQuantity(returnItem: AdminReturnItem): number {
  return returnItem.quantity || 0
}

export function getReturnItemTotal(returnItem: AdminReturnItem): number {
  return returnItem.total || 0
}

export function getReturnableQuantityForItem(item: AdminOrderLineItem, existingReturns: AdminReturn[] = []): number {
  const baseReturnable = getReturnableQuantity(item)
  
  // Calculate quantity already in pending returns
  const pendingReturnQuantity = existingReturns
    .filter(r => r.status === 'requested')
    .reduce((total, returnOrder) => {
      const returnItem = returnOrder.items?.find(ri => ri.item_id === item.id)
      return total + (returnItem?.quantity || 0)
    }, 0)
  
  return Math.max(0, baseReturnable - pendingReturnQuantity)
}


