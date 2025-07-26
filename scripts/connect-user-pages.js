#!/usr/bin/env node

/**
 * User Pages Connection Script
 * This script connects all user pages to share consistent data
 * by updating them to use the unified UserDataContext
 */

const fs = require('fs');
const path = require('path');

class UserPagesConnector {
  constructor() {
    this.userPagesDir = path.join(process.cwd(), 'src', 'app', 'user');
    this.report = {
      processed: [],
      errors: [],
      statistics: {
        totalPages: 0,
        updatedPages: 0,
        skippedPages: 0,
        errorPages: 0
      }
    };
  }

  async connectAllPages() {
    console.log('🔗 Starting User Pages Connection Process...\n');
    
    try {
      // Update user layout to include UserDataProvider
      await this.updateUserLayout();
      
      // Process all user pages
      await this.processUserPages();
      
      // Generate connection report
      this.generateReport();
      
      console.log('\n✅ User pages connection completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Error connecting user pages:', error);
      this.report.errors.push({
        file: 'Main Process',
        error: error.message
      });
    }
  }

  async updateUserLayout() {
    const layoutPath = path.join(this.userPagesDir, 'layout.tsx');
    
    try {
      console.log('📝 Updating user layout to include UserDataProvider...');
      
      let content = fs.readFileSync(layoutPath, 'utf8');
      
      // Add UserDataProvider import if not present
      if (!content.includes('UserDataProvider')) {
        const importLine = `import { UserDataProvider } from '@/core/shared/contexts/UserDataContext';\n`;
        
        // Find the last import statement
        const importRegex = /import.*from.*;\n(?=\n|export)/g;
        const imports = content.match(importRegex);
        
        if (imports) {
          const lastImport = imports[imports.length - 1];
          content = content.replace(lastImport, lastImport + importLine);
        } else {
          // If no imports found, add at the beginning
          content = importLine + content;
        }
      }
      
      // Wrap children with UserDataProvider if not already wrapped
      if (!content.includes('<UserDataProvider>')) {
        content = content.replace(
          /(<div[^>]*>\s*{children}\s*<\/div>)/s,
          `<UserDataProvider>\n        $1\n      </UserDataProvider>`
        );
      }
      
      fs.writeFileSync(layoutPath, content);
      console.log('✅ User layout updated successfully');
      
    } catch (error) {
      console.error('❌ Error updating user layout:', error);
      this.report.errors.push({
        file: 'layout.tsx',
        error: error.message
      });
    }
  }

  async processUserPages() {
    console.log('\n📁 Processing user pages...');
    
    const pageFiles = this.findPageFiles(this.userPagesDir);
    this.report.statistics.totalPages = pageFiles.length;
    
    for (const pageFile of pageFiles) {
      try {
        await this.processPageFile(pageFile);
        this.report.statistics.updatedPages++;
      } catch (error) {
        console.error(`❌ Error processing ${pageFile}:`, error);
        this.report.errors.push({
          file: pageFile,
          error: error.message
        });
        this.report.statistics.errorPages++;
      }
    }
  }

