const fs = require('fs');
const path = require('path');

function auditUserPages() {
  console.log('👤 USER PAGES AUDIT\n');
  
  const userDirectory = './src/app/user';
  const pages = [];
  
  function scanDirectory(dir, route = '') {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Check if this directory has a page.tsx
          const pagePath = path.join(fullPath, 'page.tsx');
          if (fs.existsSync(pagePath)) {
            const routePath = route + '/' + item;
            pages.push({
              route: '/user' + routePath,
              file: pagePath,
              exists: true
            });
          }
          
          // Recursively scan subdirectories
          scanDirectory(fullPath, route + '/' + item);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
  }
  
  if (fs.existsSync(userDirectory)) {
    scanDirectory(userDirectory);
    
    // Sort pages by route
    pages.sort((a, b) => a.route.localeCompare(b.route));
    
    console.log(`📊 Found ${pages.length} user pages:\n`);
    
    pages.forEach((page, index) => {
      console.log(`${String(index + 1).padStart(3, ' ')}. ${page.route}`);
    });
    
    // Check common user pages
    console.log('\n🔍 CHECKING FOR COMMON USER PAGES:\n');
    
    const commonPages = [
      '/user/dashboard',
      '/user/projects',
      '/user/projects/list',
      '/user/projects/create',
      '/user/projects/calculator',
      '/user/profile',
      '/user/settings',
      '/user/orders',
      '/user/favorites',
      '/user/notifications'
    ];
    
    commonPages.forEach(route => {
      const filePath = `./src/app${route}/page.tsx`;
      const exists = fs.existsSync(filePath);
      const status = exists ? '✅' : '❌';
      console.log(`${status} ${route}`);
    });
    
    console.log(`\n📋 SUMMARY: Found ${pages.length} user pages`);
  } else {
    console.log('❌ User directory not found');
  }
}

function main() {
  console.log('='*60);
  console.log('👤 BINNA USER PAGES AUDIT');
  console.log('='*60);
  
  auditUserPages();
  
  console.log('\n✅ USER AUDIT COMPLETE!');
}

main();
