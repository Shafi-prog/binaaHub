// Credit line utilities
import type { AdminOrder } from '@medusajs/types'

export function getTotalCreditLines(order: AdminOrder): number {
  // Assuming credit_line_total exists on order or we calculate from line items
  if ((order as any).credit_line_total !== undefined) {
    return (order as any).credit_line_total
  }
  
  // Calculate from potential credit line items
  const creditLineItems = (order as any).credit_lines || []
  return creditLineItems.reduce((total: number, line: any) => {
    return total + (line.amount || 0)
  }, 0)
}

export function hasCreditLines(order: AdminOrder): boolean {
  return getTotalCreditLines(order) > 0
}

export function getCreditLineAmount(creditLine: any): number {
  return creditLine?.amount || 0
}

export function getCreditLineType(creditLine: any): string {
  return creditLine?.type || 'credit'
}

export function getCreditLineDescription(creditLine: any): string {
  return creditLine?.description || 'Credit applied'
}

export function isCreditLineValid(creditLine: any): boolean {
  return creditLine && typeof creditLine.amount === 'number' && creditLine.amount > 0
}
