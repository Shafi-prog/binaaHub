const fs = require('fs');
const path = require('path');

// Define the mapping of old variants to new variants
const variantMapping = {
  '"h1"': '"heading"',
  '"h2"': '"subheading"',
  '"h3"': '"subheading"',
  '"h4"': '"subheading"',
  '"h5"': '"subheading"',
  '"h6"': '"subheading"',
  '"body1"': '"body"',
  '"body2"': '"caption"'
};

// Files to process
const userPages = [
  'src/app/user/balance/page.tsx',
  'src/app/user/cart/page.tsx',
  'src/app/user/expenses/page.tsx',
  'src/app/user/gamification/page.tsx',
  'src/app/user/invoices/page.tsx',
  'src/app/user/orders/page.tsx',
  'src/app/user/settings/page.tsx',
  'src/app/user/smart-insights/page.tsx',
  'src/app/user/social-community/page.tsx',
  'src/app/user/subscriptions/page.tsx',
  'src/app/user/warranties/page.tsx'
];

function fixTypographyVariants() {
  let totalFiles = 0;
  let totalReplacements = 0;

  userPages.forEach(filePath => {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let fileReplacements = 0;
    let modified = false;

    // Apply all variant mappings
    Object.entries(variantMapping).forEach(([oldVariant, newVariant]) => {
      const regex = new RegExp(`(variant=)${oldVariant.replace(/"/g, '\\"')}`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, `$1${newVariant}`);
        fileReplacements += matches.length;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed ${fileReplacements} Typography variants in ${filePath}`);
      totalFiles++;
      totalReplacements += fileReplacements;
    } else {
      console.log(`✔️  No Typography variant issues in ${filePath}`);
    }
  });

  console.log(`\n🎉 Summary:`);
  console.log(`   Files processed: ${totalFiles}`);
  console.log(`   Total replacements: ${totalReplacements}`);
  console.log(`\n✅ All Typography variant errors should now be fixed!`);
}

fixTypographyVariants();
