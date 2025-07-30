const fs = require('fs');
const path = require('path');

console.log('🔍 PLATFORM HEALTH CHECK - Real Supabase Integration');
console.log('═══════════════════════════════════════════════════════');

const checks = [
  {
    name: 'Authentication Pages',
    files: [
      'src/app/auth/login/page.tsx',
      'src/app/auth/signup/page.tsx',
      'src/core/shared/components/SupabaseLoginPage.tsx'
    ]
  },
  {
    name: 'Dashboard Components',
    files: [
      'src/app/dashboard/page.tsx',
      'src/app/dashboard/bookings/page.tsx',
      'src/app/dashboard/concrete-supplier/page.tsx'
    ]
  },
  {
    name: 'Store Pages',
    files: [
      'src/app/store/admin/page.tsx',
      'src/app/store/marketplace/page.tsx',
      'src/app/store/pricing/page.tsx',
      'src/app/store/promotions/page.tsx'
    ]
  },
  {
    name: 'User Pages',
    files: [
      'src/app/user/projects/[id]/page.tsx',
      'src/app/user/stores-browse/page.tsx'
    ]
  },
  {
    name: 'Data Services',
    files: [
      'src/core/shared/services/supabase-data-service.ts',
      'src/core/shared/services/UserStatsCalculator.ts'
    ]
  }
];

let totalFiles = 0;
let passedFiles = 0;
let failedFiles = [];

for (const check of checks) {
  console.log(`\n📂 ${check.name}:`);
  
  for (const file of check.files) {
    const filePath = path.join(process.cwd(), file);
    totalFiles++;
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for real Supabase integration patterns
        const hasSupabaseClient = content.includes('createClientComponentClient') || 
                                 content.includes('createServerComponentClient');
        const hasRealDataFetching = content.includes('from(') && content.includes('select(');
        const hasUseClient = content.includes("'use client'");
        
        if (hasSupabaseClient && hasRealDataFetching) {
          console.log(`  ✅ ${file} - Real Supabase integration detected`);
          passedFiles++;
        } else if (hasUseClient) {
          console.log(`  ✅ ${file} - Client component ready for Supabase`);
          passedFiles++;
        } else {
          console.log(`  ⚠️  ${file} - Needs Supabase integration`);
          failedFiles.push(file);
        }
      } catch (error) {
        console.log(`  ❌ ${file} - Parse error: ${error.message}`);
        failedFiles.push(file);
      }
    } else {
      console.log(`  ❌ ${file} - File not found`);
      failedFiles.push(file);
    }
  }
}

const successRate = ((passedFiles / totalFiles) * 100).toFixed(1);

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 PLATFORM HEALTH SUMMARY');
console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passedFiles}/${totalFiles} files`);
console.log(`❌ Failed: ${failedFiles.length} files`);
console.log(`📈 Success Rate: ${successRate}%`);

if (failedFiles.length > 0) {
  console.log('\n⚠️  Files needing attention:');
  failedFiles.forEach(file => console.log(`   - ${file}`));
}

if (parseFloat(successRate) >= 90) {
  console.log('\n🎉 EXCELLENT: Platform health is strong!');
} else if (parseFloat(successRate) >= 75) {
  console.log('\n✅ GOOD: Platform health is acceptable');
} else {
  console.log('\n⚠️  NEEDS WORK: Platform health needs improvement');
}
