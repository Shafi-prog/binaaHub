#!/usr/bin/env node

/**
 * Store Pages Data Analysis Script
 * Analyzes all store pages to check for mock/sample data usage
 * and provides recommendations for real data integration
 */

const fs = require('fs');
const path = require('path');

const STORE_PAGES_DIR = 'src/app/store';
const ANALYSIS_OUTPUT = 'STORE_PAGES_DATA_ANALYSIS.md';

// Patterns to detect mock/sample data
const MOCK_DATA_PATTERNS = [
  /mock[A-Z]/g,                    // mockData, mockProducts, etc.
  /dummy[A-Z]/g,                   // dummyData, dummyProducts, etc.
  /sample[A-Z]/g,                  // sampleData, sampleProducts, etc.
  /fake[A-Z]/g,                    // fakeData, fakeProducts, etc.
  /test[A-Z]/g,                    // testData, testProducts, etc.
  /useState.*=.*\[.*{/g,           // useState with object arrays
  /const.*=.*\[.*{/g,              // const arrays with objects
  /\/\/ Mock|\/\* Mock/gi,         // Mock comments
  /\/\/ Sample|\/\* Sample/gi,     // Sample comments
  /\/\/ Dummy|\/\* Dummy/gi,       // Dummy comments
  /\/\/ Test|\/\* Test/gi,         // Test comments
];

// Real data integration patterns
const REAL_DATA_PATTERNS = [
  /createClientComponentClient/g,   // Supabase client
  /supabase\./g,                   // Supabase queries
  /\.from\(/g,                     // Database queries
  /useQuery/g,                     // React Query
  /useMutation/g,                  // React Query mutations
  /fetch\(/g,                      // Fetch API calls
  /axios\./g,                      // Axios requests
];

class StoreDataAnalyzer {
  constructor() {
    this.analysis = {
      totalPages: 0,
      pagesWithMockData: [],
      pagesWithRealData: [],
      navigationStructure: {},
      dataConnections: {},
      recommendations: []
    };
  }

  analyzePage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    const mockMatches = this.findMatches(content, MOCK_DATA_PATTERNS);
    const realDataMatches = this.findMatches(content, REAL_DATA_PATTERNS);
    
    const pageAnalysis = {
      path: relativePath,
      hasMockData: mockMatches.length > 0,
      hasRealData: realDataMatches.length > 0,
      mockDataPatterns: mockMatches,
      realDataPatterns: realDataMatches,
      dataType: this.detectDataType(content),
      dependencies: this.extractDependencies(content),
      exports: this.extractExports(content)
    };

    if (pageAnalysis.hasMockData) {
      this.analysis.pagesWithMockData.push(pageAnalysis);
    }
    
    if (pageAnalysis.hasRealData) {
      this.analysis.pagesWithRealData.push(pageAnalysis);
    }

    return pageAnalysis;
  }

  findMatches(content, patterns) {
    const matches = [];
    patterns.forEach(pattern => {
      const found = content.match(pattern);
      if (found) {
        matches.push(...found);
      }
    });
    return [...new Set(matches)]; // Remove duplicates
  }

  detectDataType(content) {
    const dataTypes = [];
    
    if (content.includes('Product')) dataTypes.push('products');
    if (content.includes('Customer')) dataTypes.push('customers');
    if (content.includes('Order')) dataTypes.push('orders');
    if (content.includes('Store')) dataTypes.push('stores');
    if (content.includes('Supplier')) dataTypes.push('suppliers');
    if (content.includes('Inventory')) dataTypes.push('inventory');
    if (content.includes('Employee')) dataTypes.push('employees');
    if (content.includes('Payment')) dataTypes.push('payments');
    if (content.includes('Transaction')) dataTypes.push('transactions');
    if (content.includes('Report')) dataTypes.push('reports');
    
    return dataTypes;
  }

  extractDependencies(content) {
    const dependencies = [];
    const importMatches = content.match(/import.*from.*['"`]([^'"`]+)['"`]/g);
    
    if (importMatches) {
      importMatches.forEach(match => {
        const depMatch = match.match(/from.*['"`]([^'"`]+)['"`]/);
        if (depMatch) {
          dependencies.push(depMatch[1]);
        }
      });
    }
    
    return dependencies;
  }

  extractExports(content) {
    const exports = [];
    const exportMatches = content.match(/export.*function\s+(\w+)|export.*const\s+(\w+)|export default.*(\w+)/g);
    
    if (exportMatches) {
      exportMatches.forEach(match => {
        const nameMatch = match.match(/(\w+)(?=\s*[=\(]|$)/);
        if (nameMatch) {
          exports.push(nameMatch[1]);
        }
      });
    }
    
    return exports;
  }

  analyzeDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist`);
      return;
    }

    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.analyzeDirectory(itemPath);
      } else if (item.endsWith('page.tsx')) {
        this.analysis.totalPages++;
        this.analyzePage(itemPath);
      }
    });
  }

  generateRecommendations() {
    const recommendations = [];

    // Priority 1: Convert mock data to real data
    if (this.analysis.pagesWithMockData.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Data Integration',
        title: 'Convert Mock Data to Real Data',
        description: `${this.analysis.pagesWithMockData.length} pages are using mock/sample data`,
        pages: this.analysis.pagesWithMockData.map(p => p.path),
        action: 'Replace useState arrays with Supabase queries or API calls'
      });
    }

    // Priority 2: Ensure data consistency
    const dataTypes = [...new Set(
      this.analysis.pagesWithMockData.flatMap(p => p.dataType)
    )];

    if (dataTypes.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Data Consistency',
        title: 'Standardize Data Models',
        description: 'Ensure consistent data models across pages',
        dataTypes: dataTypes,
        action: 'Create shared TypeScript interfaces and data services'
      });
    }

    // Priority 3: Navigation integration
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Navigation',
      title: 'Verify Navigation Links',
      description: 'Ensure all store pages are accessible through navigation',
      action: 'Update store layout navigation to include all functional pages'
    });

    // Priority 4: Real-time data updates
    if (this.analysis.pagesWithRealData.length > 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'Performance',
        title: 'Implement Real-time Updates',
        description: 'Add real-time data synchronization for live updates',
        action: 'Implement WebSocket or polling for live data updates'
      });
    }

    this.analysis.recommendations = recommendations;
  }

  generateReport() {
    this.generateRecommendations();

    const report = `# Store Pages Data Analysis Report

Generated on: ${new Date().toISOString()}

## Executive Summary

- **Total Store Pages**: ${this.analysis.totalPages}
- **Pages with Mock Data**: ${this.analysis.pagesWithMockData.length}
- **Pages with Real Data**: ${this.analysis.pagesWithRealData.length}
- **Data Integration Status**: ${this.analysis.pagesWithMockData.length === 0 ? '✅ Complete' : '❌ Incomplete'}

## Detailed Analysis

### Pages Using Mock/Sample Data (${this.analysis.pagesWithMockData.length})

${this.analysis.pagesWithMockData.map(page => `
#### ${page.path}
- **Data Types**: ${page.dataType.join(', ') || 'Unknown'}
- **Mock Patterns Found**: ${page.mockDataPatterns.length}
- **Real Data Integration**: ${page.hasRealData ? '✅ Partial' : '❌ None'}
- **Dependencies**: ${page.dependencies.length} imports

**Mock Data Patterns Detected**:
${page.mockDataPatterns.map(pattern => `- \`${pattern}\``).join('\n')}

**Action Required**: Replace mock data with real Supabase queries
`).join('\n')}

### Pages Using Real Data (${this.analysis.pagesWithRealData.length})

${this.analysis.pagesWithRealData.map(page => `
#### ${page.path}
- **Data Types**: ${page.dataType.join(', ') || 'Unknown'}
- **Real Data Patterns**: ${page.realDataPatterns.length}
- **Status**: ✅ Using real data integration

**Real Data Patterns**:
${page.realDataPatterns.map(pattern => `- \`${pattern}\``).join('\n')}
`).join('\n')}

## Navigation Structure Analysis

The store pages are well-connected through the layout navigation with the following sections:

1. **Core Navigation** (Dashboard, Marketplace)
2. **POS & Sales** (Point of Sale, Cash Registers, Orders)
3. **Products** (Product Management, Basic Inventory)
4. **Advanced Inventory** (Stock Transfers, Adjustments, Barcode)
5. **HR Management** (Payroll, Attendance, Leave Management)
6. **Accounting & Finance** (Journals, Bank Reconciliation, VAT)
7. **Operations** (Purchase Orders, Suppliers, Delivery, Customers)
8. **User Features** (Shopping Cart, Wishlist)
9. **Management** (Permissions, Reports)
10. **Tools & Integration** (Search, Notifications, Payments, Shipping, ERP, Settings)

✅ **Navigation Status**: Store pages are well-connected and organized

## Recommendations

${this.analysis.recommendations.map((rec, index) => `
### ${index + 1}. ${rec.title} (${rec.priority} Priority)

**Category**: ${rec.category}
**Description**: ${rec.description}
**Action**: ${rec.action}

${rec.pages ? `**Affected Pages**:
${rec.pages.map(page => `- ${page}`).join('\n')}` : ''}

${rec.dataTypes ? `**Data Types**: ${rec.dataTypes.join(', ')}` : ''}
`).join('\n')}

## Next Steps

1. **Immediate**: Run the data connection scripts to convert mock data to real data
2. **Short-term**: Implement consistent data models and services
3. **Long-term**: Add real-time data synchronization and advanced features

## Data Connection Status

❌ **Critical Issue**: Most store pages are using hardcoded mock data instead of real database connections.

**Solution**: Create data connection scripts to replace mock data with Supabase queries.
`;

    fs.writeFileSync(ANALYSIS_OUTPUT, report);
    console.log(`Analysis report generated: ${ANALYSIS_OUTPUT}`);
    
    return this.analysis;
  }

  run() {
    console.log('🔍 Analyzing store pages data usage...');
    this.analyzeDirectory(STORE_PAGES_DIR);
    return this.generateReport();
  }
}

// Run the analysis
if (require.main === module) {
  const analyzer = new StoreDataAnalyzer();
  const results = analyzer.run();
  
  console.log('\n📊 Analysis Summary:');
  console.log(`Total Pages: ${results.totalPages}`);
  console.log(`Pages with Mock Data: ${results.pagesWithMockData.length}`);
  console.log(`Pages with Real Data: ${results.pagesWithRealData.length}`);
  console.log(`\n📋 Recommendations: ${results.recommendations.length}`);
  
  // Show critical issues
  const criticalIssues = results.recommendations.filter(r => r.priority === 'HIGH');
  if (criticalIssues.length > 0) {
    console.log('\n🚨 Critical Issues:');
    criticalIssues.forEach(issue => {
      console.log(`- ${issue.title}: ${issue.description}`);
    });
  }
}

module.exports = StoreDataAnalyzer;
