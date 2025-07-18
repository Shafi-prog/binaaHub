#!/usr/bin/env node
/**
 * User Dashboard Navigation Validator
 * Validates and ensures all user pages are properly accessible from the dashboard
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class DashboardValidator {
  constructor() {
    this.userPagesDir = path.join(process.cwd(), 'src/app/user');
    this.dashboardFile = path.join(this.userPagesDir, 'dashboard/page.tsx');
    this.layoutFile = path.join(this.userPagesDir, 'layout.tsx');
    
    this.validationResults = {
      pageStructure: [],
      navigationConsistency: [],
      accessibilityIssues: [],
      routingProblems: [],
      missingComponents: [],
      recommendations: []
    };
  }

  // Validate page structure and routing
  async validatePageStructure() {
    console.log(`${colors.blue}🏗️ Validating page structure...${colors.reset}`);
    
    try {
      const pageFiles = glob.sync('**/page.tsx', { cwd: this.userPagesDir });
      
      for (const pageFile of pageFiles) {
        const fullPath = path.join(this.userPagesDir, pageFile);
        const routePath = '/user/' + pageFile.replace('/page.tsx', '').replace(/\\/g, '/');
        
        const validation = await this.validateSinglePage(fullPath, routePath);
        this.validationResults.pageStructure.push(validation);
      }
      
      console.log(`${colors.green}✅ Validated ${pageFiles.length} pages${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Structure validation error: ${error.message}${colors.reset}`);
    }
  }

  // Validate a single page
  async validateSinglePage(filePath, routePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    const validation = {
      routePath,
      fileName,
      issues: [],
      warnings: [],
      suggestions: []
    };

    // Check for required patterns
    if (!content.includes('export default')) {
      validation.issues.push('Missing default export');
    }

    if (!content.includes('"use client"') && this.requiresClientComponent(content)) {
      validation.warnings.push('Might need "use client" directive');
    }

    // Check for TypeScript issues
    if (!content.includes('React') && content.includes('tsx')) {
      validation.warnings.push('Missing React import in TSX file');
    }

    // Check for proper page structure
    if (!this.hasProperPageStructure(content)) {
      validation.warnings.push('Page structure could be improved');
    }

    // Check for accessibility
    if (!this.hasAccessibilityFeatures(content)) {
      validation.suggestions.push('Consider adding accessibility features');
    }

    // Check for SEO metadata
    if (!this.hasMetadata(content)) {
      validation.suggestions.push('Add metadata for SEO optimization');
    }

    return validation;
  }

  // Check if page requires client component
  requiresClientComponent(content) {
    const clientPatterns = [
      'useState',
      'useEffect',
      'onClick',
      'onChange',
      'onSubmit',
      'useRouter',
      'usePathname'
    ];
    
    return clientPatterns.some(pattern => content.includes(pattern));
  }

  // Check for proper page structure
  hasProperPageStructure(content) {
    const structurePatterns = [
      /<main|<div.*className.*container|<section/,
      /Typography|<h1|<h2/,
      /return.*\(/
    ];
    
    return structurePatterns.every(pattern => pattern.test(content));
  }

  // Check for accessibility features
  hasAccessibilityFeatures(content) {
    const a11yPatterns = [
      /aria-/,
      /role=/,
      /alt=/,
      /dir=['"]rtl['"]|dir=['"]ltr['"]/
    ];
    
    return a11yPatterns.some(pattern => pattern.test(content));
  }

  // Check for metadata
  hasMetadata(content) {
    return /export\s+(const\s+)?metadata/.test(content) || 
           /generateMetadata/.test(content);
  }

  // Validate navigation consistency
  async validateNavigationConsistency() {
    console.log(`${colors.blue}🧭 Validating navigation consistency...${colors.reset}`);
    
    try {
      // Check dashboard navigation
      const dashboardNav = await this.extractDashboardNavigation();
      
      // Check layout navigation  
      const layoutNav = await this.extractLayoutNavigation();
      
      // Compare and find inconsistencies
      const inconsistencies = this.findNavigationInconsistencies(dashboardNav, layoutNav);
      
      this.validationResults.navigationConsistency = inconsistencies;
      
      console.log(`${colors.green}✅ Navigation consistency checked${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Navigation validation error: ${error.message}${colors.reset}`);
    }
  }

  // Extract dashboard navigation structure
  async extractDashboardNavigation() {
    if (!fs.existsSync(this.dashboardFile)) return { links: [], structure: [] };
    
    const content = fs.readFileSync(this.dashboardFile, 'utf8');
    
    return {
      dashboardCards: this.extractNavigationSection(content, 'dashboardCards'),
      quickActions: this.extractNavigationSection(content, 'quickActions'),
      userPanelLinks: this.extractNavigationSection(content, 'userPanelLinks')
    };
  }

  // Extract layout navigation structure
  async extractLayoutNavigation() {
    if (!fs.existsSync(this.layoutFile)) return { links: [] };
    
    const content = fs.readFileSync(this.layoutFile, 'utf8');
    
    // Extract navigation items
    const hrefMatches = content.match(/href=['"`]([^'"`]+)['"`]/g) || [];
    const links = hrefMatches.map(match => {
      return match.match(/href=['"`]([^'"`]+)['"`]/)[1];
    }).filter(href => href.startsWith('/user/'));
    
    return { links };
  }

  // Extract navigation section from content
  extractNavigationSection(content, sectionName) {
    const sectionMatch = content.match(new RegExp(`${sectionName}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
    if (!sectionMatch) return [];
    
    const sectionContent = sectionMatch[1];
    
    // Extract items with href and title
    const items = [];
    const itemMatches = sectionContent.match(/\{[\s\S]*?\}/g) || [];
    
    itemMatches.forEach(itemMatch => {
      const hrefMatch = itemMatch.match(/href:\s*['"`]([^'"`]+)['"`]/);
      const titleMatch = itemMatch.match(/(?:title|label):\s*['"`]([^'"`]+)['"`]/);
      
      if (hrefMatch) {
        items.push({
          href: hrefMatch[1],
          title: titleMatch ? titleMatch[1] : 'Unknown',
          raw: itemMatch
        });
      }
    });
    
    return items;
  }

  // Find navigation inconsistencies
  findNavigationInconsistencies(dashboardNav, layoutNav) {
    const inconsistencies = [];
    
    // Check for duplicate links
    const allDashboardLinks = [
      ...dashboardNav.dashboardCards || [],
      ...dashboardNav.quickActions || [],
      ...dashboardNav.userPanelLinks || []
    ];
    
    const linkCounts = {};
    allDashboardLinks.forEach(item => {
      linkCounts[item.href] = (linkCounts[item.href] || 0) + 1;
    });
    
    Object.keys(linkCounts).forEach(href => {
      if (linkCounts[href] > 1) {
        inconsistencies.push({
          type: 'duplicate_link',
          href,
          count: linkCounts[href],
          message: `Link "${href}" appears ${linkCounts[href]} times in dashboard`
        });
      }
    });
    
    // Check for missing essential links
    const essentialPages = [
      '/user/dashboard',
      '/user/projects',
      '/user/profile',
      '/user/settings'
    ];
    
    essentialPages.forEach(page => {
      const foundInDashboard = allDashboardLinks.some(item => item.href === page);
      const foundInLayout = layoutNav.links.includes(page);
      
      if (!foundInDashboard && !foundInLayout) {
        inconsistencies.push({
          type: 'missing_essential',
          href: page,
          message: `Essential page "${page}" not found in navigation`
        });
      }
    });
    
    return inconsistencies;
  }

  // Validate accessibility compliance
  async validateAccessibility() {
    console.log(`${colors.blue}♿ Validating accessibility compliance...${colors.reset}`);
    
    try {
      const pageFiles = glob.sync('**/page.tsx', { cwd: this.userPagesDir });
      
      for (const pageFile of pageFiles) {
        const fullPath = path.join(this.userPagesDir, pageFile);
        const content = fs.readFileSync(fullPath, 'utf8');
        const routePath = '/user/' + pageFile.replace('/page.tsx', '').replace(/\\/g, '/');
        
        const a11yIssues = this.checkAccessibilityIssues(content, routePath);
        if (a11yIssues.length > 0) {
          this.validationResults.accessibilityIssues.push({
            routePath,
            issues: a11yIssues
          });
        }
      }
      
      console.log(`${colors.green}✅ Accessibility validation completed${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Accessibility validation error: ${error.message}${colors.reset}`);
    }
  }

  // Check accessibility issues in content
  checkAccessibilityIssues(content, routePath) {
    const issues = [];
    
    // Check for missing dir attribute
    if (!content.includes('dir=')) {
      issues.push('Missing text direction (dir) attribute for RTL support');
    }
    
    // Check for images without alt text
    if (/<img(?![^>]*alt=)/.test(content)) {
      issues.push('Images without alt text found');
    }
    
    // Check for buttons without accessible labels
    if (/<button(?![^>]*aria-label)(?![^>]*aria-labelledby)/.test(content)) {
      issues.push('Buttons without accessible labels found');
    }
    
    // Check for proper heading hierarchy
    const headings = content.match(/<h[1-6]/g) || [];
    if (headings.length === 0) {
      issues.push('No heading structure found');
    }
    
    // Check for focus management
    if (!content.includes('focus') && content.includes('onClick')) {
      issues.push('Interactive elements might need focus management');
    }
    
    return issues;
  }

  // Generate comprehensive validation report
  generateValidationReport() {
    console.log(`\n${colors.bold}${colors.cyan}🎯 USER DASHBOARD VALIDATION REPORT${colors.reset}\n`);
    
    // Page Structure Issues
    if (this.validationResults.pageStructure.length > 0) {
      console.log(`${colors.bold}🏗️ PAGE STRUCTURE VALIDATION${colors.reset}`);
      
      this.validationResults.pageStructure.forEach(page => {
        if (page.issues.length > 0 || page.warnings.length > 0) {
          console.log(`\n${colors.yellow}📄 ${page.routePath}${colors.reset}`);
          
          page.issues.forEach(issue => {
            console.log(`  ${colors.red}❌ ${issue}${colors.reset}`);
          });
          
          page.warnings.forEach(warning => {
            console.log(`  ${colors.yellow}⚠️  ${warning}${colors.reset}`);
          });
          
          page.suggestions.forEach(suggestion => {
            console.log(`  ${colors.cyan}💡 ${suggestion}${colors.reset}`);
          });
        }
      });
    }
    
    // Navigation Consistency
    if (this.validationResults.navigationConsistency.length > 0) {
      console.log(`\n${colors.bold}🧭 NAVIGATION CONSISTENCY ISSUES${colors.reset}`);
      
      this.validationResults.navigationConsistency.forEach(issue => {
        console.log(`${colors.red}❌ ${issue.message}${colors.reset}`);
      });
    }
    
    // Accessibility Issues
    if (this.validationResults.accessibilityIssues.length > 0) {
      console.log(`\n${colors.bold}♿ ACCESSIBILITY ISSUES${colors.reset}`);
      
      this.validationResults.accessibilityIssues.forEach(page => {
        console.log(`\n${colors.yellow}📄 ${page.routePath}${colors.reset}`);
        page.issues.forEach(issue => {
          console.log(`  ${colors.red}❌ ${issue}${colors.reset}`);
        });
      });
    }
    
    // Overall Summary
    const totalIssues = this.validationResults.pageStructure.reduce((sum, page) => 
      sum + page.issues.length, 0);
    const totalWarnings = this.validationResults.pageStructure.reduce((sum, page) => 
      sum + page.warnings.length, 0);
    const totalA11yIssues = this.validationResults.accessibilityIssues.reduce((sum, page) => 
      sum + page.issues.length, 0);
    
    console.log(`\n${colors.bold}📊 VALIDATION SUMMARY${colors.reset}`);
    console.log(`Total Issues: ${colors.red}${totalIssues}${colors.reset}`);
    console.log(`Total Warnings: ${colors.yellow}${totalWarnings}${colors.reset}`);
    console.log(`Navigation Issues: ${colors.red}${this.validationResults.navigationConsistency.length}${colors.reset}`);
    console.log(`Accessibility Issues: ${colors.red}${totalA11yIssues}${colors.reset}`);
    
    // Generate recommendations
    this.generateValidationRecommendations();
  }

  // Generate validation recommendations
  generateValidationRecommendations() {
    console.log(`\n${colors.bold}💡 VALIDATION RECOMMENDATIONS${colors.reset}`);
    
    console.log(`${colors.cyan}1. Page Structure:${colors.reset}`);
    console.log(`   • Ensure all pages have default exports`);
    console.log(`   • Add "use client" directive for interactive components`);
    console.log(`   • Include proper page structure with main containers`);
    
    console.log(`${colors.cyan}2. Navigation:${colors.reset}`);
    console.log(`   • Remove duplicate navigation links`);
    console.log(`   • Ensure essential pages are accessible`);
    console.log(`   • Maintain consistent navigation structure`);
    
    console.log(`${colors.cyan}3. Accessibility:${colors.reset}`);
    console.log(`   • Add dir="rtl" for Arabic content`);
    console.log(`   • Include alt text for all images`);
    console.log(`   • Add aria-labels for interactive elements`);
    console.log(`   • Implement proper heading hierarchy`);
    
    console.log(`${colors.cyan}4. SEO Optimization:${colors.reset}`);
    console.log(`   • Add metadata to all pages`);
    console.log(`   • Include proper titles and descriptions`);
    console.log(`   • Use semantic HTML structure`);
  }

  // Save validation results
  saveValidationResults() {
    const outputFile = path.join(process.cwd(), 'user-dashboard-validation.json');
    fs.writeFileSync(outputFile, JSON.stringify(this.validationResults, null, 2));
    console.log(`\n${colors.green}💾 Validation results saved to: ${outputFile}${colors.reset}`);
  }

  // Main execution
  async run() {
    console.log(`${colors.bold}${colors.magenta}🚀 Starting User Dashboard Validation...${colors.reset}\n`);
    
    await this.validatePageStructure();
    await this.validateNavigationConsistency();
    await this.validateAccessibility();
    this.generateValidationReport();
    this.saveValidationResults();
    
    console.log(`${colors.bold}${colors.green}✨ Validation Complete!${colors.reset}\n`);
  }
}

// Run if called directly
if (require.main === module) {
  const validator = new DashboardValidator();
  validator.run().catch(console.error);
}

module.exports = DashboardValidator;
