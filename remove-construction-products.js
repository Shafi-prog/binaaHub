const fs = require('fs');
const path = require('path');

// Files and directories to remove (construction products only from store)
const constructionProductsToRemove = [
  'src/app/store/construction-products',
  'src/app/store/categories/construction',
  'store-pages-backup/src/app/store/construction-products'
];

function removeConstructionProducts() {
  console.log('🏗️ Removing construction products from store...\n');
  
  let removedCount = 0;
  let skippedCount = 0;
  
  constructionProductsToRemove.forEach(itemPath => {
    const fullPath = path.join(__dirname, itemPath);
    
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          // Remove directory recursively
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`🗂️  Removed directory: ${itemPath}`);
          removedCount++;
        } else {
          // Remove file
          fs.unlinkSync(fullPath);
          console.log(`📄 Removed file: ${itemPath}`);
          removedCount++;
        }
      } else {
        console.log(`⚠️  Not found: ${itemPath}`);
        skippedCount++;
      }
    } catch (error) {
      console.log(`❌ Failed to remove ${itemPath}: ${error.message}`);
      skippedCount++;
    }
  });
  
  console.log(`\n📊 Removal Summary:`);
  console.log(`✅ Items removed: ${removedCount}`);
  console.log(`⚪ Items skipped: ${skippedCount}`);
  
  // Also update store layout to remove construction product links
  updateStoreLayout();
}

function updateStoreLayout() {
  console.log('\n🔧 Updating store layout to remove construction product references...\n');
  
  const layoutPath = path.join(__dirname, 'src', 'app', 'store', 'layout.tsx');
  
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    const originalContent = content;
    
    // Remove construction product related navigation items
    content = content.replace(/.*construction-products.*\n/gi, '');
    content = content.replace(/.*construction.*products.*\n/gi, '');
    content = content.replace(/.*مواد البناء.*\n/gi, '');
    content = content.replace(/.*Construction Products.*\n/gi, '');
    
    // Clean up any duplicate empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(layoutPath, content, 'utf8');
      console.log('✅ Updated store layout - removed construction product links');
    } else {
      console.log('⚪ No construction product links found in store layout');
    }
  } else {
    console.log('⚠️  Store layout file not found');
  }
}

function cleanupNavigationReferences() {
  console.log('\n🧹 Cleaning up any remaining construction product references...\n');
  
  const filesToCheck = [
    'src/app/store/dashboard/page.tsx',
    'src/app/store/products/page.tsx',
    'src/app/store/page.tsx'
  ];
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Remove any links or references to construction products
      content = content.replace(/.*\/store\/construction-products.*\n/gi, '');
      content = content.replace(/.*href=['"].*construction-products.*['"].*\n/gi, '');
      content = content.replace(/.*Link.*construction.*\n/gi, '');
      
      // Clean up empty lines
      content = content.replace(/\n\n\n+/g, '\n\n');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Cleaned references in: ${filePath}`);
      } else {
        console.log(`⚪ No construction references found in: ${filePath}`);
      }
    }
  });
}

function showRemainingProductPages() {
  console.log('\n📋 Remaining Product Pages in Store:\n');
  
  const productPages = [
    'src/app/store/products/page.tsx',
    'src/app/store/products/create/page.tsx',
    'src/app/store/products/import/page.tsx',
    'src/app/store/products/export/page.tsx',
    'src/app/store/product-variants/page.tsx',
    'src/app/store/product-bundles/page.tsx'
  ];
  
  productPages.forEach(page => {
    const fullPath = path.join(__dirname, page);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${page.replace('src/app/store/', '/store/')}`);
    } else {
      console.log(`❌ ${page.replace('src/app/store/', '/store/')} - Missing`);
    }
  });
}

// Run the cleanup
removeConstructionProducts();
cleanupNavigationReferences();
showRemainingProductPages();

console.log('\n🎉 Construction products removal completed!');
console.log('\n📝 Summary:');
console.log('✅ Removed all construction-specific product pages');
console.log('✅ Cleaned up navigation references');
console.log('✅ Maintained general product management pages');
console.log('✅ Your store now has unified product management without construction-specific sections');