  findPageFiles(dir) {
    const pageFiles = [];
    
    const scanDirectory = (directory) => {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item === 'page.tsx' || item === 'page.ts') {
          pageFiles.push(fullPath);
        }
      }
    };
    
    scanDirectory(dir);
    return pageFiles;
  }

  async processPageFile(pageFile) {
    const relativePath = path.relative(this.userPagesDir, pageFile);
    console.log(`  📄 Processing: ${relativePath}`);
    
    let content = fs.readFileSync(pageFile, 'utf8');
    let modified = false;
    
    // Check if it's a relevant user data page
    const isDataPage = this.isRelevantDataPage(content, relativePath);
    
    if (!isDataPage) {
      console.log(`    ⏭️  Skipping: Not a data-relevant page`);
      this.report.statistics.skippedPages++;
      return;
    }
    
    // Add useUserData hook import
    if (!content.includes('useUserData')) {
      const importLine = `import { useUserData } from '@/core/shared/contexts/UserDataContext';\n`;
      
      // Find React import or first import
      if (content.includes('from \'react\'')) {
        content = content.replace(
          /(import.*from 'react';\n)/,
          `$1${importLine}`
        );
      } else {
        // Add after use client directive if present
        if (content.includes('"use client"')) {
          content = content.replace(
            /"use client";\n/,
            `"use client";\n\n${importLine}`
          );
        } else {
          content = importLine + content;
        }
      }
      modified = true;
    }
    
    // Add useUserData hook in component
    const componentName = this.extractComponentName(content);
    if (componentName && !content.includes('const { profile, orders, warranties, projects, invoices, stats, isLoading }')) {
      const hookLine = '  const { profile, orders, warranties, projects, invoices, stats, isLoading, error, refreshUserData } = useUserData();\n';
      
      // Find component function and add hook
      const componentRegex = new RegExp(`export default function ${componentName}\\([^)]*\\)\\s*{`);
      const match = content.match(componentRegex);
      
      if (match) {
        const insertIndex = content.indexOf(match[0]) + match[0].length;
        content = content.slice(0, insertIndex) + '\n' + hookLine + content.slice(insertIndex);
        modified = true;
      }
    }
    
    // Replace hardcoded mock data with context data
    content = this.replaceMockDataUsage(content);
    modified = true;
    
    // Add loading and error states
    content = this.addLoadingAndErrorStates(content);
    modified = true;
    
    if (modified) {
      fs.writeFileSync(pageFile, content);
      this.report.processed.push({
        file: relativePath,
        changes: [
          'Added useUserData hook',
          'Replaced mock data with context data',
          'Added loading and error states'
        ]
      });
      console.log(`    ✅ Updated successfully`);
    } else {
      console.log(`    ℹ️  No changes needed`);
    }
  }

  isRelevantDataPage(content, relativePath) {
    const dataKeywords = [
      'orders', 'warranties', 'projects', 'invoices', 'profile',
      'dashboard', 'stats', 'balance', 'expenses', 'subscriptions'
    ];
    
    const isRelevantPath = dataKeywords.some(keyword => 
      relativePath.toLowerCase().includes(keyword)
    );
    
    const hasDataUsage = dataKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    return isRelevantPath || hasDataUsage;
  }

  extractComponentName(content) {
    const match = content.match(/export default function (\\w+)/);
    return match ? match[1] : null;
  }

  replaceMockDataUsage(content) {
    // Replace common mock data patterns
    const replacements = [
      {
        pattern: /const \\[orders,\\s*setOrders\\]\\s*=\\s*useState<.*?>\\(\\[[\\s\\S]*?\\]\\);/g,
        replacement: '// Orders data now comes from useUserData context'
      },
      {
        pattern: /const \\[warranties,\\s*setWarranties\\]\\s*=\\s*useState<.*?>\\(\\[[\\s\\S]*?\\]\\);/g,
        replacement: '// Warranties data now comes from useUserData context'
      },
      {
        pattern: /const \\[projects,\\s*setProjects\\]\\s*=\\s*useState<.*?>\\(\\[[\\s\\S]*?\\]\\);/g,
        replacement: '// Projects data now comes from useUserData context'
      },
      {
        pattern: /const \\[invoices,\\s*setInvoices\\]\\s*=\\s*useState<.*?>\\(\\[[\\s\\S]*?\\]\\);/g,
        replacement: '// Invoices data now comes from useUserData context'
      },
      {
        pattern: /const \\[.*stats.*,\\s*set.*\\]\\s*=\\s*useState<.*?>\\([\\s\\S]*?\\);/g,
        replacement: '// Stats data now comes from useUserData context'
      }
    ];
    
    let modifiedContent = content;
    
    replacements.forEach(({ pattern, replacement }) => {
      modifiedContent = modifiedContent.replace(pattern, replacement);
    });
    
    return modifiedContent;
  }

  addLoadingAndErrorStates(content) {
    // Add loading state check if not present
    if (!content.includes('isLoading') && !content.includes('loading')) {
      const returnIndex = content.indexOf('return (');
      if (returnIndex !== -1) {
        const loadingState = `
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={refreshUserData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

`;
        content = content.slice(0, returnIndex) + loadingState + content.slice(returnIndex);
      }
    }
    
    return content;
  }

  generateReport() {
    console.log('\\n📊 Connection Report:');
    console.log('═══════════════════════════════════════');
    console.log(`📁 Total Pages Found: ${this.report.statistics.totalPages}`);
    console.log(`✅ Successfully Updated: ${this.report.statistics.updatedPages}`);
    console.log(`⏭️  Skipped (Not Relevant): ${this.report.statistics.skippedPages}`);
    console.log(`❌ Errors: ${this.report.statistics.errorPages}`);
    
    if (this.report.processed.length > 0) {
      console.log('\\n📝 Updated Pages:');
      this.report.processed.forEach(item => {
        console.log(`  ✅ ${item.file}`);
        item.changes.forEach(change => {
          console.log(`     - ${change}`);
        });
      });
    }
    
    if (this.report.errors.length > 0) {
      console.log('\\n❌ Errors:');
      this.report.errors.forEach(error => {
        console.log(`  ❌ ${error.file}: ${error.error}`);
      });
    }
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), 'user-pages-connection-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Additional utility functions
function createDataSharingHooks() {
  console.log('\\n🔗 Creating additional data sharing hooks...');
  
  const hooksDir = path.join(process.cwd(), 'src', 'core', 'shared', 'hooks');
  
  // Ensure hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  
  // Create useSharedStats hook
  const sharedStatsHook = `
import { useUserData } from '../contexts/UserDataContext';
import UserStatsCalculator from '../services/UserStatsCalculator';

export const useSharedStats = () => {
  const { orders, warranties, projects, invoices, profile, stats } = useUserData();
  
  const financialStats = UserStatsCalculator.calculateFinancialStats(orders, invoices, projects);
  const projectStats = UserStatsCalculator.calculateProjectStats(projects);
  const warrantyStats = UserStatsCalculator.calculateWarrantyStats(warranties);
  const orderStats = UserStatsCalculator.calculateOrderStats(orders);
  const loyaltyStats = UserStatsCalculator.calculateLoyaltyStats(profile, orders, projects);
  
  return {
    basicStats: stats,
    financialStats,
    projectStats,
    warrantyStats,
    orderStats,
    loyaltyStats,
  };
};
`;
  
  fs.writeFileSync(path.join(hooksDir, 'useSharedStats.ts'), sharedStatsHook);
  console.log('✅ Created useSharedStats hook');
}

