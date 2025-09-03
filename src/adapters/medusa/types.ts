// Minimal shim for @platform/types
// Provides loose types used across the app to allow compilation without Medusa

export type HttpTypes = any
export type RegionCountryDTO = any
export type AdminReturnReason = any
export type AdminApiKeyResponse = any
export type AdminSalesChannelResponse = any
export type CampaignBudgetTypeValues = any

// Generic fallbacks
export type InferEntityType<T = any> = any
export type Logger = any

// Re-export everything as any to be safe
const AnyTypes: any = {}
export default AnyTypes
