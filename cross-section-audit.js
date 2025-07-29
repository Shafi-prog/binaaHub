const fs = require('fs');
const path = require('path');

console.log('🔗 COMPREHENSIVE CROSS-SECTION NAVIGATION AUDIT');
console.log('================================================');

// Define the main sections to analyze
const sections = ['user', 'store', 'service-provider', 'admin'];
const srcPath = './src/app';

// Storage for navigation links and cross-references
const navigationMap = new Map();
const crossSectionLinks = new Map();
const missingConnections = [];

// Function to recursively scan files
function scanDirectory(dirPath, section = '') {
  if (!fs.existsSync(dirPath)) return;
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Determine section if we're at the app level
      const currentSection = section || (sections.includes(item) ? item : '');
      scanDirectory(fullPath, currentSection);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      analyzeFile(fullPath, section);
    }
  }
}

// Function to analyze individual files for navigation patterns
function analyzeFile(filePath, section) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative('./src/app', filePath);
    
    // Extract navigation links
    const linkPatterns = [
      /href=["']([^"']+)["']/g,
      /Link.*to=["']([^"']+)["']/g,
      /push\(['"]([^'"]+)['"]\)/g,
      /replace\(['"]([^'"]+)['"]\)/g,
      /router\.push\(['"]([^'"]+)['"]\)/g,
    ];
    
    const foundLinks = new Set();
    
    linkPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const link = match[1];
        if (link.startsWith('/') && !link.startsWith('//')) {
          foundLinks.add(link);
        }
      }
    });
    
    if (foundLinks.size > 0) {
      navigationMap.set(relativePath, {
        section,
        links: Array.from(foundLinks),
        hasLinks: true
      });
      
      // Check for cross-section navigation
      foundLinks.forEach(link => {
        const linkSection = getSectionFromPath(link);
        if (linkSection && linkSection !== section) {
          if (!crossSectionLinks.has(section)) {
            crossSectionLinks.set(section, new Map());
          }
          if (!crossSectionLinks.get(section).has(linkSection)) {
            crossSectionLinks.get(section).set(linkSection, []);
          }
          crossSectionLinks.get(section).get(linkSection).push({
            from: relativePath,
            to: link
          });
        }
      });
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
}

// Function to determine section from path
function getSectionFromPath(path) {
  const pathParts = path.split('/').filter(p => p);
  if (pathParts.length > 0) {
    const firstPart = pathParts[0];
    if (sections.includes(firstPart)) {
      return firstPart;
    }
  }
  return null;
}

// Function to check if pages exist
function checkPageExists(routePath) {
  // Convert route path to file path
  const cleanPath = routePath.replace(/\?.*$/, ''); // Remove query parameters
  const pathParts = cleanPath.split('/').filter(p => p);
  
  if (pathParts.length === 0) return false;
  
  // Try different file patterns
  const possiblePaths = [
    path.join(srcPath, ...pathParts, 'page.tsx'),
    path.join(srcPath, ...pathParts, 'page.ts'),
    path.join(srcPath, ...pathParts, 'index.tsx'),
    path.join(srcPath, ...pathParts.slice(0, -1), `[${pathParts[pathParts.length - 1]}]`, 'page.tsx'),
  ];
  
  return possiblePaths.some(p => fs.existsSync(p));
}

// Main analysis function
function analyzeNavigation() {
  console.log('🔍 Scanning all sections for navigation patterns...\n');
  
  // Scan all sections
  sections.forEach(section => {
    const sectionPath = path.join(srcPath, section);
    if (fs.existsSync(sectionPath)) {
      console.log(`📂 Scanning ${section} section...`);
      scanDirectory(sectionPath, section);
    } else {
      console.log(`❌ Section ${section} not found`);
    }
  });
  
  console.log('\n📊 CROSS-SECTION NAVIGATION ANALYSIS:');
  console.log('=====================================\n');
  
  // Display cross-section connections
  sections.forEach(fromSection => {
    if (crossSectionLinks.has(fromSection)) {
      console.log(`🔗 FROM ${fromSection.toUpperCase()}:`);
      
      crossSectionLinks.get(fromSection).forEach((links, toSection) => {
        console.log(`   ➡️  to ${toSection}: ${links.length} connection(s)`);
        links.forEach(link => {
          const exists = checkPageExists(link.to);
          console.log(`      ${exists ? '✅' : '❌'} ${link.from} → ${link.to}`);
          if (!exists) {
            missingConnections.push({
              from: link.from,
              to: link.to,
              fromSection,
              toSection
            });
          }
        });
      });
      console.log('');
    } else {
      console.log(`🔗 FROM ${fromSection.toUpperCase()}: No cross-section links found\n`);
    }
  });
}

