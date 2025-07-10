#!/bin/bash

echo "🚀 Starting Phase 1: Import Path Standardization"
echo "Target: Reduce 8,514 TypeScript errors by ~3,000"

# Fix client imports
echo "📦 Fixing client imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../lib/client"|from "@/lib/client"|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../lib/client"|from "@/lib/client"|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../lib/client"|from "@/lib/client"|g'

# Fix query-client imports  
echo "🔍 Fixing query-client imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../lib/query-client"|from "@/lib/query-client"|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../lib/query-client"|from "@/lib/query-client"|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../lib/query-client"|from "@/lib/query-client"|g'

# Fix query-key-factory imports
echo "🔑 Fixing query-key-factory imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../lib/query-key-factory"|from "@/lib/query-key-factory"|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../lib/query-key-factory"|from "@/lib/query-key-factory"|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../lib/query-key-factory"|from "@/lib/query-key-factory"|g'

# Fix component imports
echo "🧩 Fixing component imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../components/|from "@/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../components/|from "@/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../components/|from "@/components/|g'

# Fix store module imports
echo "🏪 Fixing store module imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../store/modules/|from "@/store/modules/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../store/modules/|from "@/store/modules/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../store/modules/|from "@/store/modules/|g'

# Fix utils imports
echo "🛠️ Fixing utils imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../utils/|from "@/utils/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../utils/|from "@/utils/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../utils/|from "@/utils/|g'

# Fix hooks imports
echo "🎣 Fixing hooks imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../hooks/|from "@/hooks/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../hooks/|from "@/hooks/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../hooks/|from "@/hooks/|g'

# Fix types imports
echo "📝 Fixing types imports..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../types/|from "@/types/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../types/|from "@/types/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|from "../../../../types/|from "@/types/|g'

echo "✅ Phase 1 Complete: Import paths standardized"
echo "🔍 Run 'npx tsc --noEmit' to check error reduction"
echo "📊 Expected error reduction: ~3,000 errors"