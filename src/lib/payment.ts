// Payment utilities
import type { AdminPayment, AdminRefund } from '@medusajs/types'

// Extended payment type to include status
type PaymentWithStatus = AdminPayment & { status?: string }

export function getTotalCaptured(payments: PaymentWithStatus[]): number {
  return payments.reduce((total, payment) => {
    if ((payment as any).status === 'captured') {
      return total + (payment.amount || 0)
    }
    return total
  }, 0)
}

export function getTotalPending(payments: PaymentWithStatus[]): number {
  return payments.reduce((total, payment) => {
    if ((payment as any).status === 'pending' || (payment as any).status === 'authorized') {
      return total + (payment.amount || 0)
    }
    return total
  }, 0)
}

export function getTotalRefunded(payments: PaymentWithStatus[]): number {
  return payments.reduce((total, payment) => {
    const refunds = (payment as any).refunds || []
    const refundedAmount = refunds.reduce((refundTotal: number, refund: AdminRefund) => {
      return refundTotal + (refund.amount || 0)
    }, 0)
    return total + refundedAmount
  }, 0)
}

export function getPaymentStatus(payment: PaymentWithStatus): string {
  return (payment as any).status || 'unknown'
}

export function isPaymentCaptured(payment: PaymentWithStatus): boolean {
  return (payment as any).status === 'captured'
}

export function isPaymentAuthorized(payment: PaymentWithStatus): boolean {
  return (payment as any).status === 'authorized'
}

export function isPaymentPending(payment: PaymentWithStatus): boolean {
  return (payment as any).status === 'pending'
}

export function isPaymentRefunded(payment: PaymentWithStatus): boolean {
  const refunds = (payment as any).refunds || []
  return refunds.length > 0
}

export function getPaymentRefunds(payment: AdminPayment): AdminRefund[] {
  return (payment as any).refunds || []
}

export function getPaymentProvider(payment: AdminPayment): string {
  return payment.provider_id || 'unknown'
}

export function getPaymentAmount(payment: AdminPayment): number {
  return payment.amount || 0
}

export function getPaymentCurrency(payment: AdminPayment): string {
  return payment.currency_code || 'USD'
}
