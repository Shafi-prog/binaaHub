// @ts-nocheck
// Global Market Configuration Module (Phase 5)
// Supports Europe, North America, and Asia-Pacific regions

export interface Region {
  code: string;
  name: string;
  currency: string;
  language: string;
  taxRate: number;
  timezone: string;
}

export const globalRegions: Region[] = [
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', language: 'ar', taxRate: 0.15, timezone: 'Asia/Riyadh' },
  { code: 'AE', name: 'UAE', currency: 'AED', language: 'ar', taxRate: 0.05, timezone: 'Asia/Dubai' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD', language: 'ar', taxRate: 0.00, timezone: 'Asia/Kuwait' },
  { code: 'QA', name: 'Qatar', currency: 'QAR', language: 'ar', taxRate: 0.00, timezone: 'Asia/Qatar' },
  // Phase 5 - New Global Markets
  { code: 'US', name: 'United States', currency: 'USD', language: 'en', taxRate: 0.08, timezone: 'America/New_York' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP', language: 'en', taxRate: 0.20, timezone: 'Europe/London' },
  { code: 'DE', name: 'Germany', currency: 'EUR', language: 'de', taxRate: 0.19, timezone: 'Europe/Berlin' },
  { code: 'FR', name: 'France', currency: 'EUR', language: 'fr', taxRate: 0.20, timezone: 'Europe/Paris' },
  { code: 'JP', name: 'Japan', currency: 'JPY', language: 'ja', taxRate: 0.10, timezone: 'Asia/Tokyo' },
  { code: 'AU', name: 'Australia', currency: 'AUD', language: 'en', taxRate: 0.10, timezone: 'Australia/Sydney' },
];

export function getRegionByCode(code: string): Region | undefined {
  return globalRegions.find(r => r.code === code);
}

export function formatCurrency(amount: number, regionCode: string): string {
  const region = getRegionByCode(regionCode);
  if (!region) return `${amount}`;
  
  return new Intl.NumberFormat(region.language, {
    style: 'currency',
    currency: region.currency
  }).format(amount);
}

export function calculateTax(amount: number, regionCode: string): number {
  const region = getRegionByCode(regionCode);
  return region ? amount * region.taxRate : 0;
}


