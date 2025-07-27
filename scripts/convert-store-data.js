#!/usr/bin/env node

/**
 * Store Data Connection Automation Script
 * Converts store pages from mock data to real Supabase data connections
 */

const fs = require('fs');
const path = require('path');

const STORE_PAGES_DIR = 'src/app/store';
const BACKUP_DIR = 'store-pages-backup';
const CONVERSION_LOG = 'STORE_DATA_CONVERSION_LOG.md';

class StoreDataConnector {
  constructor() {
    this.conversions = [];
    this.errors = [];
    this.stats = {
      totalPages: 0,
      convertedPages: 0,
      skippedPages: 0,
      errorPages: 0
    };
  }

  // Data type to Supabase table mapping
  getDataMappings() {
    return {
      products: {
        table: 'products',
        fields: ['id', 'name', 'description', 'price', 'category', 'stock_quantity', 'is_available', 'store_id'],
        relations: ['store:stores(*)']
      },
      customers: {
        table: 'customers',
        fields: ['id', 'name', 'email', 'phone', 'address', 'city', 'type', 'store_id'],
        relations: []
      },
      orders: {
        table: 'orders',
        fields: ['id', 'customer_id', 'total_amount', 'status', 'created_at', 'store_id'],
        relations: ['customer:customers(*)', 'order_items(*)']
      },
      stores: {
        table: 'stores',
        fields: ['id', 'name', 'description', 'category', 'rating', 'location', 'phone', 'email'],
        relations: []
      },
      suppliers: {
        table: 'suppliers',
        fields: ['id', 'name', 'contact_person', 'phone', 'email', 'address', 'category'],
        relations: []
      },
      inventory: {
        table: 'inventory',
        fields: ['id', 'product_id', 'quantity', 'min_stock', 'max_stock', 'warehouse_id'],
        relations: ['product:products(*)']
      },
      employees: {
        table: 'employees',
        fields: ['id', 'name', 'email', 'phone', 'position', 'department', 'store_id'],
        relations: []
      },
      transactions: {
        table: 'transactions',
        fields: ['id', 'amount', 'type', 'description', 'created_at', 'store_id'],
        relations: []
      }
    };
  }

  // Generate Supabase query code
  generateSupabaseQuery(dataType, tableName, fields, relations) {
    const selectClause = relations.length > 0 
      ? `'*,${relations.join(',')}'`
      : "'*'";
    
    return `
  // Fetch ${dataType} from Supabase
  const fetch${dataType.charAt(0).toUpperCase() + dataType.slice(1)} = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('${tableName}')
        .select(${selectClause})
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching ${dataType}:', error);
        return;
      }
      
      if (data) {
        set${dataType.charAt(0).toUpperCase() + dataType.slice(1)}(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };`;
  }

  // Generate useEffect hook
  generateUseEffect(dataTypes) {
    const fetchCalls = dataTypes.map(type => 
      `fetch${type.charAt(0).toUpperCase() + type.slice(1)}();`
    ).join('\n    ');

    return `
  useEffect(() => {
    ${fetchCalls}
  }, []);`;
  }

  // Generate imports
  generateImports() {
    return `import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';`;
  }

  // Generate Supabase client
  generateSupabaseClient() {
    return `const supabase = createClientComponentClient();`;
  }

