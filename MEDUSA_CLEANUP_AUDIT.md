# 🔍 Medusa References Audit - Cleanup Required

## 📋 Files Requiring "Medusa" Reference Cleanup

### 1. TypeScript Import Files (Backend Only - OK)
These are legitimate backend imports that should remain:
```typescript
// These imports are fine - they're backend SDK usage
import Medusa from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { FetchError } from "@medusajs/js-sdk"
```

**Files with legitimate backend imports:**
- `src/store/client.ts` ✅ (SDK client setup)
- `src/store/*.tsx` files ✅ (API service files)

### 2. User-Facing Code Requiring Cleanup

#### Component Names & Variables
Search for these patterns in React components:
- Component names containing "medusa"
- Variable names like `medusaClient`, `medusaApi`
- Function names with "medusa" prefix
- CSS class names with "medusa"

#### UI Text & Labels  
Search for user-visible text containing:
- "Medusa" in button labels
- "Medusa" in page titles
- "Medusa" in form labels
- "Medusa" in error messages
- "Medusa" in help text

#### File Names
Check for files named with "medusa":
- Component files: `*medusa*.tsx`
- Utility files: `*medusa*.ts`
- Style files: `*medusa*.css`

### 3. Documentation References
- Comments mentioning "Medusa" in code
- README files with "Medusa" references
- API documentation with "Medusa" terminology

## 🎯 Cleanup Strategy

### Phase 1: Automated Search & Replace
```bash
# Search for user-facing "medusa" references
grep -r -i "medusa" src/app --include="*.tsx" --include="*.ts" --exclude-dir=api
```

### Phase 2: Manual Review
1. Review each match for user-facing vs backend usage
2. Replace user-facing references with generic terms:
   - "Medusa" → "Commerce Engine" or "E-commerce Platform"
   - "medusaClient" → "commerceClient" or "apiClient"
   - "medusaConfig" → "commerceConfig"

### Phase 3: UI Text Replacement
Replace in user-visible text:
- "Powered by Medusa" → "Powered by Binna Commerce"
- "Medusa Admin" → "Store Admin" or "Commerce Admin"
- "Medusa API" → "Commerce API"

### Phase 4: Validation
- Test all affected components
- Ensure no broken imports
- Verify UI displays correctly
- Check that functionality remains intact

## 🚨 Files That Need Immediate Attention

Based on the grep search results, focus on these file types:
1. React components in `src/app/(public)/`
2. React components in `src/app/user/`  
3. React components in `src/app/store/` (UI parts only)
4. React components in `src/app/admin/` (UI parts only)

## 📋 Replacement Terminology

| Old Term | New Term |
|----------|----------|
| Medusa | Commerce Platform |
| Medusa Admin | Store Admin |
| Medusa API | Commerce API |
| Medusa Client | Commerce Client |
| Medusa Config | Commerce Config |
| Medusa Service | Commerce Service |

## ✅ Next Steps

1. Run comprehensive search for "medusa" in user-facing code
2. Create replacement plan for each instance
3. Implement changes systematically
4. Test thoroughly after each batch of changes
5. Update documentation to reflect new terminology

---

*This audit will ensure the platform presents a unified Binna brand rather than exposing the underlying Medusa technology stack to end users.*
