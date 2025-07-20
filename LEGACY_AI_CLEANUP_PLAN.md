# Legacy AI Components Cleanup Plan

## Components to Review for Deprecation

### 1. AIConstructionCalculator.tsx
**Location**: `src/core/shared/components/AIConstructionCalculator.tsx`
**Status**: Legacy - Replaced by comprehensive calculator
**Action**: Consider deprecating - functionality moved to `/user/comprehensive-construction-calculator/`

### 2. AISearchSuggestions.tsx  
**Location**: `src/core/shared/components/AISearchSuggestions.tsx`
**Status**: Independent component - Keep if used elsewhere
**Action**: Review usage across platform

### 3. AIExpenseTracker.tsx
**Location**: `src/core/shared/components/AIExpenseTracker.tsx`  
**Status**: Independent component - Keep if used elsewhere
**Action**: Review usage across platform

## Recommendations

### Immediate Action Required:
1. **Audit Component Usage**: Search for imports of legacy components
2. **Update References**: Replace any remaining usage of `AIConstructionCalculator` with comprehensive version
3. **Test Legacy Pages**: Ensure orphaned AI pages work through new hub

### Code Cleanup Commands:
```bash
# Search for usage of legacy AI components
grep -r "AIConstructionCalculator" src/
grep -r "AISearchSuggestions" src/  
grep -r "AIExpenseTracker" src/

# Check if any pages import these components
find src/ -name "*.tsx" -exec grep -l "AIConstructionCalculator" {} \;
```

### Migration Strategy:
1. **Phase 1**: Ensure all AI features accessible through hub ✅ Complete
2. **Phase 2**: Monitor usage of legacy components
3. **Phase 3**: Deprecate unused legacy components
4. **Phase 4**: Clean up orphaned files after verification

## Notes:
- Keep legacy components temporarily for backward compatibility
- The AI Hub now provides centralized access to all AI features
- Individual AI pages remain functional but accessed through hub
- This creates a clean separation between legacy and modern AI implementations
