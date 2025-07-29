const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const appDir = path.join(srcDir, 'app');

// Define the main sections
const sections = ['user', 'store', 'service-provider', 'admin'];
const pageFiles = [];

// Function to find all page.tsx files
function findPageFiles(dir, currentPath = '') {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(currentPath, item);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!item.startsWith('.') && item !== 'node_modules') {
        findPageFiles(fullPath, relativePath);
      }
    } else if (item === 'page.tsx') {
      pageFiles.push({
        fullPath,
        relativePath: relativePath.replace(/\\/g, '/'),
        section: relativePath.split(path.sep)[0]
      });
    }
  }
}

// Function to analyze file content for cross-section links
function analyzeFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const crossSectionLinks = [];
    
    // Look for navigation imports
    const hasQuickAccessLinks = content.includes('QuickAccessLinks');
    const hasCrossSectionNav = content.includes('CrossSectionNavigation');
    
    // Look for direct cross-section hrefs
    for (const section of sections) {
      const hrefPattern = new RegExp(`href=[\"']/${section}`, 'g');
      const routerPattern = new RegExp(`router\\.push\\([\"']/${section}`, 'g');
      const linkPattern = new RegExp(`Link.*to=[\"']/${section}`, 'g');
      
      const hrefMatches = content.match(hrefPattern) || [];
      const routerMatches = content.match(routerPattern) || [];
      const linkMatches = content.match(linkPattern) || [];
      
      const totalMatches = hrefMatches.length + routerMatches.length + linkMatches.length;
      
      if (totalMatches > 0) {
        crossSectionLinks.push({
          targetSection: section,
          count: totalMatches,
          types: {
            href: hrefMatches.length,
            router: routerMatches.length,
            link: linkMatches.length
          }
        });
      }
    }
    
    return {
      hasQuickAccessLinks,
      hasCrossSectionNav,
      crossSectionLinks,
      fileSize: content.length
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to generate detailed report
function generateDetailedReport() {
  console.log('🔍 COMPREHENSIVE CROSS-SECTION NAVIGATION AUDIT');
  console.log('=' .repeat(60));
  console.log();
  
  findPageFiles(appDir);
  
  console.log(`📊 SUMMARY`);
  console.log(`📄 Total page files found: ${pageFiles.length}`);
  console.log();
  
  let totalCrossSectionLinks = 0;
  let pagesWithQuickAccess = 0;
  let pagesWithCrossSectionNav = 0;
  const sectionSummary = {};
  
  // Initialize section summary
  sections.forEach(section => {
    sectionSummary[section] = {
      totalPages: 0,
      pagesWithCrossLinks: 0,
      pagesWithQuickAccess: 0,
      pagesWithCrossSectionNav: 0,
      outgoingLinks: {},
      incomingLinks: {}
    };
    
    sections.forEach(targetSection => {
      sectionSummary[section].outgoingLinks[targetSection] = 0;
      sectionSummary[section].incomingLinks[targetSection] = 0;
    });
  });
  
  console.log(`🔗 DETAILED PAGE ANALYSIS`);
  console.log('-'.repeat(60));
  
  for (const pageFile of pageFiles) {
    const analysis = analyzeFileContent(pageFile.fullPath);
    
    if (!analysis) continue;
    
    const currentSection = pageFile.section;
    if (sections.includes(currentSection)) {
      sectionSummary[currentSection].totalPages++;
      
      if (analysis.hasQuickAccessLinks) {
        sectionSummary[currentSection].pagesWithQuickAccess++;
        pagesWithQuickAccess++;
      }
      
      if (analysis.hasCrossSectionNav) {
        sectionSummary[currentSection].pagesWithCrossSectionNav++;
        pagesWithCrossSectionNav++;
      }
      
      if (analysis.crossSectionLinks.length > 0) {
        sectionSummary[currentSection].pagesWithCrossLinks++;
      }
    }
    
    console.log(`📄 ${pageFile.relativePath}`);
    console.log(`   📏 Size: ${analysis.fileSize} chars`);
    console.log(`   🔗 QuickAccessLinks: ${analysis.hasQuickAccessLinks ? '✅' : '❌'}`);
    console.log(`   🧭 CrossSectionNavigation: ${analysis.hasCrossSectionNav ? '✅' : '❌'}`);
    
    if (analysis.crossSectionLinks.length > 0) {
      console.log(`   🎯 Cross-section links found:`);
      for (const link of analysis.crossSectionLinks) {
        console.log(`      → ${link.targetSection}: ${link.count} links`);
        totalCrossSectionLinks += link.count;
        
        // Track outgoing links
        if (sections.includes(currentSection)) {
          sectionSummary[currentSection].outgoingLinks[link.targetSection] += link.count;
          sectionSummary[link.targetSection].incomingLinks[currentSection] += link.count;
        }
      }
    } else {
      console.log(`   🎯 Cross-section links: None found`);
    }
    console.log();
  }
  
  console.log(`📊 SECTION SUMMARY`);
  console.log('=' .repeat(60));
  
  for (const section of sections) {
    const summary = sectionSummary[section];
    console.log(`🏷️  ${section.toUpperCase()} SECTION`);
    console.log(`   📄 Total pages: ${summary.totalPages}`);
    console.log(`   🔗 Pages with QuickAccessLinks: ${summary.pagesWithQuickAccess}/${summary.totalPages}`);
    console.log(`   🧭 Pages with CrossSectionNavigation: ${summary.pagesWithCrossSectionNav}/${summary.totalPages}`);
    console.log(`   🎯 Pages with cross-links: ${summary.pagesWithCrossLinks}/${summary.totalPages}`);
    
    console.log(`   📤 Outgoing links:`);
    for (const targetSection of sections) {
      if (targetSection !== section && summary.outgoingLinks[targetSection] > 0) {
        console.log(`      → ${targetSection}: ${summary.outgoingLinks[targetSection]} links`);
      }
    }
    
    console.log(`   📥 Incoming links:`);
    for (const sourceSection of sections) {
      if (sourceSection !== section && summary.incomingLinks[sourceSection] > 0) {
        console.log(`      ← ${sourceSection}: ${summary.incomingLinks[sourceSection]} links`);
      }
    }
    console.log();
  }
  
  console.log(`🎯 CONNECTIVITY ANALYSIS`);
  console.log('=' .repeat(60));
  
  // Check for missing connections
  console.log(`📋 Cross-section connectivity matrix:`);
  console.log(`${''.padEnd(15)} ${sections.map(s => s.substring(0,8).padEnd(8)).join(' ')}`);
  
  for (const fromSection of sections) {
    let row = `${fromSection.padEnd(15)}`;
    for (const toSection of sections) {
      if (fromSection === toSection) {
        row += ' ------- ';
      } else {
        const count = sectionSummary[fromSection].outgoingLinks[toSection];
        row += ` ${count.toString().padStart(7)} `;
      }
    }
    console.log(row);
  }
  
  console.log();
  console.log(`🔍 MISSING CONNECTIONS`);
  console.log('-'.repeat(30));
  
  let missingConnections = 0;
  for (const fromSection of sections) {
    for (const toSection of sections) {
      if (fromSection !== toSection) {
        const hasConnection = sectionSummary[fromSection].outgoingLinks[toSection] > 0;
        if (!hasConnection) {
          console.log(`❌ ${fromSection} → ${toSection}: No direct links found`);
          missingConnections++;
        }
      }
    }
  }
  
  if (missingConnections === 0) {
    console.log(`✅ All sections are connected!`);
  }
  
  console.log();
  console.log(`📈 OVERALL STATISTICS`);
  console.log('=' .repeat(60));
  console.log(`📄 Total pages analyzed: ${pageFiles.length}`);
  console.log(`🔗 Pages with QuickAccessLinks: ${pagesWithQuickAccess}`);
  console.log(`🧭 Pages with CrossSectionNavigation: ${pagesWithCrossSectionNav}`);
  console.log(`🎯 Total cross-section links: ${totalCrossSectionLinks}`);
  console.log(`❌ Missing connections: ${missingConnections}/${sections.length * (sections.length - 1)}`);
  
  const connectivityPercentage = ((sections.length * (sections.length - 1) - missingConnections) / (sections.length * (sections.length - 1)) * 100).toFixed(1);
  console.log(`📊 Cross-section connectivity: ${connectivityPercentage}%`);
  
  if (connectivityPercentage > 80) {
    console.log(`🎉 EXCELLENT connectivity!`);
  } else if (connectivityPercentage > 60) {
    console.log(`👍 GOOD connectivity, some improvements needed.`);
  } else if (connectivityPercentage > 30) {
    console.log(`⚠️  MODERATE connectivity, significant improvements needed.`);
  } else {
    console.log(`🚨 POOR connectivity, major navigation improvements required.`);
  }
}

// Run the audit
generateDetailedReport();
