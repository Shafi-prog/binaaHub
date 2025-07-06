import { Module, Modules } from "@medusajs/framework/utils"

export default Module(Modules.PRODUCT, {
  // Enhanced marketplace module with Amazon-inspired features
})

// Export Amazon Brand Registry-inspired models
export {
  BrandRegistry,
  BrandRegistryStatus,
  BrandProtectionLevel,
  IPType,
  DocumentType,
  BrandProtectionAlert,
  AlertType,
  AlertSeverity,
  AlertStatus,
  BrandInfringementCase,
  CaseStatus,
  CaseType,
  BrandStorefront,
  StorefrontStatus,
} from "./models/brand-registry"

// Export brand registry service
export { BrandRegistryService } from "./services/brand-registry"

// Export existing marketplace models (vendor, commission, etc.)
export {
  MarketplaceVendor,
  VendorStatus,
  BusinessType,
  VendorCommission,
  CommissionType,
  VendorPayout,
  PayoutStatus,
} from "./models/marketplace-vendor"
