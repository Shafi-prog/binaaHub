// Promotion utilities
export function getPromotionStatus(promotion: any): { label: string; color: string } {
  if (!promotion) {
    return { label: 'Unknown', color: 'gray' }
  }
  
  const now = new Date()
  const startDate = promotion.starts_at ? new Date(promotion.starts_at) : null
  const endDate = promotion.ends_at ? new Date(promotion.ends_at) : null
  
  // Check if promotion is disabled
  if (promotion.is_disabled) {
    return { label: 'Disabled', color: 'red' }
  }
  
  // Check if promotion hasn't started yet
  if (startDate && now < startDate) {
    return { label: 'Scheduled', color: 'blue' }
  }
  
  // Check if promotion has ended
  if (endDate && now > endDate) {
    return { label: 'Expired', color: 'red' }
  }
  
  // Promotion is currently active
  return { label: 'Active', color: 'green' }
}

export function isPromotionActive(promotion: any): boolean {
  const status = getPromotionStatus(promotion)
  return status.label === 'Active'
}

export function isPromotionExpired(promotion: any): boolean {
  const status = getPromotionStatus(promotion)
  return status.label === 'Expired'
}

export function isPromotionScheduled(promotion: any): boolean {
  const status = getPromotionStatus(promotion)
  return status.label === 'Scheduled'
}

export function isPromotionDisabled(promotion: any): boolean {
  const status = getPromotionStatus(promotion)
  return status.label === 'Disabled'
}
