const fs = require('fs');
const path = require('path');

function auditServiceProviderPages() {
  console.log('🔧 SERVICE PROVIDER PAGES AUDIT\n');
  
  const serviceProviderDirectory = './src/app/service-provider';
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
              route: '/service-provider' + routePath,
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
  
  if (fs.existsSync(serviceProviderDirectory)) {
    scanDirectory(serviceProviderDirectory);
    
    // Sort pages by route
    pages.sort((a, b) => a.route.localeCompare(b.route));
    
    console.log(`📊 Found ${pages.length} service provider pages:\n`);
    
    pages.forEach((page, index) => {
      console.log(`${String(index + 1).padStart(3, ' ')}. ${page.route}`);
    });
    
    // Check common service provider pages
    console.log('\n🔍 CHECKING FOR COMMON SERVICE PROVIDER PAGES:\n');
    
    const commonPages = [
      '/service-provider/dashboard',
      '/service-provider/bookings',
      '/service-provider/services',
      '/service-provider/calendar',
      '/service-provider/customers',
      '/service-provider/payments',
      '/service-provider/reports',
      '/service-provider/settings',
      '/service-provider/profile'
    ];
    
    commonPages.forEach(route => {
      const filePath = `./src/app${route}/page.tsx`;
      const exists = fs.existsSync(filePath);
      const status = exists ? '✅' : '❌';
      console.log(`${status} ${route}`);
    });
    
    console.log(`\n📋 SUMMARY: Found ${pages.length} service provider pages`);
  } else {
    console.log('❌ Service provider directory not found');
  }
}

function main() {
  console.log('='*60);
  console.log('🔧 BINNA SERVICE PROVIDER PAGES AUDIT');
  console.log('='*60);
  
  auditServiceProviderPages();
  
  console.log('\n✅ SERVICE PROVIDER AUDIT COMPLETE!');
}

main();