// Function to check common navigation patterns
function checkNavigationFlow() {
  console.log('🌊 NAVIGATION FLOW ANALYSIS:');
  console.log('============================\n');
  
  const expectedConnections = [
    { from: 'user', to: 'store', description: 'User to Store navigation' },
    { from: 'user', to: 'service-provider', description: 'User to Service Provider navigation' },
    { from: 'store', to: 'user', description: 'Store to User navigation' },
    { from: 'service-provider', to: 'user', description: 'Service Provider to User navigation' },
    { from: 'admin', to: 'store', description: 'Admin to Store navigation' },
    { from: 'admin', to: 'user', description: 'Admin to User navigation' },
    { from: 'admin', to: 'service-provider', description: 'Admin to Service Provider navigation' },
  ];
  
  expectedConnections.forEach(connection => {
    const hasConnection = crossSectionLinks.has(connection.from) && 
                         crossSectionLinks.get(connection.from).has(connection.to);
    
    console.log(`${hasConnection ? '✅' : '❌'} ${connection.description}`);
    
    if (hasConnection) {
      const links = crossSectionLinks.get(connection.from).get(connection.to);
      console.log(`   Found ${links.length} link(s)`);
    } else {
      console.log(`   No connections found`);
    }
  });
}

// Function to suggest missing connections
function suggestMissingConnections() {
  console.log('\n🔧 MISSING CONNECTION SUGGESTIONS:');
  console.log('==================================\n');
  
  const suggestions = [
    {
      from: 'user/dashboard',
      to: '/store',
      description: 'User dashboard should link to store management'
    },
    {
      from: 'user/dashboard', 
      to: '/service-provider',
      description: 'User dashboard should link to service provider features'
    },
    {
      from: 'store/layout',
      to: '/user',
      description: 'Store should have user management links'
    },
    {
      from: 'service-provider/layout',
      to: '/user',
      description: 'Service provider should link back to user area'
    },
    {
      from: 'admin/dashboard',
      to: '/store',
      description: 'Admin should have store management access'
    },
    {
      from: 'admin/dashboard',
      to: '/user',
      description: 'Admin should have user management access'
    }
  ];
  
  suggestions.forEach(suggestion => {
    console.log(`💡 ${suggestion.description}`);
    console.log(`   Add link from ${suggestion.from} to ${suggestion.to}\n`);
  });
}

// Function to display summary
function displaySummary() {
  console.log('📋 SUMMARY:');
  console.log('===========\n');
  
  const totalFiles = navigationMap.size;
  const totalCrossSectionLinks = Array.from(crossSectionLinks.values())
    .reduce((total, sectionMap) => 
      total + Array.from(sectionMap.values()).reduce((sum, links) => sum + links.length, 0), 0);
  
  console.log(`📄 Total files analyzed: ${totalFiles}`);
  console.log(`🔗 Total cross-section links: ${totalCrossSectionLinks}`);
  console.log(`❌ Missing connections: ${missingConnections.length}`);
  
  if (missingConnections.length > 0) {
    console.log('\n🚨 BROKEN CROSS-SECTION LINKS:');
    missingConnections.forEach(connection => {
      console.log(`   ❌ ${connection.from} → ${connection.to}`);
    });
  }
  
  console.log('\n✅ Audit complete!');
}

// Run the analysis
analyzeNavigation();
checkNavigationFlow();
suggestMissingConnections();
displaySummary();
