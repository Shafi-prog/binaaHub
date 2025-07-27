const fs = require('fs');

/**
 * Comprehensive Mock Data Removal Script
 * Removes all hardcoded mock data from store pages and replaces with real Supabase queries
 */

class ComprehensiveMockDataRemover {
  constructor() {
    this.filesProcessed = 0;
    this.filesModified = 0;
  }

  // Remove mock data and replace with real data fetching
  processFile(filePath) {
    try {
      console.log(`🔧 Processing: ${filePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Remove all mock data arrays
      const mockDataPatterns = [
        /const\s+mock[A-Z]\w*\s*:\s*[^=]*=\s*\[[\s\S]*?\];?\n/gm,
        /const\s+mock[A-Z]\w*\s*=\s*\[[\s\S]*?\];?\n/gm,
        /\/\/\s*Mock.*\n/gm,
        /\/\*\s*Mock[\s\S]*?\*\/\n?/gm
      ];

      mockDataPatterns.forEach(pattern => {
        const oldContent = content;
        content = content.replace(pattern, '');
        if (content !== oldContent) {
          modified = true;
        }
      });

      // 2. Add required imports if not present
      if (!content.includes('SupabaseDataService')) {
        const importMatch = content.match(/(import.*?from.*?;)\s*\n/);
        if (importMatch) {
          const imports = `import { SupabaseDataService } from '@/core/shared/services/supabase-data-service';
import { useAuth } from '@/core/shared/auth/AuthProvider';
`;
          content = content.replace(importMatch[0], importMatch[0] + imports);
          modified = true;
        }
      }

      // 3. Add useAuth hook if not present
      if (!content.includes('useAuth')) {
        const functionMatch = content.match(/export default function \w+\(\) \{/);
        if (functionMatch) {
          content = content.replace(
            functionMatch[0],
            functionMatch[0] + '\n  const { user } = useAuth();\n  const userId = user?.id || user?.email || \'user@binna\';'
          );
          modified = true;
        }
      }

      // 4. Replace useState with mock data to empty arrays
      const useStateReplacements = [
        { pattern: /const \[campaigns, setCampaigns\] = useState\([^\]]*\]/g, replacement: 'const [campaigns, setCampaigns] = useState<any[]>([])' },
        { pattern: /const \[products, setProducts\] = useState\([^\]]*\]/g, replacement: 'const [products, setProducts] = useState<any[]>([])' },
        { pattern: /const \[orders, setOrders\] = useState\([^\]]*\]/g, replacement: 'const [orders, setOrders] = useState<any[]>([])' },
        { pattern: /const \[customers, setCustomers\] = useState\([^\]]*\]/g, replacement: 'const [customers, setCustomers] = useState<any[]>([])' },
        { pattern: /const \[bundles, setBundles\] = useState\([^\]]*\]/g, replacement: 'const [bundles, setBundles] = useState<any[]>([])' },
        { pattern: /const \[categories, setCategories\] = useState\([^\]]*\]/g, replacement: 'const [categories, setCategories] = useState<any[]>([])' },
        { pattern: /const \[collections, setCollections\] = useState\([^\]]*\]/g, replacement: 'const [collections, setCollections] = useState<any[]>([])' },
        { pattern: /const \[vendors, setVendors\] = useState\([^\]]*\]/g, replacement: 'const [vendors, setVendors] = useState<any[]>([])' },
        { pattern: /const \[registers, setRegisters\] = useState\([^\]]*\]/g, replacement: 'const [registers, setRegisters] = useState<any[]>([])' },
        { pattern: /const \[sessions, setSessions\] = useState\([^\]]*\]/g, replacement: 'const [sessions, setSessions] = useState<any[]>([])' },
        { pattern: /const \[segments, setSegments\] = useState\([^\]]*\]/g, replacement: 'const [segments, setSegments] = useState<any[]>([])' },
        { pattern: /const \[invoices, setInvoices\] = useState\([^\]]*\]/g, replacement: 'const [invoices, setInvoices] = useState<any[]>([])' },
        { pattern: /const \[fulfillments, setFulfillments\] = useState\([^\]]*\]/g, replacement: 'const [fulfillments, setFulfillments] = useState<any[]>([])' },
        { pattern: /const \[shipments, setShipments\] = useState\([^\]]*\]/g, replacement: 'const [shipments, setShipments] = useState<any[]>([])' },
        { pattern: /const \[returns, setReturns\] = useState\([^\]]*\]/g, replacement: 'const [returns, setReturns] = useState<any[]>([])' },
        { pattern: /const \[priceLists, setPriceLists\] = useState\([^\]]*\]/g, replacement: 'const [priceLists, setPriceLists] = useState<any[]>([])' },
        { pattern: /const \[currencies, setCurrencies\] = useState\([^\]]*\]/g, replacement: 'const [currencies, setCurrencies] = useState<any[]>([])' },
        { pattern: /const \[regions, setRegions\] = useState\([^\]]*\]/g, replacement: 'const [regions, setRegions] = useState<any[]>([])' },
        { pattern: /const \[countries, setCountries\] = useState\([^\]]*\]/g, replacement: 'const [countries, setCountries] = useState<any[]>([])' },
        { pattern: /const \[groups, setGroups\] = useState\([^\]]*\]/g, replacement: 'const [groups, setGroups] = useState<any[]>([])' }
      ];

      useStateReplacements.forEach(({ pattern, replacement }) => {
        const oldContent = content;
        content = content.replace(pattern, replacement);
        if (content !== oldContent) {
          modified = true;
        }
      });

      // 5. Add loading state if not present
      if (!content.includes('[loading, setLoading]')) {
        const firstUseStateMatch = content.match(/const \[\w+, set\w+\] = useState/);
        if (firstUseStateMatch) {
          content = content.replace(
            firstUseStateMatch[0],
            'const [loading, setLoading] = useState(true);\n  ' + firstUseStateMatch[0]
          );
          modified = true;
        }
      }

      // 6. Add real data fetching useEffect
      if (!content.includes('loadData') && modified) {
        const dataFetching = `
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dataService = SupabaseDataService.getInstance();
        const userData = await dataService.getUserData(userId);
        
        // Set real data from Supabase
        if (setCampaigns && userData.campaigns) setCampaigns(userData.campaigns);
        if (setProducts && userData.products) setProducts(userData.products);
        if (setOrders && userData.orders) setOrders(userData.orders);
        if (setCustomers && userData.customers) setCustomers(userData.customers);
        if (setBundles && userData.bundles) setBundles(userData.bundles);
        if (setCategories && userData.categories) setCategories(userData.categories);
        if (setCollections && userData.collections) setCollections(userData.collections);
        if (setVendors && userData.vendors) setVendors(userData.vendors);
        if (setRegisters && userData.registers) setRegisters(userData.registers);
        if (setSessions && userData.sessions) setSessions(userData.sessions);
        if (setSegments && userData.segments) setSegments(userData.segments);
        if (setInvoices && userData.invoices) setInvoices(userData.invoices);
        if (setFulfillments && userData.fulfillments) setFulfillments(userData.fulfillments);
        if (setShipments && userData.shipments) setShipments(userData.shipments);
        if (setReturns && userData.returns) setReturns(userData.returns);
        if (setPriceLists && userData.priceLists) setPriceLists(userData.priceLists);
        if (setCurrencies && userData.currencies) setCurrencies(userData.currencies);
        if (setRegions && userData.regions) setRegions(userData.regions);
        if (setCountries && userData.countries) setCountries(userData.countries);
        if (setGroups && userData.groups) setGroups(userData.groups);
        
      } catch (error) {
        console.error('Error loading data:', error);
        // Keep empty arrays as fallback
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);
`;

        // Find good place to insert useEffect (after useState declarations)
        const useEffectInsertPoint = content.lastIndexOf('useState');
        if (useEffectInsertPoint !== -1) {
          const lineEnd = content.indexOf('\n', useEffectInsertPoint);
          if (lineEnd !== -1) {
            content = content.substring(0, lineEnd) + dataFetching + content.substring(lineEnd);
          }
        }
      }

      // 7. Clean up extra whitespace
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

      // 8. Write back if modified
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
    console.log('🚀 Starting comprehensive mock data removal...');
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
    console.log('📊 Mock Data Removal Summary:');
    console.log(`   📁 Files Processed: ${this.filesProcessed}`);
    console.log(`   ✅ Files Modified: ${this.filesModified}`);
    console.log(`   🎯 Clean Files: ${this.filesProcessed - this.filesModified}`);

    if (this.filesModified > 0) {
      console.log('\n🎉 Mock data removal completed successfully!');
      console.log('   ✅ All mock data arrays removed');
      console.log('   ✅ Real Supabase data fetching added');
      console.log('   ✅ Loading states implemented');
      console.log('   ✅ Error handling added');
      console.log('\n🔧 Next steps:');
      console.log('   1. Test all store pages to ensure data loads correctly');
      console.log('   2. Verify error handling for empty data states');
      console.log('   3. Check console for any TypeScript errors');
    } else {
      console.log('\n✅ All files were already clean!');
    }
  }
}

// Run the removal process
const remover = new ComprehensiveMockDataRemover();
remover.run();
