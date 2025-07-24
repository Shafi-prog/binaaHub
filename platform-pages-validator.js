#!/usr/bin/env node

/**
 * Platform Pages Validator
 * Checks all platform pages for working status, URL validation, and marks their current state
 * Supports Vercel deployment URLs and local development
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class PlatformPagesValidator {
  constructor() {
    this.baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    this.results = {
      working: [],
      needsFix: [],
      deleted: [],
      total: 0
    };
    this.routes = [];
  }

  async scanPlatformPages() {
    console.log('🔍 Scanning platform pages...\n');
    
    const appDir = path.join(__dirname, 'src/app');
    this.routes = this.findAllRoutes(appDir);
    
    console.log(`Found ${this.routes.length} routes to validate\n`);
    return this.routes;
  }

  findAllRoutes(dir, basePath = '') {
    const routes = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip special Next.js directories
          if (item.startsWith('_') || item.startsWith('.')) continue;
          
          const currentPath = basePath + '/' + item;
          
          // Check if this directory has a page.tsx
          const pagePath = path.join(fullPath, 'page.tsx');
          if (fs.existsSync(pagePath)) {
            routes.push({
              route: currentPath || '/',
              filePath: pagePath,
              directory: fullPath,
              type: 'page'
            });
          }
          
          // Recursively scan subdirectories
          const subRoutes = this.findAllRoutes(fullPath, currentPath);
          routes.push(...subRoutes);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
    
    return routes;
  }

  async validateRoute(route) {
    console.log(`Checking: ${route.route}`);
    
    try {
      // Check if file exists and is accessible
      if (!fs.existsSync(route.filePath)) {
        return {
          ...route,
          status: 'deleted',
          error: 'File not found',
          canRead: false
        };
      }

      // Try to read the file content
      let content;
      let canRead = true;
      let hasTypeScriptErrors = false;
      let hasImportErrors = false;
      
      try {
        content = fs.readFileSync(route.filePath, 'utf8');
      } catch (readError) {
        canRead = false;
        return {
          ...route,
          status: 'needsFix',
          error: `Cannot read file: ${readError.message}`,
          canRead: false
        };
      }

      // Analyze file content for common issues
      const analysis = this.analyzeFileContent(content, route.filePath);
      
      // Check if file is a valid React component
      const isValidComponent = this.isValidReactComponent(content);
      
      if (!isValidComponent) {
        return {
          ...route,
          status: 'needsFix',
          error: 'Invalid React component',
          analysis,
          canRead
        };
      }

      // If using Vercel URL, try to fetch the actual page
      let httpStatus = null;
      let httpError = null;
      
      if (process.env.CHECK_HTTP === 'true') {
        try {
          const url = `${this.baseUrl}${route.route}`;
          const response = await this.fetchWithTimeout(url, 5000);
          httpStatus = response.status;
          
          if (response.status >= 400) {
            httpError = `HTTP ${response.status}`;
          }
        } catch (fetchError) {
          httpError = fetchError.message;
        }
      }

      // Determine overall status
      let status = 'working';
      let error = null;

      if (analysis.hasTypeScriptErrors || analysis.hasImportErrors || analysis.hasSyntaxErrors) {
        status = 'needsFix';
        error = 'Code analysis issues detected';
      } else if (httpError) {
        status = 'needsFix';
        error = httpError;
      }

      return {
        ...route,
        status,
        error,
        analysis,
        canRead,
        httpStatus,
        lastModified: fs.statSync(route.filePath).mtime
      };

    } catch (error) {
      return {
        ...route,
        status: 'needsFix',
        error: error.message,
        canRead: false
      };
    }
  }

  analyzeFileContent(content, filePath) {
    const analysis = {
      hasTypeScriptErrors: false,
      hasImportErrors: false,
      hasSyntaxErrors: false,
      hasAtTsNoCheck: false,
      missingExports: false,
      issues: []
    };

    // Check for @ts-nocheck (indicates TypeScript issues)
    if (content.includes('@ts-nocheck')) {
      analysis.hasAtTsNoCheck = true;
      analysis.issues.push('@ts-nocheck directive found');
    }

    // Check for common import errors
    const importLines = content.match(/^import.*from.*$/gm) || [];
    for (const line of importLines) {
      if (line.includes('@/') && !this.validateImportPath(line, filePath)) {
        analysis.hasImportErrors = true;
        analysis.issues.push(`Potentially invalid import: ${line.trim()}`);
      }
    }

    // Check for export default
    if (!content.includes('export default')) {
      analysis.missingExports = true;
      analysis.issues.push('Missing default export');
    }

    // Check for basic syntax issues
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      analysis.hasSyntaxErrors = true;
      analysis.issues.push('Mismatched braces');
    }

    return analysis;
  }

  validateImportPath(importLine, currentFilePath) {
    // Extract the import path
    const match = importLine.match(/from\s+['"`]([^'"`]+)['"`]/);
    if (!match) return true;
    
    const importPath = match[1];
    
    // Skip validation for external packages
    if (!importPath.startsWith('@/') && !importPath.startsWith('./') && !importPath.startsWith('../')) {
      return true;
    }

    // Convert @/ paths to actual file paths
    if (importPath.startsWith('@/')) {
      const actualPath = importPath.replace('@/', 'src/');
      const fullPath = path.join(__dirname, actualPath);
      
      // Check various possible extensions
      const possiblePaths = [
        fullPath + '.tsx',
        fullPath + '.ts',
        fullPath + '.js',
        fullPath + '.jsx',
        fullPath + '/index.tsx',
        fullPath + '/index.ts',
        fullPath + '/index.js'
      ];
      
      return possiblePaths.some(p => fs.existsSync(p));
    }

    return true; // Assume relative paths are OK for now
  }

  isValidReactComponent(content) {
    // Basic checks for a valid React component
    const hasReactImport = content.includes("'react'") || content.includes('"react"');
    const hasExportDefault = content.includes('export default');
    const hasJSX = content.includes('<') && content.includes('>');
    
    return hasExportDefault && (hasJSX || content.includes('React.'));
  }

  async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Platform-Pages-Validator/1.0'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async validateAllPages() {
    console.log(`🚀 Starting validation of platform pages...\n`);
    console.log(`Base URL: ${this.baseUrl}\n`);
    
    const routes = await this.scanPlatformPages();
    this.results.total = routes.length;
    
    console.log('⏳ Validating pages...\n');
    
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const result = await this.validateRoute(route);
      
      // Progress indicator
      const progress = Math.round(((i + 1) / routes.length) * 100);
      process.stdout.write(`\r${'█'.repeat(progress / 2)}${'░'.repeat(50 - progress / 2)} ${progress}%`);
      
      // Categorize results
      switch (result.status) {
        case 'working':
          this.results.working.push(result);
          break;
        case 'needsFix':
          this.results.needsFix.push(result);
          break;
        case 'deleted':
          this.results.deleted.push(result);
          break;
      }
    }
    
    console.log('\n\n✅ Validation complete!\n');
    return this.results;
  }

  generateReport() {
    console.log('📊 PLATFORM PAGES VALIDATION REPORT');
    console.log('====================================\n');
    
    console.log(`📈 SUMMARY:`);
    console.log(`Total Pages: ${this.results.total}`);
    console.log(`✅ Working: ${this.results.working.length}`);
    console.log(`⚠️  Need Fix: ${this.results.needsFix.length}`);
    console.log(`❌ Deleted/Missing: ${this.results.deleted.length}\n`);
    
    // Working pages
    if (this.results.working.length > 0) {
      console.log('✅ WORKING PAGES:');
      console.log('================');
      this.results.working.forEach(page => {
        console.log(`✓ ${page.route} ${page.httpStatus ? `(HTTP ${page.httpStatus})` : ''}`);
      });
      console.log('');
    }
    
    // Pages that need fixing
    if (this.results.needsFix.length > 0) {
      console.log('⚠️  PAGES THAT NEED FIXING:');
      console.log('===========================');
      this.results.needsFix.forEach(page => {
        console.log(`⚠️  ${page.route}`);
        console.log(`   Error: ${page.error}`);
        if (page.analysis && page.analysis.issues.length > 0) {
          page.analysis.issues.forEach(issue => {
            console.log(`   - ${issue}`);
          });
        }
        console.log(`   File: ${page.filePath}`);
        console.log('');
      });
    }
    
    // Deleted/missing pages
    if (this.results.deleted.length > 0) {
      console.log('❌ DELETED/MISSING PAGES:');
      console.log('=========================');
      this.results.deleted.forEach(page => {
        console.log(`❌ ${page.route}`);
        console.log(`   Error: ${page.error}`);
        console.log(`   Expected: ${page.filePath}`);
        console.log('');
      });
    }
    
    // Quick fix suggestions
    console.log('🔧 QUICK FIX SUGGESTIONS:');
    console.log('=========================');
    
    const atTsNoCheckPages = this.results.needsFix.filter(p => p.analysis?.hasAtTsNoCheck);
    if (atTsNoCheckPages.length > 0) {
      console.log(`📝 ${atTsNoCheckPages.length} pages have @ts-nocheck directives - consider fixing TypeScript errors`);
    }
    
    const importErrorPages = this.results.needsFix.filter(p => p.analysis?.hasImportErrors);
    if (importErrorPages.length > 0) {
      console.log(`📦 ${importErrorPages.length} pages have import errors - check missing components`);
    }
    
    const syntaxErrorPages = this.results.needsFix.filter(p => p.analysis?.hasSyntaxErrors);
    if (syntaxErrorPages.length > 0) {
      console.log(`⚠️  ${syntaxErrorPages.length} pages have syntax errors - check code structure`);
    }
    
    console.log('\n🎯 OVERALL STATUS:');
    const healthPercentage = Math.round((this.results.working.length / this.results.total) * 100);
    console.log(`Platform Health: ${healthPercentage}%`);
    
    if (healthPercentage >= 90) {
      console.log('🎉 Excellent! Your platform is in great shape!');
    } else if (healthPercentage >= 70) {
      console.log('👍 Good! A few pages need attention.');
    } else if (healthPercentage >= 50) {
      console.log('⚠️  Warning! Several pages need fixing.');
    } else {
      console.log('🚨 Critical! Many pages need immediate attention.');
    }
  }

  async saveReportToFile() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `platform-validation-report-${timestamp}.json`;
    
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      summary: {
        total: this.results.total,
        working: this.results.working.length,
        needsFix: this.results.needsFix.length,
        deleted: this.results.deleted.length,
        healthPercentage: Math.round((this.results.working.length / this.results.total) * 100)
      },
      details: this.results
    };
    
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${filename}`);
    
    return filename;
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const checkHttp = args.includes('--http') || args.includes('-h');
  const saveFile = args.includes('--save') || args.includes('-s');
  
  if (checkHttp) {
    process.env.CHECK_HTTP = 'true';
  }
  
  console.log('🔧 Platform Pages Validator v1.0');
  console.log('=================================\n');
  
  const validator = new PlatformPagesValidator();
  
  try {
    await validator.validateAllPages();
    validator.generateReport();
    
    if (saveFile) {
      await validator.saveReportToFile();
    }
    
    // Exit with appropriate code
    const hasErrors = validator.results.needsFix.length > 0 || validator.results.deleted.length > 0;
    process.exit(hasErrors ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = PlatformPagesValidator;
