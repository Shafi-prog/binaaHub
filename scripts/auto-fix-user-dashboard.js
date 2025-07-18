#!/usr/bin/env node
/**
 * Auto-Fix User Dashboard Integration
 * Automatically fixes common issues and ensures all user pages are properly integrated
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

class DashboardAutoFixer {
  constructor() {
    this.userPagesDir = path.join(process.cwd(), 'src/app/user');
    this.dashboardFile = path.join(this.userPagesDir, 'dashboard/page.tsx');
    this.layoutFile = path.join(this.userPagesDir, 'layout.tsx');
    
    this.fixes = {
      addedToDashboard: [],
      removedOrphaned: [],
      fixedStructure: [],
      addedMetadata: [],
      fixedAccessibility: []
    };
  }

  // Discover all user pages and their info
  async discoverUserPages() {
    console.log(`${colors.blue}📁 Discovering user pages...${colors.reset}`);
    
    const pageFiles = glob.sync('**/page.tsx', { 
      cwd: this.userPagesDir,
      ignore: ['dashboard/page.tsx']
    });

    const userPages = [];
    
    for (const pageFile of pageFiles) {
      const fullPath = path.join(this.userPagesDir, pageFile);
      const routePath = '/user/' + pageFile.replace('/page.tsx', '').replace(/\\/g, '/');
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const pageInfo = {
        routePath,
        filePath: fullPath,
        title: this.extractTitle(content),
        category: this.categorizeePage(routePath),
        icon: this.suggestIcon(routePath),
        description: this.generateDescription(routePath),
        priority: this.assignPriority(routePath)
      };
      
      userPages.push(pageInfo);
    }

    console.log(`${colors.green}✅ Found ${userPages.length} user pages${colors.reset}`);
    return userPages;
  }

  // Extract title from page content
  extractTitle(content) {
    const patterns = [
      /title:\s*['"`]([^'"`]+)['"`]/,
      /<h1[^>]*>([^<]+)<\/h1>/,
      /Typography[^>]*>([^<]+)/,
      /['"`]([^'"`]*(?:صفحة|لوحة|إدارة|مركز|قائمة)[^'"`]*)['"`]/
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Unknown Page';
  }

  // Categorize page based on route
  categorizeePage(routePath) {
    if (routePath.includes('/projects')) return 'projects';
    if (routePath.includes('/social') || routePath.includes('/community')) return 'social';
    if (routePath.includes('/smart') || routePath.includes('/ai') || routePath.includes('/insights')) return 'smart';
    if (routePath.includes('/subscription') || routePath.includes('/balance') || routePath.includes('/wallet')) return 'financial';
    if (routePath.includes('/setting') || routePath.includes('/profile')) return 'account';
    if (routePath.includes('/support') || routePath.includes('/help')) return 'support';
    if (routePath.includes('/store') || routePath.includes('/marketplace')) return 'marketplace';
    if (routePath.includes('/warrant') || routePath.includes('/gamification')) return 'services';
    return 'general';
  }

  // Suggest appropriate icon for route
  suggestIcon(routePath) {
    const iconMap = {
      '/user/projects': 'FolderOpen',
      '/user/profile': 'UserIcon',
      '/user/settings': 'Settings',
      '/user/balance': 'Wallet',
      '/user/subscriptions': 'Crown',
      '/user/warranties': 'Shield',
      '/user/support': 'MessageSquare',
      '/user/help-center': 'MessageSquare',
      '/user/social-community': 'Users',
      '/user/smart-insights': 'Brain',
      '/user/ai-assistant': 'Bot',
      '/user/stores-browse': 'Store',
      '/user/projects-marketplace': 'Building2',
      '/user/gamification': 'Trophy'
    };

    // Check exact matches first
    if (iconMap[routePath]) return iconMap[routePath];

    // Check partial matches
    for (const [route, icon] of Object.entries(iconMap)) {
      if (routePath.startsWith(route)) return icon;
    }

    // Default icons by category
    const categoryIcons = {
      projects: 'FolderOpen',
      social: 'Users',
      smart: 'Brain',
      financial: 'Wallet',
      account: 'Settings',
      support: 'MessageSquare',
      marketplace: 'Store',
      services: 'Shield'
    };

    const category = this.categorizeePage(routePath);
    return categoryIcons[category] || 'FileText';
  }

  // Generate description for route
  generateDescription(routePath) {
    const descriptions = {
      '/user/projects': 'إدارة وتتبع مشاريع البناء',
      '/user/profile': 'معلومات الملف الشخصي',
      '/user/settings': 'إعدادات الحساب والتطبيق',
      '/user/balance': 'إدارة الرصيد والمدفوعات',
      '/user/subscriptions': 'خطط الاشتراك والباقات',
      '/user/warranties': 'إدارة الضمانات والصيانة',
      '/user/support': 'الدعم الفني والمساعدة',
      '/user/social-community': 'مجتمع البناء والتفاعل',
      '/user/smart-insights': 'الرؤى الذكية والتوصيات',
      '/user/ai-assistant': 'المساعد الذكي للبناء',
      '/user/stores-browse': 'تصفح المتاجر والموردين',
      '/user/projects-marketplace': 'سوق المشاريع والعروض'
    };

    if (descriptions[routePath]) return descriptions[routePath];

    // Generate generic description
    const pathParts = routePath.split('/').filter(p => p && p !== 'user');
    const lastPart = pathParts[pathParts.length - 1];
    return `صفحة ${lastPart}`;
  }

  // Assign priority for dashboard placement
  assignPriority(routePath) {
    const priorities = {
      '/user/dashboard': 1,
      '/user/projects': 2,
      '/user/profile': 3,
      '/user/ai-assistant': 4,
      '/user/social-community': 5,
      '/user/smart-insights': 6,
      '/user/balance': 7,
      '/user/subscriptions': 8,
      '/user/warranties': 9,
      '/user/settings': 10
    };

    return priorities[routePath] || 99;
  }

  // Auto-fix dashboard integration
  async autoFixDashboard() {
    console.log(`${colors.blue}🔧 Auto-fixing dashboard integration...${colors.reset}`);
    
    const userPages = await this.discoverUserPages();
    const existingDashboard = await this.readDashboardContent();
    
    // Extract existing links
    const existingLinks = this.extractExistingLinks(existingDashboard);
    
    // Find missing pages
    const missingPages = userPages.filter(page => 
      !existingLinks.some(link => this.isLinkMatching(link, page.routePath))
    );

    if (missingPages.length > 0) {
      console.log(`${colors.yellow}📝 Adding ${missingPages.length} missing pages to dashboard...${colors.reset}`);
      
      // Add to appropriate sections
      await this.addPagesToDashboard(missingPages, existingDashboard);
      this.fixes.addedToDashboard = missingPages.map(p => p.routePath);
    }

    // Remove orphaned links
    await this.removeOrphanedLinks(userPages, existingDashboard);
  }

  // Read dashboard content
  async readDashboardContent() {
    if (!fs.existsSync(this.dashboardFile)) {
      throw new Error('Dashboard file not found');
    }
    
    return fs.readFileSync(this.dashboardFile, 'utf8');
  }

  // Extract existing links from dashboard
  extractExistingLinks(content) {
    const links = [];
    
    // Extract from various sections
    const sections = ['dashboardCards', 'quickActions', 'userPanelLinks'];
    
    sections.forEach(section => {
      const sectionMatch = content.match(new RegExp(`${section}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
      if (sectionMatch) {
        const sectionContent = sectionMatch[1];
        const hrefMatches = sectionContent.match(/href:\s*['"`]([^'"`]+)['"`]/g) || [];
        
        hrefMatches.forEach(match => {
          const href = match.match(/href:\s*['"`]([^'"`]+)['"`]/)[1];
          links.push(href);
        });
      }
    });
    
    return links;
  }

  // Check if link matches page route
  isLinkMatching(link, routePath) {
    return link === routePath || 
           link.startsWith(routePath + '/') || 
           routePath.startsWith(link + '/');
  }

  // Add missing pages to dashboard
  async addPagesToDashboard(missingPages, dashboardContent) {
    let updatedContent = dashboardContent;
    
    // Sort pages by priority
    missingPages.sort((a, b) => a.priority - b.priority);
    
    // Add high priority pages to dashboardCards
    const highPriorityPages = missingPages.filter(p => p.priority <= 10);
    if (highPriorityPages.length > 0) {
      updatedContent = this.addToDashboardCards(updatedContent, highPriorityPages);
    }
    
    // Add all pages to userPanelLinks
    updatedContent = this.addToUserPanelLinks(updatedContent, missingPages);
    
    // Save updated dashboard
    fs.writeFileSync(this.dashboardFile, updatedContent);
    console.log(`${colors.green}✅ Dashboard updated with missing pages${colors.reset}`);
  }

  // Add pages to dashboard cards section
  addToDashboardCards(content, pages) {
    const cardsMatch = content.match(/(const dashboardCards = \[)([\s\S]*?)(\];)/);
    if (!cardsMatch) return content;
    
    const [fullMatch, start, cardsContent, end] = cardsMatch;
    
    // Generate new cards
    const newCards = pages.map(page => `    {
      title: '${page.title}',
      value: 'جديد',
      subtitle: '${page.description}',
      icon: <${page.icon} className="w-6 h-6" />,
      href: '${page.routePath}',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    }`).join(',\n');
    
    const updatedCards = cardsContent + (cardsContent.trim() ? ',' : '') + '\n' + newCards;
    
    return content.replace(fullMatch, start + updatedCards + end);
  }

  // Add pages to user panel links section
  addToUserPanelLinks(content, pages) {
    const panelMatch = content.match(/(const userPanelLinks = \[)([\s\S]*?)(\];)/);
    if (!panelMatch) return content;
    
    const [fullMatch, start, panelContent, end] = panelMatch;
    
    // Find insertion point (before logout)
    const logoutIndex = panelContent.lastIndexOf('action: \'logout\'');
    const insertionPoint = logoutIndex > -1 ? 
      panelContent.lastIndexOf('{', logoutIndex) : 
      panelContent.length;
    
    // Generate new links
    const newLinks = pages.map(page => `    { label: '${page.title}', href: '${page.routePath}', icon: <${page.icon} className="w-5 h-5" /> }`).join(',\n');
    
    const beforeInsertion = panelContent.substring(0, insertionPoint);
    const afterInsertion = panelContent.substring(insertionPoint);
    
    const updatedPanel = beforeInsertion + 
      (beforeInsertion.trim() ? ',\n' : '') + 
      newLinks + 
      (afterInsertion.trim() ? ',\n' : '') + 
      afterInsertion;
    
    return content.replace(fullMatch, start + updatedPanel + end);
  }

  // Remove orphaned links
  async removeOrphanedLinks(userPages, dashboardContent) {
    const validRoutes = userPages.map(p => p.routePath);
    const existingLinks = this.extractExistingLinks(dashboardContent);
    
    const orphanedLinks = existingLinks.filter(link => 
      link.startsWith('/user/') && 
      !validRoutes.some(route => this.isLinkMatching(link, route))
    );
    
    if (orphanedLinks.length > 0) {
      console.log(`${colors.yellow}🗑️ Found ${orphanedLinks.length} orphaned links to remove${colors.reset}`);
      // Note: Auto-removal of orphaned links could be dangerous, so we just report them
      this.fixes.removedOrphaned = orphanedLinks;
    }
  }

  // Auto-fix page structure issues
  async autoFixPageStructure() {
    console.log(`${colors.blue}🏗️ Auto-fixing page structure issues...${colors.reset}`);
    
    const pageFiles = glob.sync('**/page.tsx', { cwd: this.userPagesDir });
    
    for (const pageFile of pageFiles) {
      const fullPath = path.join(this.userPagesDir, pageFile);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let updatedContent = content;
      let hasChanges = false;
      
      // Fix missing "use client" directive
      if (this.needsClientDirective(content) && !content.includes('"use client"')) {
        updatedContent = '"use client"\n\n' + updatedContent;
        hasChanges = true;
      }
      
      // Fix missing React import
      if (updatedContent.includes('tsx') && !updatedContent.includes('import React')) {
        updatedContent = "import React from 'react';\n" + updatedContent;
        hasChanges = true;
      }
      
      // Add RTL direction if missing
      if (!updatedContent.includes('dir=') && this.isArabicContent(updatedContent)) {
        updatedContent = updatedContent.replace(
          /(className="[^"]*")/g,
          '$1 dir="rtl"'
        );
        hasChanges = true;
      }
      
      if (hasChanges) {
        fs.writeFileSync(fullPath, updatedContent);
        this.fixes.fixedStructure.push(pageFile);
      }
    }
    
    if (this.fixes.fixedStructure.length > 0) {
      console.log(`${colors.green}✅ Fixed structure for ${this.fixes.fixedStructure.length} pages${colors.reset}`);
    }
  }

  // Check if page needs client directive
  needsClientDirective(content) {
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

  // Check if content is Arabic
  isArabicContent(content) {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(content);
  }

  // Generate fix report
  generateFixReport() {
    console.log(`\n${colors.bold}${colors.cyan}🛠️ AUTO-FIX REPORT${colors.reset}\n`);
    
    const totalFixes = Object.values(this.fixes).reduce((sum, fixes) => sum + fixes.length, 0);
    
    console.log(`${colors.bold}📊 SUMMARY${colors.reset}`);
    console.log(`Total Fixes Applied: ${colors.green}${totalFixes}${colors.reset}\n`);
    
    if (this.fixes.addedToDashboard.length > 0) {
      console.log(`${colors.bold}➕ ADDED TO DASHBOARD${colors.reset}`);
      this.fixes.addedToDashboard.forEach(route => {
        console.log(`  ${colors.green}✅ ${route}${colors.reset}`);
      });
      console.log('');
    }
    
    if (this.fixes.removedOrphaned.length > 0) {
      console.log(`${colors.bold}🗑️ ORPHANED LINKS FOUND${colors.reset}`);
      this.fixes.removedOrphaned.forEach(link => {
        console.log(`  ${colors.yellow}⚠️  ${link} (manual review needed)${colors.reset}`);
      });
      console.log('');
    }
    
    if (this.fixes.fixedStructure.length > 0) {
      console.log(`${colors.bold}🏗️ STRUCTURE FIXES${colors.reset}`);
      this.fixes.fixedStructure.forEach(file => {
        console.log(`  ${colors.green}✅ ${file}${colors.reset}`);
      });
      console.log('');
    }
    
    // Recommendations for manual fixes
    console.log(`${colors.bold}💡 MANUAL REVIEW NEEDED${colors.reset}`);
    if (this.fixes.removedOrphaned.length > 0) {
      console.log(`  • Review and manually remove orphaned links`);
    }
    console.log(`  • Test navigation flow after changes`);
    console.log(`  • Verify page layouts and styling`);
    console.log(`  • Add missing icons to import statements`);
  }

  // Save fix results
  saveFixResults() {
    const outputFile = path.join(process.cwd(), 'dashboard-auto-fixes.json');
    fs.writeFileSync(outputFile, JSON.stringify(this.fixes, null, 2));
    console.log(`\n${colors.green}💾 Fix results saved to: ${outputFile}${colors.reset}`);
  }

  // Main execution
  async run() {
    console.log(`${colors.bold}${colors.magenta}🚀 Starting Auto-Fix for User Dashboard...${colors.reset}\n`);
    
    try {
      await this.autoFixDashboard();
      await this.autoFixPageStructure();
      this.generateFixReport();
      this.saveFixResults();
      
      console.log(`${colors.bold}${colors.green}✨ Auto-Fix Complete!${colors.reset}\n`);
    } catch (error) {
      console.error(`${colors.red}❌ Auto-fix error: ${error.message}${colors.reset}`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const autoFixer = new DashboardAutoFixer();
  autoFixer.run().catch(console.error);
}

module.exports = DashboardAutoFixer;
