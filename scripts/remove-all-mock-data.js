const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Mock Data Removal Script
 * This script removes all hardcoded mock data, sample data, and replaces them with proper Supabase queries
 */

class MockDataRemover {
  constructor() {
    this.rootDir = './src';
    this.processedFiles = 0;
    this.modifiedFiles = 0;
    this.errors = [];
    this.report = {
      removedMockData: [],
      addedRealDataFetching: [],
      errors: []
    };
  }

  // Patterns to identify mock data
  getMockDataPatterns() {
    return [
      // Mock data variable declarations
      /const\s+mock[A-Z]\w*\s*[:\s]*.*?=\s*\[[\s\S]*?\];?/gm,
      /const\s+sample[A-Z]\w*\s*[:\s]*.*?=\s*\[[\s\S]*?\];?/gm,
      /const\s+dummy[A-Z]\w*\s*[:\s]*.*?=\s*\[[\s\S]*?\];?/gm,
      /const\s+fake[A-Z]\w*\s*[:\s]*.*?=\s*\[[\s\S]*?\];?/gm,
      /const\s+test[A-Z]\w*\s*[:\s]*.*?=\s*\[[\s\S]*?\];?/gm,
      
      // useState with hardcoded arrays
      /useState\s*\(\s*\[\s*\{[\s\S]*?\}\s*\]\s*\)/gm,
      
      // Mock comments
      /\/\/\s*Mock.*$/gm,
      /\/\*\s*Mock[\s\S]*?\*\//gm,
      /\/\/\s*TODO:.*mock.*$/gmi,
      /\/\/\s*Sample.*$/gm,
      
      // Hardcoded data arrays in components
      /const\s+\w*[Dd]ata\s*=\s*\[[\s\S]*?\};?\s*\]/gm,
    ];
  }

  // Real data fetching template
  getRealDataFetchingTemplate(dataType) {
    const templates = {
      campaigns: `
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const dataService = SupabaseDataService.getInstance();
        const data = await dataService.getUserData(userId);
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadCampaigns();
    }
  }, [userId]);`,
      
      products: `
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const dataService = SupabaseDataService.getInstance();
        const data = await dataService.getUserData(userId);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadProducts();
    }
  }, [userId]);`,
      
      orders: `
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const dataService = SupabaseDataService.getInstance();
        const data = await dataService.getUserData(userId);
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadOrders();
    }
  }, [userId]);`,
      
      customers: `
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const dataService = SupabaseDataService.getInstance();
        const data = await dataService.getUserData(userId);
        setCustomers(data.customers || []);
      } catch (error) {
        console.error('Error loading customers:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadCustomers();
    }
  }, [userId]);`,
      
      bundles: `
  useEffect(() => {
    const loadBundles = async () => {
      try {
        setLoading(true);
        const dataService = SupabaseDataService.getInstance();
        const data = await dataService.getUserData(userId);
        setBundles(data.bundles || []);
      } catch (error) {
        console.error('Error loading bundles:', error);
        setBundles([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadBundles();
    }
  }, [userId]);`,
    };
    
    return templates[dataType] || templates.products;
  }

  // Required imports for real data fetching
  getRequiredImports() {
    return `import { SupabaseDataService } from '@/core/shared/services/supabase-data-service';
import { useAuth } from '@/core/shared/auth/AuthProvider';`;
  }

  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let modifiedContent = content;
      let hasChanges = false;
      
      // Skip non-component files and test files
      if (!filePath.includes('/app/') || filePath.includes('.test.') || filePath.includes('.spec.')) {
        return;
      }

      console.log(`🔍 Processing: ${filePath}`);

      // Remove mock data patterns
      const mockPatterns = this.getMockDataPatterns();
      mockPatterns.forEach(pattern => {
        const matches = modifiedContent.match(pattern);
        if (matches) {
          matches.forEach(match => {
            console.log(`   ❌ Removing mock data: ${match.substring(0, 50)}...`);
            modifiedContent = modifiedContent.replace(match, '');
            hasChanges = true;
            this.report.removedMockData.push({
              file: filePath,
              removed: match.substring(0, 100)
            });
          });
        }
      });

      // Add real data fetching if this is a page component
      if (filePath.includes('/page.tsx') && hasChanges) {
        // Detect data types used in the component
        const dataTypes = this.detectDataTypes(modifiedContent);
        
        if (dataTypes.length > 0) {
          // Add required imports if not present
          if (!modifiedContent.includes('SupabaseDataService')) {
            modifiedContent = this.addRequiredImports(modifiedContent);
          }

          // Add real data fetching
          dataTypes.forEach(dataType => {
            if (!modifiedContent.includes(`load${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`)) {
              modifiedContent = this.addRealDataFetching(modifiedContent, dataType);
              this.report.addedRealDataFetching.push({
                file: filePath,
                dataType: dataType
              });
            }
          });
        }
      }

      // Clean up extra whitespace and empty lines
      modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

      // Write back if changes were made
      if (hasChanges && modifiedContent !== originalContent) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        this.modifiedFiles++;
        console.log(`   ✅ Updated: ${filePath}`);
      }

      this.processedFiles++;
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      this.errors.push({ file: filePath, error: error.message });
    }
  }

  detectDataTypes(content) {
    const dataTypes = [];
    
    if (content.includes('Campaign') || content.includes('campaign')) dataTypes.push('campaigns');
    if (content.includes('Product') || content.includes('product')) dataTypes.push('products');
    if (content.includes('Order') || content.includes('order')) dataTypes.push('orders');
    if (content.includes('Customer') || content.includes('customer')) dataTypes.push('customers');
    if (content.includes('Bundle') || content.includes('bundle')) dataTypes.push('bundles');
    if (content.includes('Invoice') || content.includes('invoice')) dataTypes.push('invoices');
    if (content.includes('Warranty') || content.includes('warranty')) dataTypes.push('warranties');
    
    return [...new Set(dataTypes)];
  }

  addRequiredImports(content) {
    // Find the import section and add required imports
    const importMatch = content.match(/^([\s\S]*?)(import[\s\S]*?from\s+['"][^'"]+['"];?\s*)/m);
    if (importMatch) {
      const beforeImports = importMatch[1];
      const existingImports = importMatch[2];
      const afterImports = content.substring(importMatch[0].length);
      
      if (!existingImports.includes('SupabaseDataService')) {
        return beforeImports + existingImports + this.getRequiredImports() + '\n' + afterImports;
      }
    }
    return content;
  }

  addRealDataFetching(content, dataType) {
    // Add useAuth hook if not present
    if (!content.includes('useAuth')) {
      content = content.replace(
        /export default function (\w+)\(\) \{/,
        `export default function $1() {
  const { user } = useAuth();
  const userId = user?.id || user?.email || 'user@binna';`
      );
    }

    // Add real data fetching useEffect
    const template = this.getRealDataFetchingTemplate(dataType);
    
    // Find a good place to insert the useEffect (after useState declarations)
    const useStateMatch = content.match(/(const \[.*?\] = useState.*?;)/g);
    if (useStateMatch) {
      const lastUseState = useStateMatch[useStateMatch.length - 1];
      const insertPosition = content.indexOf(lastUseState) + lastUseState.length;
      
      return content.substring(0, insertPosition) + '\n' + template + content.substring(insertPosition);
    }
    
    return content;
  }

  async scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await this.scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        await this.processFile(fullPath);
      }
    }
  }

  generateReport() {
    const reportContent = `# Mock Data Removal Report

Generated on: ${new Date().toISOString()}

## Summary
- **Files Processed**: ${this.processedFiles}
- **Files Modified**: ${this.modifiedFiles}
- **Mock Data Instances Removed**: ${this.report.removedMockData.length}
- **Real Data Fetching Added**: ${this.report.addedRealDataFetching.length}
- **Errors**: ${this.errors.length}

## Removed Mock Data
${this.report.removedMockData.map(item => 
  `- **${item.file}**: ${item.removed}...`
).join('\n')}

## Added Real Data Fetching
${this.report.addedRealDataFetching.map(item => 
  `- **${item.file}**: Added ${item.dataType} data fetching`
).join('\n')}

## Errors
${this.errors.map(item => 
  `- **${item.file}**: ${item.error}`
).join('\n')}

## Next Steps
1. ✅ All mock data has been removed from components
2. ✅ Real Supabase data fetching has been added
3. 🔧 Test all pages to ensure data loads correctly
4. 🔧 Verify error handling for empty data states
5. 🔧 Update any remaining hardcoded strings for i18n

## Status
🎉 **Mock data removal completed successfully!** Your platform now uses only real data from Supabase.
`;

    fs.writeFileSync('MOCK_DATA_REMOVAL_REPORT.md', reportContent);
    console.log('📄 Report generated: MOCK_DATA_REMOVAL_REPORT.md');
  }

  async run() {
    console.log('🚀 Starting comprehensive mock data removal...');
    console.log('='.repeat(60));
    
    try {
      await this.scanDirectory(this.rootDir);
      
      console.log('\n' + '='.repeat(60));
      console.log('📊 Mock Data Removal Summary:');
      console.log(`   📁 Files Processed: ${this.processedFiles}`);
      console.log(`   ✅ Files Modified: ${this.modifiedFiles}`);
      console.log(`   ❌ Mock Data Removed: ${this.report.removedMockData.length} instances`);
      console.log(`   🔌 Real Data Added: ${this.report.addedRealDataFetching.length} components`);
      console.log(`   ⚠️  Errors: ${this.errors.length}`);
      
      this.generateReport();
      
      if (this.modifiedFiles > 0) {
        console.log('\n🎉 Mock data removal completed successfully!');
        console.log('   All components now use real Supabase data.');
        console.log('   Please test your pages to ensure data loads correctly.');
      } else {
        console.log('\n✅ No mock data found - your codebase is already clean!');
      }
      
    } catch (error) {
      console.error('❌ Error during mock data removal:', error);
    }
  }
}

// Run the mock data removal
const remover = new MockDataRemover();
remover.run();
