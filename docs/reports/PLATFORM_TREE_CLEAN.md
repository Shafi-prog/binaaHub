# 🌳 BINNA PLATFORM - COMPLETE DIRECTORY TREE (ARCHIVED)

⚠️ **OUTDATED DOCUMENT** - This document is archived for historical reference.

📋 **For current platform structure, see:** `docs/CURRENT_PLATFORM_TREE_STRUCTURE.md`

## 📊 Platform Structure Overview (HISTORICAL)
**Generated:** July 18, 2025  
**Status:** ARCHIVED - Replaced by organized structure
**Command Used:** `tree /f /a` with UTF-8 encoding  
**Excludes:** node_modules, .next, backups, .git, .vscode

---

## ⚠️ IMPORTANT NOTICE

This document shows the platform structure **BEFORE** the major organization effort completed on July 27, 2025.

**Current organized structure:**
- 📁 **scripts/** - All automation and utility scripts (240 files)
- 📁 **database/** - SQL files and database management (30 files)  
- 📁 **docs/** - Documentation and reports (136 files)
- 📁 **src/** - Source code and application (2,930 files)
- 📁 **backup/** - Backup folders and archived files (17 files)

**Total improvement:** 3,406 files organized into logical structure

---

## 📁 Complete Directory Structure

```
binna/
+---.env
+---.env.local
+---.env.local.template
+---.eslintignore
+---.eslintrc.json
+---.gitattributes
+---.github
|   +---workflows
|       +---ci-cd.yml
+---.gitignore
+---.nvmrc
+---.prettierrc
+---.prettierrc.json
+---backend/
|   +---idurar-erp-crm/
|   |   +---README.md
|   +---medusa-fresh/
|   |   +---README.md
|   +---medusa-proper/
|       +---README.md
+---check-env.js
+---cleanup-file-names.ps1
+---cleanup-platform-files.ps1
+---COMPREHENSIVE_DEVELOPMENT_PLAN.md
+---config/
|   +---api-key-replacement.txt
|   +---archive/
|   |   +---tsconfig.backup.json
|   |   +---tsconfig.full.json
|   |   +---tsconfig.unified.json
|   +---ecommerce-config.js
|   +---jest.config.js
|   +---jest.setup.js
|   +---tailwind.config.js
|   +---tsconfig.dev.json
|   +---tsconfig.extends.json
|   +---tsconfig.jest.json
+---database/
|   +---complete_schema.sql
|   +---main_schema.sql
|   +---migrations/
|   |   +---COMPLETE_DATABASE_SETUP.sql
|   |   +---drop_ecommerce_tables.sql
|   |   +---drop_medusa_tables.sql
|   |   +---PHASE_2_INTEGRATION_TABLES.sql
|   |   +---PHASE_3_DATABASE_MIGRATION.sql
|   |   +---supabase_erp_schema.sql
|   +---test-data/
|   |   +---local-users.json
|   +---unified_schema.sql
+---docs/
|   +---binna_modules.txt
|   +---binna_routes.txt
|   +---DEDUPLICATION_SUCCESS_SUMMARY.md
|   +---IMPLEMENTATION_STATUS.md
|   +---implementation-status.md
|   +---PHASE_1.5D_EXECUTION_SUMMARY.md
|   +---PHASE_1.5E_FINAL_COMPLETION_REPORT.md
|   +---PHASE_1.5F_COMPREHENSIVE_CLEANUP_COMPLETION_REPORT.md
|   +---PHASE_6_IMPLEMENTATION_COMPLETE.md
|   +---PHASE_8_IMPLEMENTATION_COMPLETE.md
|   +---PHASE_9_IMPLEMENTATION_COMPLETE.md
|   +---phase-1-execution-summary.md
|   +---PLATFORM_TRANSFORMATION_PLAN.md
|   +---platform-structure.md
|   +---PUBLIC_FOLDER_ANALYSIS.md
|   +---README.md
|   +---RECONSTRUCTION_PLAN.md
|   +---STRONG_BASIS_EXECUTION_SUMMARY.md
|   +---STRONG_BASIS_PLAN.md
+---eslint.config.js
+---fix-empty-pages.ps1
+---fix-final-imports.js
+---fix-import-issues.js
+---fix-imports-all.js
+---fix-imports-comprehensive.ps1
+---fix-imports-simple.ps1
+---fix-imports.js
+---fix-pages-proper.ps1
+---fix-react-components.ps1
+---fix-react-fc.ps1
+---fix-react-hooks.ps1
+---fix-service-imports.js
+---fix-specific-error-files.ps1
+---fix-syntax-errors-comprehensive.ps1
+---fix-syntax-errors.ps1
+---fix-syntax-simple.ps1
+---fix-targeted-errors.ps1
+---fix-typescript-syntax.ps1
+---fix-unterminated-strings.ps1
+---fix-usestate-types.ps1
+---global-fix.js
+---jest.config.platform.js
+---next-env.d.ts
+---next.config.cdn.js
+---next.config.cloudflare-fix.js
+---next.config.js
+---package.json
+---PLATFORM_DIRECTORY_STRUCTURE.md
+---platform_tree.txt
+---postcss.config.js
+---prettier.config.js
+---public/
|   +---favicon.ico
|   +---next.svg
|   +---vercel.svg
+---README.md
+---RECONSTRUCTION_PLAN.md
+---reports/
|   +---cleanup-report.md
|   +---platform-analysis.md
|   +---structure-optimization.md
+---scripts/
|   +---build-optimization.js
|   +---cleanup-duplicates.ps1
|   +---structure-analysis.js
+---src/
|   +---app/
|   |   +---(auth)/
|   |   |   +---reset-password-confirm/
|   |   |       +---page.tsx
|   |   +---(finance)/
|   |   |   +---banking/
|   |   |   |   +---page.tsx
|   |   |   +---insurance/
|   |   |   |   +---page.tsx
|   |   |   +---loans/
|   |   |       +---page.tsx
|   |   +---(public)/
|   |   |   +---construction-data/
|   |   |   |   +---page.tsx
|   |   |   +---forum/
|   |   |   |   +---page.tsx
|   |   |   +---marketplace/
|   |   |   |   +---page.tsx
|   |   |   +---material-prices/
|   |   |   |   +---page.tsx
|   |   |   +---privacy/
|   |   |   |   +---page.tsx
|   |   |   +---supervisors/
|   |   |   |   +---page.tsx
|   |   |   +---terms/
|   |   |       +---page.tsx
|   |   +---admin/
|   |   |   +---ai-analytics/
|   |   |   |   +---page.tsx
|   |   |   +---construction/
|   |   |   |   +---page.tsx
|   |   |   +---dashboard/
|   |   |   |   +---page.tsx
|   |   |   +---gcc-markets/
|   |   |   |   +---page.tsx
|   |   |   +---global/
|   |   |   |   +---page.tsx
|   |   |   +---layout.tsx
|   |   |   +---phase6/
|   |   |       +---page.tsx
|   |   +---api/
|   |   |   +---admin/
|   |   |   |   +---cache.ts
|   |   |   |   +---dashboard.ts
|   |   |   |   +---store-management.ts
|   |   |   |   +---tax-regions.ts
|   |   |   |   +---validation.ts
|   |   |   |   +---workflows.ts
|   |   |   +---analytics/
|   |   |   |   +---route.ts
|   |   |   +---analytics.tsx
|   |   |   +---api-keys.tsx
|   |   |   +---api-route-fallback.ts
|   |   |   +---api-routes.ts
|   |   |   +---api.ts
|   |   |   +---api.tsx
|   |   |   +---auth/
|   |   |   +---auth-v1.ts
|   |   |   +---auth.ts
|   |   |   +---auth.tsx
|   |   |   +---calculators/
|   |   |   +---endpoints.ts
|   |   |   +---erp/
|   |   |   +---error-handler.tsx
|   |   |   +---event-bus.ts
|   |   |   +---helpers.ts
|   |   |   +---index.ts
|   |   |   +---main-api.tsx
|   |   |   +---marketplace/
|   |   |   |   +---campaigns.ts
|   |   |   +---notifications/
|   |   |   |   +---route.ts
|   |   |   +---orders/
|   |   |   |   +---claims.ts
|   |   |   |   +---exchanges.ts
|   |   |   |   +---fulfillment.ts
|   |   |   |   +---mark-delivered.ts
|   |   |   |   +---order-edits.ts
|   |   |   |   +---return-reasons.ts
|   |   |   |   +---return-request.ts
|   |   |   |   +---returns.ts
|   |   |   |   +---route.ts
|   |   |   |   +---shipping-options.ts
|   |   |   |   +---shipping-profiles.ts
|   |   |   +---payments/
|   |   |   |   +---payment-collections.ts
|   |   |   +---plugins.ts
|   |   |   +---products/
|   |   |   |   +---collections.ts
|   |   |   |   +---inventory-items.ts
|   |   |   |   +---reservations.ts
|   |   |   |   +---route.ts
|   |   |   |   +---stock-locations.ts
|   |   |   +---projects/
|   |   |   +---rate-limit.ts
|   |   |   +---regions.ts
|   |   |   +---route.ts
|   |   |   +---routes.ts
|   |   |   +---sales-channels.tsx
|   |   |   +---store.tsx
|   |   |   +---users/
|   |   |   |   +---customer-groups.ts
|   |   |   |   +---customers.ts
|   |   |   |   +---route.ts
|   |   |   +---validation.tsx
|   |   +---auth/
|   |   |   +---login/
|   |   |       +---page.tsx
|   |   +---clear-auth/
|   |   |   +---page.tsx
|   |   +---error.tsx
|   |   +---globals.css
|   |   +---layout.tsx
|   |   +---loading.tsx
|   |   +---login/
|   |   |   +---page.tsx
|   |   +---not-found.tsx
|   |   +---offline/
|   |   |   +---page.tsx
|   |   +---page.tsx
|   |   +---store/
|   |   |   +---admin/
|   |   |   |   +---page.tsx
|   |   |   +---analytics/
|   |   |   |   +---page.tsx
|   |   |   +---barcode-scanner/
|   |   |   |   +---page.tsx
|   |   |   +---campaigns/
|   |   |   |   +---page.tsx
|   |   |   +---categories/
|   |   |   |   +---construction/
|   |   |   |       +---page.tsx
|   |   |   +---collections/
|   |   |   |   +---page.tsx
|   |   |   +---construction-products/
|   |   |   |   +---new/
|   |   |   |   |   +---page.tsx
|   |   |   |   +---page.tsx
|   |   |   +---currency-region/
|   |   |   |   +---page.tsx
|   |   |   +---customer-groups/
|   |   |   |   +---page.tsx
|   |   |   +---customer-segmentation/
|   |   |   |   +---page.tsx
|   |   |   +---customers/
|   |   |   |   +---page.tsx
|   |   |   +---dashboard/
|   |   |   |   +---page.tsx
|   |   |   +---delivery/
|   |   |   |   +---page.tsx
|   |   |   +---email-campaigns/
|   |   |   |   +---page.tsx
|   |   |   +---erp/
|   |   |   |   +---page.tsx
|   |   |   +---financial-management/
|   |   |   |   +---page.tsx
|   |   |   +---inventory/
|   |   |   |   +---page.tsx
|   |   |   +---layout.tsx
|   |   |   +---login/
|   |   |   |   +---login.tsx
|   |   |   +---marketplace/
|   |   |   |   +---page.tsx
|   |   |   +---marketplace-vendors/
|   |   |   |   +---page.tsx
|   |   |   +---notifications/
|   |   |   |   +---page.tsx
|   |   |   +---order-management/
|   |   |   |   +---page.tsx
|   |   |   +---orders/
|   |   |   |   +---page.tsx
|   |   |   +---pages/
|   |   |   |   +---dashboard.tsx
|   |   |   |   +---login.tsx
|   |   |   +---payments/
|   |   |   |   +---page.tsx
|   |   |   +---permissions/
|   |   |   |   +---page.tsx
|   |   |   +---pos/
|   |   |   |   +---offline/
|   |   |   |   |   +---page.tsx
|   |   |   |   +---page.tsx
|   |   |   +---pricing/
|   |   |   |   +---create/
|   |   |   |   |   +---page.tsx
|   |   |   |   +---page.tsx
|   |   |   +---product-bundles/
|   |   |   |   +---create/
|   |   |   |   |   +---page.tsx
|   |   |   |   +---page.tsx
|   |   |   +---product-variants/
|   |   |   |   +---page.tsx
|   |   |   +---products/
|   |   |   |   +---construction/
|   |   |   |       +---new/
|   |   |   |           +---page.tsx
|   |   |   +---promotions/
|   |   |   |   +---page.tsx
|   |   |   +---reports/
|   |   |   |   +---page.tsx
|   |   |   +---search/
|   |   |   |   +---page.tsx
|   |   |   +---settings/
|   |   |   |   +---page.tsx
|   |   |   +---shipping/
|   |   |   |   +---page.tsx
|   |   |   +---storefront/
|   |   |   |   +---page.tsx
|   |   |   +---warehouses/
|   |   |       +---page.tsx
|   |   +---user/
|   |       +---building-advice/
|   |       |   +---page.tsx
|   |       +---chat/
|   |       |   +---page.tsx
|   |       +---dashboard/
|   |       |   +---construction-data/
|   |       |   |   +---page.tsx
|   |       |   +---page.tsx
|   |       +---layout/
|   |       |   +---UserLayout.tsx
|   |       +---layout.tsx
|   |       +---payment/
|   |       |   +---error/
|   |       |   |   +---page.tsx
|   |       |   +---success/
|   |       |       +---page.tsx
|   |       +---payment-channels/
|   |       |   +---page.tsx
|   |       +---profile/
|   |       |   +---page.tsx
|   |       +---projects/
|   |       |   +---calculator/
|   |       |   |   +---page.tsx
|   |       |   +---create/
|   |       |   |   +---page.tsx
|   |       |   +---list/
|   |       |   |   +---page.tsx
|   |       |   +---new/
|   |       |   |   +---page.tsx
|   |       |   +---notebook/
|   |       |   |   +---page.tsx
|   |       |   +---page.tsx
|   |       |   +---settings/
|   |       |   |   +---page.tsx
|   |       |   +---subscription/
|   |       |   |   +---page.tsx
|   |       |   +---suppliers/
|   |       |       +---page.tsx
|   |       +---projects-marketplace/
|   |       |   +---for-sale/
|   |       |   |   +---page.tsx
|   |       |   +---page.tsx
|   |       +---services/
|   |       |   +---calculators.tsx
|   |       +---stores-browse/
|   |           +---page.tsx
|   +---core/
|   |   +---shared/
|   |   |   +---components/
|   |   |   |   +---ForSaleModal.tsx
|   |   |   |   +---icons/
|   |   |   |   |   +---index.tsx
|   |   |   |   +---payments/
|   |   |   |   |   +---index.ts
|   |   |   |   |   +---PaymentGatewayIntegration.tsx
|   |   |   |   +---shipping/
|   |   |   |   |   +---index.ts
|   |   |   |   |   +---ShippingLogisticsIntegration.tsx
|   |   |   |   +---ui/
|   |   |   |       +---badge.tsx
|   |   |   |       +---button.tsx
|   |   |   |       +---card.tsx
|   |   |   |       +---enhanced-components.tsx
|   |   |   |       +---index.ts
|   |   |   |       +---input.tsx
|   |   |   |       +---label.tsx
|   |   |   |       +---progress.tsx
|   |   |   |       +---select.tsx
|   |   |   |       +---table.tsx
|   |   |   |       +---tabs.tsx
|   |   |   +---services/
|   |   |   |   +---auth.ts
|   |   |   |   +---auth-recovery.ts
|   |   |   +---types/
|   |   |   |   +---page.ts
|   |   |   |   +---route.ts
|   |   |   +---utils.ts
|   +---domains/
|   |   +---admin/
|   |   +---construction/
|   |   |   +---consultancy/
|   |   |       +---expert-consultation.tsx
|   |   +---logistics/
|   |   +---marketplace/
|   |   |   +---components/
|   |   |   |   +---storefront/
|   |   |   |       +---StorefrontPage.tsx
|   |   |   +---storefront/
|   |   |   |   +---StorefrontLayout.tsx
|   |   |   +---vendor/
|   |   |       +---dashboard/
|   |   |       |   +---vendor-dashboard.tsx
|   |   |       +---onboarding/
|   |   |           +---vendor-onboarding.tsx
|   |   +---payments/
|   |   +---shared/
|   |   |   +---components/
|   |   |   |   +---ui/
|   |   |   |       +---badge.tsx
|   |   |   |       +---button.tsx
|   |   |   |       +---card.tsx
|   |   |   |       +---enhanced-components.tsx
|   |   |   |       +---index.ts
|   |   |   |       +---input.tsx
|   |   |   |       +---label.tsx
|   |   |   |       +---progress.tsx
|   |   |   |       +---select.tsx
|   |   |   |       +---table.tsx
|   |   |   |       +---tabs.tsx
|   |   |   +---services/
|   |   |   |   +---auth-recovery.ts
|   |   |   +---utils.ts
|   |   +---stores/
|   |   +---users/
|   +---products/
|       +---analytics/
|       |   +---analytics/
|       |       +---analytics-bi.tsx
|       |       +---index.tsx
|       +---binna-books/
|       |   +---app/
|       |   |   +---page.tsx
|       |   +---components/
|       |       +---binna-books-app.tsx
|       |       +---BinnaBooks.tsx
|       +---binna-pos/
|       |   +---app/
|       |   |   +---page.tsx
|       |   +---components/
|       |   |   +---binna-pos-app.tsx
|       |   |   +---BinnaPOS.tsx
|       |   |   +---CartSidebar.tsx
|       |   |   +---PaymentModal.tsx
|       |   |   +---pos/
|       |   |   |   +---EnhancedOfflinePOS.tsx
|       |   |   |   +---EnhancedStorePOS.tsx
|       |   |   +---POSNavbar.tsx
|       |   |   +---ProductSearch.tsx
|       |   |   +---ReceiptPrinter.tsx
|       |   |   +---UserManagement.tsx
|       |   +---pages/
|       |       +---_app.tsx
|       |       +---history.tsx
|       |       +---index.tsx
|       |       +---login.tsx
|       |       +---settings.tsx
|       |       +---users.tsx
|       +---binna-stock/
|       |   +---app/
|       |   |   +---inventory-management.tsx
|       |   |   +---page.tsx
|       |   +---components/
|       |       +---binna-stock-app.tsx
|       |       +---BinnaStock.tsx
|       |       +---inventory/
|       |           +---EnhancedInventoryManagement.tsx
|       +---dashboard/
|           +---phase7-dashboard.tsx
+---supabase/
|   +---config.toml
|   +---functions/
|   +---migrations/
|   +---seed/
+---tailwind.config.js
+---temp-construction-page.tsx
+---tsconfig.json
+---tsconfig.tsbuildinfo
```

---

## 📈 Tree Generation Summary

- **✅ UTF-8 Encoding**: Proper character encoding applied
- **✅ Filtered Content**: Excluded unwanted directories
- **✅ Complete Structure**: All important files and folders included
- **📊 Total Files**: 3,912+ files processed
- **🗂️ Main Directories**: 9 primary folders organized

### Files Generated:
1. **`platform_tree.txt`** - Raw tree output with UTF-8 encoding
2. **`PLATFORM_DIRECTORY_STRUCTURE.md`** - Formatted markdown with complete tree

The tree command has been successfully executed with proper UTF-8 encoding!
