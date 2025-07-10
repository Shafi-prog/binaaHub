#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const products = [
  { name: 'BinnaPOS', port: 3001, path: 'src/products/binna-pos' },
  { name: 'BinnaStock', port: 3002, path: 'src/products/binna-stock' },
  { name: 'BinnaBooks', port: 3003, path: 'src/products/binna-books' },
  { name: 'BinnaPay', port: 3004, path: 'src/products/binna-pay' },
  { name: 'BinnaCRM', port: 3005, path: 'src/products/binna-crm' },
  { name: 'BinnaAnalytics', port: 3006, path: 'src/products/binna-analytics' }
];

console.log('🚀 BINNA PLATFORM - STANDALONE PRODUCTS LAUNCHER');
console.log('='.repeat(50));

console.log('\n📦 Available Standalone Products:');
products.forEach(product => {
  console.log(`🎯 ${product.name.padEnd(15)} - Port ${product.port} - ${product.path}`);
});

console.log('\n🔧 Development Commands:');
console.log('Main Platform:      npm run dev');
products.forEach(product => {
  console.log(`${product.name.padEnd(15)}: cd ${product.path} && npm run dev`);
});

console.log('\n🌐 URLs (when running):');
console.log('Main Platform:      http://localhost:3000');
products.forEach(product => {
  console.log(`${product.name.padEnd(15)}: http://localhost:${product.port}`);
});

console.log('\n💡 Each product can run independently and compete with:');
console.log('🏪 BinnaPOS        - OnyxPro (Point of Sale)');
console.log('📦 BinnaStock      - Rewaa (Inventory Management)');
console.log('📊 BinnaBooks      - Wafeq (Accounting System)');
console.log('💳 BinnaPay        - Mezan (Payment Processing)');
console.log('🤝 BinnaCRM        - Salesforce (Customer Management)');
console.log('📈 BinnaAnalytics  - Tableau (Business Intelligence)');

const selectedProduct = process.argv[2];
if (selectedProduct) {
  const product = products.find(p => p.name.toLowerCase() === selectedProduct.toLowerCase());
  if (product) {
    console.log(`\n🚀 Starting ${product.name}...`);
    const command = `cd ${product.path} && npm install && npm run dev`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting ${product.name}:`, error);
        return;
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
    });
  } else {
    console.log(`\n❌ Product '${selectedProduct}' not found.`);
    console.log('Available products:', products.map(p => p.name).join(', '));
  }
} else {
  console.log('\n📖 Usage: node scripts/launch.js [product-name]');
  console.log('Example: node scripts/launch.js binnapos');
}
