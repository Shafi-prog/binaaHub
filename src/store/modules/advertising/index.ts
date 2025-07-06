import { Module } from "@medusajs/utils"

// Models
export * from "./models/ad-campaign"
export * from "./models/ad-group"
export * from "./models/ad-keyword"
export * from "./models/ad-product"
export * from "./models/ad-performance-report"
export * from "./models/ad-audience"

// Services
export * from "./services/advertising-campaign"
export * from "./services/advertising-audience"

/**
 * Amazon PPC/DSP-Inspired Advertising Platform Module
 * 
 * This module provides comprehensive advertising capabilities inspired by Amazon's
 * advertising ecosystem, including:
 * 
 * CAMPAIGN MANAGEMENT:
 * - Sponsored Products campaigns (keyword and product targeting)
 * - Sponsored Brands campaigns (brand awareness and traffic)
 * - Sponsored Display campaigns (retargeting and lookalike audiences)
 * - Video advertising campaigns
 * - Audio advertising campaigns
 * 
 * TARGETING & AUDIENCES:
 * - Automatic and manual keyword targeting
 * - Product targeting (ASIN targeting)
 * - Custom audience creation and management
 * - Lookalike audiences based on customer data
 * - Interest and demographic targeting
 * - Retargeting audiences (website visitors, cart abandoners)
 * - Shopping behavior audiences
 * 
 * BIDDING & OPTIMIZATION:
 * - Dynamic bidding strategies (up/down, down only, fixed)
 * - Placement bidding adjustments
 * - Automated bid optimization based on performance
 * - ACOS (Advertising Cost of Sales) targeting
 * - ROAS (Return on Ad Spend) optimization
 * 
 * PERFORMANCE & REPORTING:
 * - Campaign performance reports
 * - Search term reports
 * - Placement performance reports
 * - Audience performance analysis
 * - Attribution reporting (view-through conversions, brand searches)
 * - Advanced metrics (new-to-brand, detail page views, etc.)
 * 
 * AMAZON-STYLE FEATURES:
 * - Portfolio management for campaign organization
 * - Negative keyword management
 * - Frequency capping for display campaigns
 * - Geographic and device targeting
 * - Brand protection and monitoring
 * - Creative performance optimization
 * 
 * AUTOMATION & AI:
 * - Automatic keyword discovery and suggestions
 * - Performance-based bid adjustments
 * - Underperformer identification and pausing
 * - Budget pacing and optimization
 * - Seasonal trend analysis and adjustments
 * 
 * This module integrates seamlessly with Binna's product catalog, customer data,
 * and order management to provide a complete advertising solution that matches
 * or exceeds Amazon's advertising capabilities.
 */
export const AdvertisingModule = Module("advertising", {
  service: [
    "AdvertisingCampaignService",
    "AdvertisingAudienceService"
  ],
})
