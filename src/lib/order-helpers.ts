import type { AdminOrder } from "@medusajs/types"

export const getOrderPaymentStatus = (order: AdminOrder): string => {
  if (!order.payment_status) return "not_paid"
  
  switch (order.payment_status) {
    case "not_paid":
      return "Not Paid"
    case "awaiting":
      return "Awaiting"
    case "captured":
      return "Paid"
    case "partially_refunded":
      return "Partially Refunded"
    case "refunded":
      return "Refunded"
    case "canceled":
      return "Canceled"
    default:
      return order.payment_status
  }
}

export const getOrderFulfillmentStatus = (order: AdminOrder): string => {
  if (!order.fulfillment_status) return "not_fulfilled"
  
  switch (order.fulfillment_status) {
    case "not_fulfilled":
      return "Not Fulfilled"
    case "partially_fulfilled":
      return "Partially Fulfilled"
    case "fulfilled":
      return "Fulfilled"
    case "partially_shipped":
      return "Partially Shipped"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Delivered"
    case "canceled":
      return "Canceled"
    default:
      return order.fulfillment_status
  }
}

export const getOrderStatus = (order: AdminOrder): string => {
  if (order.canceled_at) return "Canceled"
  
  const paymentStatus = order.payment_status
  const fulfillmentStatus = order.fulfillment_status
  
  if (paymentStatus === "refunded") return "Refunded"
  if (fulfillmentStatus === "delivered") return "Delivered"
  if (fulfillmentStatus === "shipped") return "Shipped"
  if (fulfillmentStatus === "fulfilled") return "Fulfilled"
  if (paymentStatus === "captured") return "Paid"
  
  return "Pending"
}
