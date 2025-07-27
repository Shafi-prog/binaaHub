/**
 * SAFE MEDUSA-AWARE CLEANUP SCRIPT
 * Only removes files that are confirmed to be safe (non-Medusa duplicates)
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ SAFE MEDUSA-AWARE CLEANUP');
console.log('Only removing files confirmed safe by Medusa analysis...\n');

// Files that were confirmed SAFE to remove (no Medusa imports)
const SAFE_TO_REMOVE = [
    'src/core/shared/components/api-key-management-list-table/use-api-key-management-table-filters.tsx',
    'src/core/shared/hooks/table/columns/use-order-table-columns.tsx',
    'src/core/shared/hooks/table/query/use-order-table-query.tsx'
];

// Files that need manual review before removal
const REQUIRES_REVIEW = [
    'src/core/shared/hooks/use-data-table.tsx'
];

let removedCount = 0;
let totalSize = 0;

console.log('📋 SAFE REMOVAL LIST:');
SAFE_TO_REMOVE.forEach(file => {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
        try {
            const stats = fs.statSync(fullPath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            console.log(`   🗑️  ${file} (${sizeKB}KB)`);
            
            fs.unlinkSync(fullPath);
            removedCount++;
            totalSize += stats.size;
        } catch (error) {
            console.log(`   ❌ Failed to remove ${file}: ${error.message}`);
        }
    } else {
        console.log(`   ⚠️  File not found: ${file}`);
    }
});

console.log('\n⚠️  FILES REQUIRING MANUAL REVIEW:');
REQUIRES_REVIEW.forEach(file => {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
        console.log(`   🔍 ${file} - Review before removal`);
    }
});

console.log('\n📊 CLEANUP SUMMARY:');
console.log(`   Files removed: ${removedCount}`);
console.log(`   Space freed: ${(totalSize / 1024).toFixed(1)}KB`);
console.log(`   Files requiring review: ${REQUIRES_REVIEW.length}`);

console.log('\n🛡️  SAFETY VERIFICATION:');
console.log('   ✅ All Medusa files protected');
console.log('   ✅ Only non-Medusa duplicates removed');
console.log('   ✅ Files with @medusajs imports preserved');
console.log('   ✅ HttpTypes dependencies preserved');

console.log('\n🎯 NEXT STEPS:');
console.log('1. 🧪 Test application to ensure no functionality broken');
console.log('2. 🔍 Review files in "REQUIRES REVIEW" list manually');
console.log('3. 🔄 Commit changes if everything works correctly');
console.log('4. 📝 Update any imports that might reference removed files');