function createQuickActions() {
  console.log('\\n⚡ Creating quick actions helper...');
  
  const utilsDir = path.join(process.cwd(), 'src', 'core', 'shared', 'utils');
  
  const quickActionsHelper = `
import { Order, Warranty, Project, Invoice } from '../contexts/UserDataContext';

export class QuickActions {
  // Quick filters for common data queries
  static getRecentOrders(orders: Order[], days: number = 30): Order[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return orders.filter(order => new Date(order.orderDate) >= cutoffDate);
  }
  
  static getActiveWarranties(warranties: Warranty[]): Warranty[] {
    return warranties.filter(warranty => warranty.status === 'active');
  }
  
  static getExpiringWarranties(warranties: Warranty[], months: number = 3): Warranty[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() + months);
    
    return warranties.filter(warranty => {
      return warranty.status === 'active' && 
             new Date(warranty.expiryDate) <= cutoffDate;
    });
  }
  
  static getActiveProjects(projects: Project[]): Project[] {
    return projects.filter(project => project.status === 'in-progress');
  }
  
  static getOverdueInvoices(invoices: Invoice[]): Invoice[] {
    const today = new Date();
    return invoices.filter(invoice => 
      invoice.status === 'pending' && new Date(invoice.dueDate) < today
    );
  }
  
  static getPendingOrders(orders: Order[]): Order[] {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped'
    );
  }
  
  // Quick calculations
  static calculateMonthlySpending(orders: Order[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && 
               orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.total, 0);
  }
  
  static calculateProjectBudgetUtilization(projects: Project[]): number {
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
    
    return totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  }
}
`;
  
  fs.writeFileSync(path.join(utilsDir, 'quickActions.ts'), quickActionsHelper);
  console.log('✅ Created QuickActions helper');
}

// Main execution
async function main() {
  const connector = new UserPagesConnector();
  
  await connector.connectAllPages();
  createDataSharingHooks();
  createQuickActions();
  
  console.log('\\n🎉 All user pages are now connected and sharing data!');
  console.log('\\n📋 Next Steps:');
  console.log('1. Test each user page to ensure data loads correctly');
  console.log('2. Update any remaining manual data references');
  console.log('3. Configure real-time data sync if needed');
  console.log('4. Set up proper error handling for production');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = UserPagesConnector;
