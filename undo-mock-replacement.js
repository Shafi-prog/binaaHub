#!/usr/bin/env node

/**
 * Script to undo changes made by replace-mock-data-comprehensive.js
 * This will restore the specific files that were modified by that script
 */

const { execSync } = require('child_process');
const fs = require('fs');

const modifiedFiles = [
  'src/app/(public)/marketplace/page.tsx',
  'src/app/(public)/marketplace/projects/page.tsx',
  'src/app/store/backup/page.tsx',
  'src/app/store/finance/expenses/new/page.tsx',
  'src/app/store/finance/management/reports/page.tsx',
  'src/app/store/finance/payments/process/page.tsx',
  'src/app/store/locations/page.tsx',
  'src/app/store/marketplace-vendors/[id]/page.tsx',
  'src/app/store/pricing/page.tsx',
  'src/app/store/product-bundles/[id]/edit/page.tsx',
  'src/app/store/product-bundles/[id]/page.tsx',
  'src/app/store/promotions/page.tsx',
  'src/app/store/staff/page.tsx',
  'src/app/store/tax/page.tsx',
  'src/app/store/taxes/page.tsx',
  'src/app/store/warehouses/[id]/page.tsx',
  'src/app/user/construction-services/page.tsx',
  'src/app/user/dashboard/page.tsx',
  'src/app/user/dashboard/page_new.tsx',
  'src/app/user/projects/[id]/documentation/page.tsx',
  'src/components/service-provider/ServiceProviderDashboard.tsx',
  'src/core/services/projectTrackingService.ts',
  'src/core/shared/services/mock-supabase.ts',
  'src/domains/marketplace/services/brand-registry.tsx',
  'src/products/analytics/analytics/analytics-bi.tsx'
];

console.log('🔄 UNDOING MOCK DATA REPLACEMENT SCRIPT CHANGES...');
console.log('═══════════════════════════════════════════════════════');

let restoredCount = 0;
let errorCount = 0;

modifiedFiles.forEach((file, index) => {
  try {
    console.log(`${index + 1}/${modifiedFiles.length}: Checking ${file}`);
    
    // Check if file exists and is modified
    try {
      const status = execSync(`git status --porcelain "${file}"`, { encoding: 'utf8' }).trim();
      
      if (status.startsWith('M ') || status.includes('M')) {
        console.log(`  ↻ Restoring ${file}`);
        execSync(`git checkout HEAD -- "${file}"`);
        restoredCount++;
        console.log(`  ✅ Restored ${file}`);
      } else {
        console.log(`  ⚪ ${file} - not modified`);
      }
    } catch (gitError) {
      console.log(`  ⚪ ${file} - not in git or not modified`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error with ${file}: ${error.message}`);
    errorCount++;
  }
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 UNDO SCRIPT SUMMARY');
console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Files Restored: ${restoredCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`📁 Total Files Processed: ${modifiedFiles.length}`);

if (restoredCount > 0) {
  console.log('\n🎉 Successfully undid the mock data replacement script changes!');
  console.log('📝 Your files have been restored to their state before running replace-mock-data-comprehensive.js');
  console.log('\n💡 Next steps:');
  console.log('   1. Check git status to confirm the changes');
  console.log('   2. Run your build to ensure everything works');
  console.log('   3. Consider running individual, safer mock data replacement scripts');
} else {
  console.log('\n⚠️  No files were restored. They may already be in the correct state.');
}

console.log('\n🔍 Run "git status" to see the current state of your files.');
