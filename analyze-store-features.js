/**
 * Comprehensive Store Features Analysis
 * Scans all store pages and identifies features, duplicates, and system integrations
 */

const fs = require('fs');
const path = require('path');

// Systems to check for
const SYSTEMS = ['rawaa', 'onyx', 'wafeq', 'mezan', 'wafeq', 'medusa'];
const FEATURE_CATEGORIES = {
  'FINANCIAL': ['accounting', 'invoicing', 'billing', 'payment', 'expense', 'financial', 'cost', 'price', 'revenue'],
  'INVENTORY': ['inventory', 'stock', 'warehouse', 'product', 'variant', 'supplier', 'procurement'],
  'SALES': ['sales', 'order', 'customer', 'pos', 'checkout', 'cart', 'promotion', 'discount'],
  'ANALYTICS': ['analytics', 'report', 'dashboard', 'chart', 'metric', 'kpi', 'insight'],
  'ERP': ['erp', 'integration', 'sync', 'api', 'workflow', 'automation'],
  'CONSTRUCTION': ['construction', 'material', 'project', 'contractor', 'building'],
  'USER_MANAGEMENT': ['user', 'role', 'permission', 'auth', 'profile', 'team'],
  'MARKETPLACE': ['marketplace', 'vendor', 'supplier', 'partner', 'third-party'],
  'SHIPPING': ['shipping', 'delivery', 'logistics', 'fulfillment', 'tracking'],
  'TAX': ['tax', 'vat', 'region', 'compliance', 'rate']
};

const storeBasePath = 'c:/Users/hp/BinnaCodes/binna/src/app/store';
const features = new Map();
const duplicates = [];
const systemReferences = new Map();

// Utility functions
function extractFeatures(content, filePath) {
  const featureData = {
    path: filePath,
    features: [],
    systems: [],
    category: null,
    description: '',
    components: [],
    apis: [],
    duplicatePotential: 0
  };

  // Extract description from comments
  const descriptionMatch = content.match(/\/\*\*[\s\S]*?\*\//);
  if (descriptionMatch) {
    featureData.description = descriptionMatch[0].replace(/\/\*\*|\*\/|\*/g, '').trim();
  }

  // Extract system references
  SYSTEMS.forEach(system => {
    const regex = new RegExp(system, 'gi');
    if (regex.test(content)) {
      featureData.systems.push(system);
      if (!systemReferences.has(system)) {
        systemReferences.set(system, []);
      }
      systemReferences.get(system).push(filePath);
    }
  });

  // Extract component names and APIs
  const componentMatches = content.match(/(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/g);
  if (componentMatches) {
    featureData.components = componentMatches.map(match => match.split(/\s+/).pop());
  }

  const apiMatches = content.match(/(?:fetch|axios|api)\s*\(\s*['"`]([^'"`]+)['"`]/g);
  if (apiMatches) {
    featureData.apis = apiMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1]);
  }

  // Categorize features
  Object.entries(FEATURE_CATEGORIES).forEach(([category, keywords]) => {
    const keywordCount = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      return count + (content.match(regex) || []).length;
    }, 0);
    
    if (keywordCount > 0) {
      featureData.features.push(...keywords.filter(k => new RegExp(k, 'gi').test(content)));
      if (!featureData.category || keywordCount > featureData.duplicatePotential) {
        featureData.category = category;
        featureData.duplicatePotential = keywordCount;
      }
    }
  });

  return featureData;
}

function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const featureData = extractFeatures(content, fullPath);
        
        if (featureData.features.length > 0 || featureData.systems.length > 0) {
          const key = path.basename(fullPath, path.extname(fullPath));
          features.set(fullPath, featureData);
        }
      } catch (error) {
        console.log(`Error reading ${fullPath}: ${error.message}`);
      }
    }
  });
}

function findDuplicates() {
  const featureMap = new Map();
  
  features.forEach((data, filePath) => {
    data.features.forEach(feature => {
      if (!featureMap.has(feature)) {
        featureMap.set(feature, []);
      }
      featureMap.get(feature).push(filePath);
    });
  });
  
  featureMap.forEach((paths, feature) => {
    if (paths.length > 1) {
      duplicates.push({
        feature,
        paths,
        count: paths.length
      });
    }
  });
}

function generateReport() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE STORE FEATURES ANALYSIS REPORT');
  console.log('='.repeat(80));
  
  // System Integration Summary
  console.log('\n🔗 SYSTEM INTEGRATIONS FOUND:');
  console.log('-'.repeat(40));
  systemReferences.forEach((files, system) => {
    console.log(`${system.toUpperCase()}: ${files.length} references`);
    files.forEach(file => {
      console.log(`  - ${file.replace(storeBasePath, '')}`);
    });
  });
  
  // Features by Category
  console.log('\n📊 FEATURES BY CATEGORY:');
  console.log('-'.repeat(40));
  const categoryCount = new Map();
  features.forEach(data => {
    if (data.category) {
      categoryCount.set(data.category, (categoryCount.get(data.category) || 0) + 1);
    }
  });
  
  Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} pages`);
    });
  
  // Duplicate Features
  console.log('\n🔄 POTENTIAL DUPLICATES:');
  console.log('-'.repeat(40));
  duplicates
    .sort((a, b) => b.count - a.count)
    .slice(0, 20) // Top 20 duplicates
    .forEach(duplicate => {
      console.log(`"${duplicate.feature}" found in ${duplicate.count} files:`);
      duplicate.paths.forEach(p => {
        console.log(`  - ${p.replace(storeBasePath, '')}`);
      });
      console.log('');
    });
  
  // Detailed Feature Analysis
  console.log('\n📋 DETAILED FEATURE BREAKDOWN:');
  console.log('-'.repeat(40));
  features.forEach((data, filePath) => {
    console.log(`\n📁 ${filePath.replace(storeBasePath, '')}`);
    console.log(`   Category: ${data.category || 'UNCATEGORIZED'}`);
    console.log(`   Systems: ${data.systems.join(', ') || 'None'}`);
    console.log(`   Features: ${data.features.slice(0, 5).join(', ')}${data.features.length > 5 ? '...' : ''}`);
    if (data.description) {
      console.log(`   Description: ${data.description.substring(0, 100)}...`);
    }
  });
  
  // Summary Statistics
  console.log('\n📈 SUMMARY STATISTICS:');
  console.log('-'.repeat(40));
  console.log(`Total store pages analyzed: ${features.size}`);
  console.log(`Total duplicate features found: ${duplicates.length}`);
  console.log(`Pages with system integrations: ${Array.from(systemReferences.values()).flat().length}`);
  console.log(`Most integrated system: ${Array.from(systemReferences.entries()).sort((a,b) => b[1].length - a[1].length)[0]?.[0] || 'None'}`);
  
  // Consolidation Recommendations
  console.log('\n💡 CONSOLIDATION RECOMMENDATIONS:');
  console.log('-'.repeat(40));
  const highDuplicates = duplicates.filter(d => d.count >= 3);
  if (highDuplicates.length > 0) {
    console.log('Consider consolidating these highly duplicated features:');
    highDuplicates.forEach(d => {
      console.log(`- "${d.feature}" (${d.count} instances) - Create shared component`);
    });
  } else {
    console.log('No high-priority duplicates found for consolidation.');
  }
}

// Main execution
console.log('Starting comprehensive store features scan...');
scanDirectory(storeBasePath);
findDuplicates();
generateReport();

console.log('\n✅ Analysis complete!');
