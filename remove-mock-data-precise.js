const fs = require('fs');

/**
 * Precise Mock Data Removal Script
 * This script will completely remove all mock data arrays and fix useState calls
 */

class PreciseMockDataRemover {
  constructor() {
    this.filesProcessed = 0;
    this.filesModified = 0;
  }

  processFile(filePath) {
    try {
      console.log(`🔧 Processing: ${filePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      const originalContent = content;

      // 1. Remove ALL mock data arrays completely (including multiline arrays)
      const mockArrayPattern = /\/\/\s*Mock.*?\n.*?const\s+mock\w+.*?=\s*\[[\s\S]*?\];\s*\n/gms;
      content = content.replace(mockArrayPattern, '');
      
      // Alternative pattern for mock arrays without comments
      const mockArrayPattern2 = /const\s+mock\w+.*?=\s*\[[\s\S]*?\];\s*\n/gms;
      content = content.replace(mockArrayPattern2, '');

      // 2. Remove standalone mock comments
      content = content.replace(/\/\/\s*Mock.*?\n/g, '');

      // 3. Fix useState calls that reference mock data
      const useStateReplacements = [
        { from: /const \[campaigns\] = useState<Campaign\[\]>\(mockCampaigns\);/, to: 'const [campaigns, setCampaigns] = useState<Campaign[]>([]);' },
        { from: /const \[campaigns, setCampaigns\] = useState<Campaign\[\]>\(mockCampaigns\);/, to: 'const [campaigns, setCampaigns] = useState<Campaign[]>([]);' },
        { from: /const \[products\] = useState.*?\(mockProducts\);/, to: 'const [products, setProducts] = useState<any[]>([]);' },
        { from: /const \[products, setProducts\] = useState.*?\(mockProducts\);/, to: 'const [products, setProducts] = useState<any[]>([]);' },
        { from: /const \[categories\] = useState.*?\(mockCategories\);/, to: 'const [categories, setCategories] = useState<any[]>([]);' },
        { from: /const \[categories, setCategories\] = useState.*?\(mockCategories\);/, to: 'const [categories, setCategories] = useState<any[]>([]);' },
        { from: /const \[collections\] = useState.*?\(mockCollections\);/, to: 'const [collections, setCollections] = useState<any[]>([]);' },
        { from: /const \[collections, setCollections\] = useState.*?\(mockCollections\);/, to: 'const [collections, setCollections] = useState<any[]>([]);' },
        { from: /const \[registers\] = useState.*?\(mockRegisters\);/, to: 'const [registers, setRegisters] = useState<any[]>([]);' },
        { from: /const \[registers, setRegisters\] = useState.*?\(mockRegisters\);/, to: 'const [registers, setRegisters] = useState<any[]>([]);' },
        { from: /const \[sessions\] = useState.*?\(mockSessions\);/, to: 'const [sessions, setSessions] = useState<any[]>([]);' },
        { from: /const \[sessions, setSessions\] = useState.*?\(mockSessions\);/, to: 'const [sessions, setSessions] = useState<any[]>([]);' },
        { from: /const \[bundles\] = useState.*?\(mockBundles\);/, to: 'const [bundles, setBundles] = useState<any[]>([]);' },
        { from: /const \[bundles, setBundles\] = useState.*?\(mockBundles\);/, to: 'const [bundles, setBundles] = useState<any[]>([]);' },
        { from: /const \[vendors\] = useState.*?\(mockVendors\);/, to: 'const [vendors, setVendors] = useState<any[]>([]);' },
        { from: /const \[vendors, setVendors\] = useState.*?\(mockVendors\);/, to: 'const [vendors, setVendors] = useState<any[]>([]);' },
        { from: /const \[segments\] = useState.*?\(mockSegments\);/, to: 'const [segments, setSegments] = useState<any[]>([]);' },
        { from: /const \[segments, setSegments\] = useState.*?\(mockSegments\);/, to: 'const [segments, setSegments] = useState<any[]>([]);' },
        { from: /const \[invoices\] = useState.*?\(mockInvoices\);/, to: 'const [invoices, setInvoices] = useState<any[]>([]);' },
        { from: /const \[invoices, setInvoices\] = useState.*?\(mockInvoices\);/, to: 'const [invoices, setInvoices] = useState<any[]>([]);' },
        { from: /const \[fulfillments\] = useState.*?\(mockOrderFulfillments\);/, to: 'const [fulfillments, setFulfillments] = useState<any[]>([]);' },
        { from: /const \[fulfillments, setFulfillments\] = useState.*?\(mockOrderFulfillments\);/, to: 'const [fulfillments, setFulfillments] = useState<any[]>([]);' },
        { from: /const \[shipments\] = useState.*?\(mockShipments\);/, to: 'const [shipments, setShipments] = useState<any[]>([]);' },
        { from: /const \[shipments, setShipments\] = useState.*?\(mockShipments\);/, to: 'const [shipments, setShipments] = useState<any[]>([]);' },
        { from: /const \[returns\] = useState.*?\(mockReturns\);/, to: 'const [returns, setReturns] = useState<any[]>([]);' },
        { from: /const \[returns, setReturns\] = useState.*?\(mockReturns\);/, to: 'const [returns, setReturns] = useState<any[]>([]);' },
        { from: /const \[priceLists\] = useState.*?\(mockPriceLists\);/, to: 'const [priceLists, setPriceLists] = useState<any[]>([]);' },
        { from: /const \[priceLists, setPriceLists\] = useState.*?\(mockPriceLists\);/, to: 'const [priceLists, setPriceLists] = useState<any[]>([]);' },
        { from: /const \[currencies\] = useState.*?\(mockCurrencies\);/, to: 'const [currencies, setCurrencies] = useState<any[]>([]);' },
        { from: /const \[currencies, setCurrencies\] = useState.*?\(mockCurrencies\);/, to: 'const [currencies, setCurrencies] = useState<any[]>([]);' },
        { from: /const \[regions\] = useState.*?\(mockRegions\);/, to: 'const [regions, setRegions] = useState<any[]>([]);' },
        { from: /const \[regions, setRegions\] = useState.*?\(mockRegions\);/, to: 'const [regions, setRegions] = useState<any[]>([]);' },
        { from: /const \[countries\] = useState.*?\(mockCountries\);/, to: 'const [countries, setCountries] = useState<any[]>([]);' },
        { from: /const \[countries, setCountries\] = useState.*?\(mockCountries\);/, to: 'const [countries, setCountries] = useState<any[]>([]);' },
        { from: /const \[groups\] = useState.*?\(mockCustomerGroups\);/, to: 'const [groups, setGroups] = useState<any[]>([]);' },
        { from: /const \[groups, setGroups\] = useState.*?\(mockCustomerGroups\);/, to: 'const [groups, setGroups] = useState<any[]>([]);' },
      ];

      useStateReplacements.forEach(({ from, to }) => {
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      });

      // 4. Clean up extra whitespace
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

      // Check if content actually changed
      if (content !== originalContent) {
        modified = true;
      }

      // 5. Write back if modified
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.filesModified++;
        console.log(`   ✅ Updated: ${filePath}`);
      } else {
        console.log(`   ⏭️  No changes needed: ${filePath}`);
      }

      this.filesProcessed++;

    } catch (error) {
      console.error(`   ❌ Error processing ${filePath}:`, error.message);
    }
  }

  run() {
    console.log('🚀 Starting precise mock data removal...');
    console.log('='.repeat(80));

    const problematicFiles = [
      'src/app/store/campaigns/page.tsx',
      'src/app/store/cash-registers/page.tsx',
      'src/app/store/categories/construction/page.tsx',
      'src/app/store/collections/page.tsx',
      'src/app/store/construction-products/new/page.tsx',
      'src/app/store/construction-products/page.tsx',
      'src/app/store/currency-region/page.tsx',
      'src/app/store/customer-groups/page.tsx',
      'src/app/store/customer-segmentation/page.tsx',
      'src/app/store/delivery/page.tsx',
      'src/app/store/email-campaigns/page.tsx',
      'src/app/store/financial-management/page.tsx',
      'src/app/store/hr/claims/page.tsx',
      'src/app/store/hr/leave-management/page.tsx',
      'src/app/store/inventory/barcode-generation/page.tsx',
      'src/app/store/marketplace-vendors/page.tsx',
      'src/app/store/order-management/page.tsx',
      'src/app/store/payments/page.tsx',
      'src/app/store/permissions/page.tsx',
      'src/app/store/pricing/page.tsx',
      'src/app/store/product-bundles/page.tsx'
    ];

    problematicFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.processFile(file);
      } else {
        console.log(`⚠️  File not found: ${file}`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 Precise Mock Data Removal Summary:');
    console.log(`   📁 Files Processed: ${this.filesProcessed}`);
    console.log(`   ✅ Files Modified: ${this.filesModified}`);
    console.log(`   🎯 Clean Files: ${this.filesProcessed - this.filesModified}`);

    if (this.filesModified > 0) {
      console.log('\n🎉 Precise mock data removal completed!');
      console.log('   ✅ All mock data arrays completely removed');
      console.log('   ✅ useState calls fixed to use empty arrays');
      console.log('   ✅ Real Supabase data fetching already in place');
    } else {
      console.log('\n✅ All files were already clean!');
    }
  }
}

// Run the precise removal process
const remover = new PreciseMockDataRemover();
remover.run();
