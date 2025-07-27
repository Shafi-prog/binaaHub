const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'src', 'app', 'store');

// List of files that still have mock data that need to be cleaned
const filesToClean = [
  'campaigns/page-new.tsx',
  'categories/construction/page.tsx',
  'collections/page-new.tsx',
  'construction-products/page-new.tsx',
  'pos/page.tsx',
  'product-variants/page-new.tsx',
  'product-variants/page-old.tsx',
  'product-variants/page.tsx',
  'products/export/page.tsx',
  'products/import/page.tsx',
  'promotions/page.tsx',
  'storefront/page-new.tsx',
  'storefront/page.tsx',
  'suppliers/page-new.tsx',
  'suppliers/page-old-backup.tsx',
  'suppliers/page-old.tsx',
  'suppliers/page_old_backup.tsx',
  'users/user-list/user-list-new.tsx',
  'users/user-list/user-list.tsx',
  'warehouses/page.tsx',
  'workflow-executions/workflow-execution-list/workflow-execution-list-new.tsx',
  'workflow-executions/workflow-execution-list/workflow-execution-list.tsx'
];

function cleanRemainingMockData() {
  console.log('🧹 Cleaning remaining mock data from final files...\n');

  let processedFiles = 0;
  let cleanedFiles = 0;

  filesToClean.forEach(file => {
    const filePath = path.join(storePath, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    console.log(`📝 Processing ${file}...`);
    processedFiles++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove mock data declarations
    const mockPatterns = [
      /const\s+mock\w+\s*=\s*\[[^\]]*\];?/gs,
      /const\s+sample\w+\s*=\s*\[[^\]]*\];?/gs,
      /const\s+dummy\w+\s*=\s*\[[^\]]*\];?/gs,
      /const\s+fake\w+\s*=\s*\[[^\]]*\];?/gs,
      /const\s+test\w+\s*=\s*\[[^\]]*\];?/gs,
      /mock\w+\s*=\s*\[[^\]]*\]/g,
      /sample\w+\s*=\s*\[[^\]]*\]/g
    ];

    mockPatterns.forEach(pattern => {
      const newContent = content.replace(pattern, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // Replace mock data usage with empty arrays
    const usagePatterns = [
      /mock\w+/g,
      /sample\w+/g,
      /dummy\w+/g,
      /fake\w+/g
    ];

    usagePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Only replace if it's not part of a string literal
          const regex = new RegExp(`\\b${match}\\b(?!['"])`, 'g');
          const newContent = content.replace(regex, '[]');
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        });
      }
    });

    // Replace specific test email addresses
    content = content.replace(/'test@\w+\.\w+'/g, "''");
    content = content.replace(/'.*@example\.com'/g, "''");

    // Clean up any empty useState declarations
    content = content.replace(/const\s+\[\w+\]\s*=\s*useState\(\[\]\)/g, 'const [data] = useState([])');

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Cleaned mock data from ${file}`);
      cleanedFiles++;
    } else {
      console.log(`  ⚪ No mock data found in ${file}`);
    }
  });

  console.log(`\n📊 Final Cleanup Summary:`);
  console.log(`   📁 Files Processed: ${processedFiles}`);
  console.log(`   ✅ Files Cleaned: ${cleanedFiles}`);
  console.log(`   ⚪ Files Already Clean: ${processedFiles - cleanedFiles}`);
  console.log(`\n🎉 Final mock data cleanup completed!`);
}

cleanRemainingMockData();
