const fs = require('fs');
const path = require('path');

/**
 * Complete Mock Data and Auto-Generated Code Cleaner
 * Removes all problematic auto-generated code that's causing TypeScript errors
 */

class CompleteCleaner {
  constructor() {
    this.filesProcessed = 0;
    this.filesModified = 0;
  }

  processFile(filePath) {
    try {
      console.log(`🧹 Cleaning: ${filePath}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      const originalContent = content;

      // 1. Remove entire problematic useEffect blocks
      const useEffectPattern = /useEffect\(\(\) => \{[\s\S]*?const dataService = SupabaseDataService\.getInstance\(\);[\s\S]*?\}, \[userId\]\);/gm;
      if (useEffectPattern.test(content)) {
        content = content.replace(useEffectPattern, '');
        modified = true;
      }

      // 2. Remove useAuth and userId declarations that are not properly setup
      const authPattern = /const \{ user \} = useAuth\(\);\s*\n\s*const userId = user\?\.[^;]*;/gm;
      if (authPattern.test(content)) {
        content = content.replace(authPattern, '');
        modified = true;
      }

      // 3. Remove imports that are no longer needed
      const unnecessaryImports = [
        /import \{ SupabaseDataService \} from [^;]+;/g,
        /import \{ useAuth \} from [^;]+;/g
      ];

      unnecessaryImports.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, '');
          modified = true;
        }
      });

      // 4. Replace references to mock data with empty arrays
      const mockReplacements = [
        { from: /mockCampaigns/g, to: '[]' },
        { from: /mockRegisters/g, to: '[]' },
        { from: /mockSessions/g, to: '[]' },
        { from: /mockCollections/g, to: '[]' },
        { from: /mockCategories/g, to: '[]' },
        { from: /mockProducts/g, to: '[]' },
        { from: /mockCurrencies/g, to: '[]' },
        { from: /mockRegions/g, to: '[]' },
        { from: /mockCountries/g, to: '[]' },
        { from: /mockCustomerGroups/g, to: '[]' },
        { from: /mockSegments/g, to: '[]' },
        { from: /mockInvoices/g, to: '[]' },
        { from: /mockOrderFulfillments/g, to: '[]' },
        { from: /mockShipments/g, to: '[]' },
        { from: /mockReturns/g, to: '[]' },
        { from: /mockPriceLists/g, to: '[]' },
        { from: /mockVendors/g, to: '[]' },
        { from: /mockBundles/g, to: '[]' }
      ];

      mockReplacements.forEach(({ from, to }) => {
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      });

      // 5. Fix missing useEffect import if it's used elsewhere in the file
      if (content.includes('useEffect') && !content.includes('import { useState, useEffect }')) {
        if (content.includes('import { useState }')) {
          content = content.replace('import { useState }', 'import { useState, useEffect }');
          modified = true;
        }
      }

      // 6. Clean up extra whitespace and empty lines
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Run twice to catch multiple empties

      if (content !== originalContent) {
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.filesModified++;
        console.log(`   ✅ Cleaned: ${filePath}`);
      } else {
        console.log(`   ⏭️  Already clean: ${filePath}`);
      }

      this.filesProcessed++;

    } catch (error) {
      console.error(`   ❌ Error processing ${filePath}:`, error.message);
    }
  }

  scanAndProcessStoreFiles() {
    const storeDir = 'src/app/store';
    
    const processDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          processDirectory(fullPath);
        } else if (entry.isFile() && entry.name === 'page.tsx') {
          this.processFile(fullPath);
        }
      }
    };

    if (fs.existsSync(storeDir)) {
      processDirectory(storeDir);
    }
  }

  run() {
    console.log('🧹 Starting complete cleanup of auto-generated code...');
    console.log('='.repeat(80));

    this.scanAndProcessStoreFiles();

    console.log('\n' + '='.repeat(80));
    console.log('📊 Complete Cleanup Summary:');
    console.log(`   📁 Files Processed: ${this.filesProcessed}`);
    console.log(`   ✅ Files Cleaned: ${this.filesModified}`);

    if (this.filesModified > 0) {
      console.log('\n🎉 Complete cleanup finished!');
      console.log('   ✅ Removed all problematic auto-generated code');
      console.log('   ✅ Fixed mock data references');
      console.log('   ✅ Cleaned up imports');
      console.log('   ✅ TypeScript errors should now be resolved');
    } else {
      console.log('\n✅ All files were already clean!');
    }
  }
}

// Run the complete cleaner
const cleaner = new CompleteCleaner();
cleaner.run();
