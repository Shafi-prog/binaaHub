# BinnaPOS (Standalone)

## Migration Checklist

- [ ] Identify all POS-related features/components in `src/domains/stores/`, `src/standalone/`, and elsewhere
- [ ] Move POS pages to `src/standalone/binna-pos/pages/`
- [ ] Move POS components to `src/standalone/binna-pos/components/`
- [ ] Move POS utilities to `src/standalone/binna-pos/lib/`
- [ ] Move POS API handlers to `src/standalone/binna-pos/api/`
- [ ] Ensure all dependencies are listed in `src/standalone/binna-pos/package.json`
- [ ] Remove cross-dependencies on shared code (duplicate if needed for true independence)
- [ ] Add independent deployment scripts/configs in `src/standalone/binna-pos/deploy/`
- [ ] Test standalone POS build and run
- [ ] Update documentation in this README as migration progresses

---

## Feature Scaffold Checklist

- [ ] Cashier Login Screen (`pages/login.tsx`)
- [ ] Main POS Register (`components/BinnaPOS.tsx`)
- [ ] Product Search & Barcode Input (`components/ProductSearch.tsx`)
- [ ] Cart Sidebar (`components/CartSidebar.tsx`)
- [ ] Payment Modal (Cash/Card/Mada/STC Pay) (`components/PaymentModal.tsx`)
- [ ] Receipt Printing (`components/ReceiptPrinter.tsx`)
- [ ] Sales History (`pages/history.tsx`)
- [ ] Settings Page (`pages/settings.tsx`)
- [ ] Mock/Real API Integration (`lib/`)
- [ ] User Management (Cashier/Manager roles)
- [ ] Offline Mode Support
- [ ] Responsive Touch UI

---

## Next Steps
- Implement each feature as a separate component/page in the scaffold above.
- Update this checklist as features are completed.