  // Convert mock data patterns to real data
  convertMockDataToReal(content, dataTypes) {
    let convertedContent = content;

    // Add imports if not present
    if (!content.includes('createClientComponentClient')) {
      const importMatch = content.match(/^(import.*\n)+/m);
      if (importMatch) {
        const lastImport = importMatch[0];
        convertedContent = convertedContent.replace(
          lastImport,
          lastImport + this.generateImports() + '\n'
        );
      }
    }

    // Add Supabase client if not present
    if (!content.includes('createClientComponentClient()')) {
      const componentMatch = content.match(/export default function \w+\(\) \{/);
      if (componentMatch) {
        const functionStart = componentMatch[0];
        convertedContent = convertedContent.replace(
          functionStart,
          functionStart + '\n' + this.generateSupabaseClient() + '\n'
        );
      }
    }

    // Add loading state if not present
    if (!content.includes('const [loading, setLoading]')) {
      const stateMatch = content.match(/const \[.*?\] = useState/);
      if (stateMatch) {
        convertedContent = convertedContent.replace(
          stateMatch[0],
          `const [loading, setLoading] = useState(true);\n  ${stateMatch[0]}`
        );
      }
    }

    // Replace mock data arrays with empty arrays and add fetch functions
    const dataMappings = this.getDataMappings();
    dataTypes.forEach(dataType => {
      if (dataMappings[dataType]) {
        const mapping = dataMappings[dataType];
        
        // Replace useState with mock data
        const mockArrayPattern = new RegExp(
          `const \\[${dataType}\\] = useState(?:<[^>]+>)?\\(\\[[^\\]]*\\{[\\s\\S]*?\\}[\\s\\S]*?\\]\\)`,
          'g'
        );
        
        if (mockArrayPattern.test(convertedContent)) {
          convertedContent = convertedContent.replace(
            mockArrayPattern,
            `const [${dataType}, set${dataType.charAt(0).toUpperCase() + dataType.slice(1)}] = useState<any[]>([]);`
          );

          // Add fetch function
          const fetchFunction = this.generateSupabaseQuery(
            dataType, 
            mapping.table, 
            mapping.fields, 
            mapping.relations
          );

          // Insert fetch function before useEffect or component end
          const useEffectMatch = convertedContent.match(/useEffect\([^}]+\}, \[\]\);/);
          if (useEffectMatch) {
            convertedContent = convertedContent.replace(
              useEffectMatch[0],
              fetchFunction + '\n\n' + this.generateUseEffect([dataType])
            );
          } else {
            // Add at the end of component logic
            const returnMatch = convertedContent.match(/return \(/);
            if (returnMatch) {
              const insertIndex = convertedContent.indexOf(returnMatch[0]);
              convertedContent = 
                convertedContent.slice(0, insertIndex) +
                fetchFunction + '\n\n' + this.generateUseEffect([dataType]) + '\n\n  ' +
                convertedContent.slice(insertIndex);
            }
          }
        }
      }
    });

    // Remove mock data comments
    convertedContent = convertedContent.replace(/\/\/ Mock.*$/gm, '// Real data from Supabase');
    convertedContent = convertedContent.replace(/\/\* Mock.*?\*\//gs, '/* Real data from Supabase */');

    return convertedContent;
  }

  // Detect data types used in a file
  detectDataTypes(content) {
    const dataTypes = [];
    const dataMappings = this.getDataMappings();
    
    Object.keys(dataMappings).forEach(dataType => {
      if (content.includes(dataType) || content.includes(dataType.charAt(0).toUpperCase() + dataType.slice(1))) {
        dataTypes.push(dataType);
      }
    });
    
    return dataTypes;
  }

  // Convert a single page
  convertPage(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Skip if already converted
      if (content.includes('createClientComponentClient') && 
          !content.includes('useState<') && 
          !content.includes('= [')) {
        this.stats.skippedPages++;
        return { success: true, message: 'Already converted', path: relativePath };
      }

      // Detect data types
      const dataTypes = this.detectDataTypes(content);
      
      if (dataTypes.length === 0) {
        this.stats.skippedPages++;
        return { success: true, message: 'No data types detected', path: relativePath };
      }

      // Convert mock data to real data
      const convertedContent = this.convertMockDataToReal(content, dataTypes);
      
      // Create backup
      const backupPath = path.join(BACKUP_DIR, relativePath);
      const backupDir = path.dirname(backupPath);
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      fs.writeFileSync(backupPath, content);
      
      // Write converted content
      fs.writeFileSync(filePath, convertedContent);
      
      this.stats.convertedPages++;
      return { 
        success: true, 
        message: `Converted ${dataTypes.length} data types: ${dataTypes.join(', ')}`, 
        path: relativePath,
        dataTypes: dataTypes
      };
      
    } catch (error) {
      this.stats.errorPages++;
      this.errors.push({ path: filePath, error: error.message });
      return { success: false, message: error.message, path: filePath };
    }
  }

