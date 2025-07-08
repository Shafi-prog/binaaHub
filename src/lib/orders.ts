// @ts-nocheck
// Order utility functions
import type { AdminOrder, AdminPayment } from '@medusajs/types'

export function getPaymentsFromOrder(order: AdminOrder): AdminPayment[] {
  return order.payments || []
}

export function getOrderTotal(order: AdminOrder): number {
  return order.total || 0
}

export function getOrderSubtotal(order: AdminOrder): number {
  return order.subtotal || 0
}

export function getOrderTaxTotal(order: AdminOrder): number {
  return order.tax_total || 0
}

export function getOrderShippingTotal(order: AdminOrder): number {
  return order.shipping_total || 0
}

export function getOrderDiscountTotal(order: AdminOrder): number {
  return order.discount_total || 0
}

export function isOrderCancelled(order: AdminOrder): boolean {
  return order.status === 'cancelled'
}

export function isOrderCompleted(order: AdminOrder): boolean {
  return order.status === 'completed'
}

export function getOrderCreatedAt(order: AdminOrder): Date {
  return new Date(order.created_at)
}

export function getOrderUpdatedAt(order: AdminOrder): Date {
  return new Date(order.updated_at)
}