  // Convert all store pages
  convertAllPages(dirPath = STORE_PAGES_DIR) {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist`);
      return;
    }

    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.convertAllPages(itemPath);
      } else if (item.endsWith('page.tsx')) {
        this.stats.totalPages++;
        const result = this.convertPage(itemPath);
        this.conversions.push(result);
        
        if (result.success) {
          console.log(`✅ ${result.path}: ${result.message}`);
        } else {
          console.log(`❌ ${result.path}: ${result.message}`);
        }
      }
    });
  }

  // Generate conversion report
  generateReport() {
    const report = `# Store Data Conversion Report

Generated on: ${new Date().toISOString()}

## Conversion Summary

- **Total Pages Processed**: ${this.stats.totalPages}
- **Successfully Converted**: ${this.stats.convertedPages}
- **Skipped (Already Converted)**: ${this.stats.skippedPages}
- **Errors**: ${this.stats.errorPages}
- **Success Rate**: ${((this.stats.convertedPages / this.stats.totalPages) * 100).toFixed(1)}%

## Conversion Details

### Successfully Converted Pages (${this.stats.convertedPages})

${this.conversions.filter(c => c.success && c.dataTypes).map(conversion => `
#### ${conversion.path}
- **Status**: ✅ Converted
- **Data Types**: ${conversion.dataTypes?.join(', ') || 'Unknown'}
- **Changes**: Added Supabase queries, loading states, and useEffect hooks
`).join('\n')}

### Skipped Pages (${this.stats.skippedPages})

${this.conversions.filter(c => c.success && !c.dataTypes).map(conversion => `
#### ${conversion.path}
- **Status**: ⏭️ Skipped
- **Reason**: ${conversion.message}
`).join('\n')}

### Error Pages (${this.stats.errorPages})

${this.errors.map(error => `
#### ${error.path}
- **Status**: ❌ Error
- **Error**: ${error.error}
`).join('\n')}

## What Was Changed

For each converted page, the following modifications were made:

1. **Added Supabase Import**: \`import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';\`
2. **Added Supabase Client**: \`const supabase = createClientComponentClient();\`
3. **Added Loading State**: \`const [loading, setLoading] = useState(true);\`
4. **Replaced Mock Data**: Converted hardcoded arrays to empty arrays with setState functions
5. **Added Fetch Functions**: Created async functions to fetch data from Supabase
6. **Added useEffect**: Automatically fetch data on component mount
7. **Updated Comments**: Changed "Mock" comments to "Real data from Supabase"

## Database Tables Required

The following Supabase tables are referenced by the converted pages:

- \`products\` - Product catalog data
- \`customers\` - Customer information
- \`orders\` - Order management
- \`stores\` - Store information
- \`suppliers\` - Supplier management
- \`inventory\` - Stock management
- \`employees\` - Staff management
- \`transactions\` - Financial transactions

## Next Steps

1. **Verify Database Schema**: Ensure all required tables exist in Supabase
2. **Test Converted Pages**: Check that all pages load correctly with real data
3. **Handle Empty States**: Add proper loading and empty state UI components
4. **Add Error Handling**: Implement user-friendly error messages
5. **Optimize Queries**: Add proper filtering, sorting, and pagination

## Backup Information

Original files have been backed up to: \`${BACKUP_DIR}/\`

To restore original files if needed:
\`\`\`bash
cp -r ${BACKUP_DIR}/src/app/store/* src/app/store/
\`\`\`
`;

    fs.writeFileSync(CONVERSION_LOG, report);
    console.log(`\n📋 Conversion report generated: ${CONVERSION_LOG}`);
  }

  // Run the conversion
  run() {
    console.log('🔄 Starting store data conversion...');
    console.log(`📂 Processing directory: ${STORE_PAGES_DIR}`);
    
    // Create backup directory
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    this.convertAllPages();
    this.generateReport();
    
    console.log('\n📊 Conversion Summary:');
    console.log(`Total Pages: ${this.stats.totalPages}`);
    console.log(`Converted: ${this.stats.convertedPages}`);
    console.log(`Skipped: ${this.stats.skippedPages}`);
    console.log(`Errors: ${this.stats.errorPages}`);
    
    return this.stats;
  }
}

// Run the conversion
if (require.main === module) {
  const connector = new StoreDataConnector();
  const results = connector.run();
  
  if (results.convertedPages > 0) {
    console.log('\n✅ Store data conversion completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Verify your Supabase database schema');
    console.log('2. Test the converted pages');
    console.log('3. Add proper error handling and loading states');
  } else {
    console.log('\n⚠️ No pages were converted. They may already be using real data.');
  }
}

module.exports = StoreDataConnector;
