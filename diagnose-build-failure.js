#!/usr/bin/env node

/**
 * Build Failure Diagnostic Script
 * Identifies common issues that cause Next.js build failures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 BUILD FAILURE DIAGNOSTIC SCRIPT');
console.log('═══════════════════════════════════════════════════════');

let issues = [];
let warnings = [];

// 1. Check for duplicate dynamic exports
console.log('\n1️⃣ Checking for duplicate dynamic exports...');
const checkDuplicateDynamic = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    if (file.isDirectory() && !file.name.startsWith('.') && !file.name.startsWith('node_modules')) {
      checkDuplicateDynamic(path.join(dir, file.name));
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const filePath = path.join(dir, file.name);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const dynamicMatches = content.match(/export\s+const\s+dynamic\s*=/g);
        if (dynamicMatches && dynamicMatches.length > 1) {
          issues.push({
            type: 'DUPLICATE_DYNAMIC',
            file: filePath.replace(process.cwd(), ''),
            message: `Found ${dynamicMatches.length} dynamic exports in same file`,
            severity: 'ERROR'
          });
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  });
};

// 2. Check for missing imports
console.log('2️⃣ Checking for missing imports...');
const checkMissingImports = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    if (file.isDirectory() && !file.name.startsWith('.') && !file.name.startsWith('node_modules')) {
      checkMissingImports(path.join(dir, file.name));
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const filePath = path.join(dir, file.name);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for common missing imports
        if (content.includes('useState') && !content.includes("import { useState") && !content.includes("import React")) {
          warnings.push({
            type: 'MISSING_REACT_IMPORT',
            file: filePath.replace(process.cwd(), ''),
            message: 'Uses useState but React import might be missing',
            severity: 'WARNING'
          });
        }
        
        if (content.includes('useEffect') && !content.includes("import { useEffect") && !content.includes("import React")) {
          warnings.push({
            type: 'MISSING_REACT_IMPORT',
            file: filePath.replace(process.cwd(), ''),
            message: 'Uses useEffect but React import might be missing',
            severity: 'WARNING'
          });
        }
        
        // Check for undefined variables/components
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('<') && !line.includes('//') && !line.includes('/*')) {
            const componentMatches = line.match(/<([A-Z][a-zA-Z]*)/g);
            if (componentMatches) {
              componentMatches.forEach(match => {
                const componentName = match.substring(1);
                if (!content.includes(`import ${componentName}`) && 
                    !content.includes(`import { ${componentName}`) &&
                    !content.includes(`const ${componentName}`) &&
                    !content.includes(`function ${componentName}`) &&
                    !['div', 'span', 'button', 'input', 'form', 'img', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li', 'table', 'tr', 'td', 'th'].includes(componentName.toLowerCase())) {
                  warnings.push({
                    type: 'POTENTIALLY_UNDEFINED_COMPONENT',
                    file: filePath.replace(process.cwd(), ''),
                    line: index + 1,
                    message: `Component '${componentName}' used but import not found`,
                    severity: 'WARNING'
                  });
                }
              });
            }
          }
        });
        
      } catch (error) {
        // Skip files that can't be read
      }
    }
  });
};

// 3. Check for syntax errors in key files
console.log('3️⃣ Checking for syntax errors...');
const checkSyntaxErrors = () => {
  const keyFiles = [
    'src/app/store/dashboard/page.tsx',
    'src/app/user/dashboard/page.tsx',
    'src/app/admin/dashboard/page.tsx',
    'src/core/shared/services/supabase-data-service.ts',
    'src/middleware.ts'
  ];
  
  keyFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for common syntax issues
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        const openBrackets = (content.match(/\[/g) || []).length;
        const closeBrackets = (content.match(/\]/g) || []).length;
        
        if (openBraces !== closeBraces) {
          issues.push({
            type: 'UNMATCHED_BRACES',
            file: file,
            message: `Unmatched braces: ${openBraces} open, ${closeBraces} close`,
            severity: 'ERROR'
          });
        }
        
        if (openParens !== closeParens) {
          issues.push({
            type: 'UNMATCHED_PARENTHESES',
            file: file,
            message: `Unmatched parentheses: ${openParens} open, ${closeParens} close`,
            severity: 'ERROR'
          });
        }
        
        if (openBrackets !== closeBrackets) {
          issues.push({
            type: 'UNMATCHED_BRACKETS',
            file: file,
            message: `Unmatched brackets: ${openBrackets} open, ${closeBrackets} close`,
            severity: 'ERROR'
          });
        }
        
        // Check for unterminated strings
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (!line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
            const singleQuotes = (line.match(/'/g) || []).length;
            const doubleQuotes = (line.match(/"/g) || []).length;
            const backticks = (line.match(/`/g) || []).length;
            
            if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0 || backticks % 2 !== 0) {
              warnings.push({
                type: 'POTENTIAL_UNTERMINATED_STRING',
                file: file,
                line: index + 1,
                message: 'Potential unterminated string',
                severity: 'WARNING'
              });
            }
          }
        });
        
      } catch (error) {
        issues.push({
          type: 'FILE_READ_ERROR',
          file: file,
          message: `Cannot read file: ${error.message}`,
          severity: 'ERROR'
        });
      }
    }
  });
};

// 4. Check TypeScript configuration
console.log('4️⃣ Checking TypeScript configuration...');
const checkTypeScriptConfig = () => {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      if (!tsconfig.compilerOptions) {
        issues.push({
          type: 'INVALID_TSCONFIG',
          file: 'tsconfig.json',
          message: 'Missing compilerOptions in tsconfig.json',
          severity: 'ERROR'
        });
      }
      
      if (tsconfig.compilerOptions && !tsconfig.compilerOptions.jsx) {
        warnings.push({
          type: 'MISSING_JSX_CONFIG',
          file: 'tsconfig.json',
          message: 'jsx option not specified in compilerOptions',
          severity: 'WARNING'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'INVALID_TSCONFIG',
        file: 'tsconfig.json',
        message: `Invalid JSON in tsconfig.json: ${error.message}`,
        severity: 'ERROR'
      });
    }
  } else {
    issues.push({
      type: 'MISSING_TSCONFIG',
      file: 'tsconfig.json',
      message: 'tsconfig.json file not found',
      severity: 'ERROR'
    });
  }
};

// 5. Check Next.js configuration
console.log('5️⃣ Checking Next.js configuration...');
const checkNextConfig = () => {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    try {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for syntax issues in next.config.js
      if (!content.includes('module.exports') && !content.includes('export default')) {
        warnings.push({
          type: 'INVALID_NEXT_CONFIG',
          file: 'next.config.js',
          message: 'next.config.js should export a configuration object',
          severity: 'WARNING'
        });
      }
      
    } catch (error) {
      issues.push({
        type: 'NEXT_CONFIG_READ_ERROR',
        file: 'next.config.js',
        message: `Cannot read next.config.js: ${error.message}`,
        severity: 'ERROR'
      });
    }
  }
};

// Run all checks
try {
  checkDuplicateDynamic('src');
  checkMissingImports('src');
  checkSyntaxErrors();
  checkTypeScriptConfig();
  checkNextConfig();
} catch (error) {
  console.error('Error during diagnostic:', error.message);
}

// Report results
console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 DIAGNOSTIC RESULTS');
console.log('═══════════════════════════════════════════════════════');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ No issues found! The build failure might be due to:');
  console.log('   • Network issues with dependencies');
  console.log('   • Temporary Next.js build cache issues');
  console.log('   • Environment variable problems');
  console.log('\n💡 Try running: npm run build --verbose for more details');
} else {
  if (issues.length > 0) {
    console.log(`❌ Found ${issues.length} CRITICAL ISSUES:`);
    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.type} - ${issue.severity}`);
      console.log(`   📁 File: ${issue.file}`);
      if (issue.line) console.log(`   📍 Line: ${issue.line}`);
      console.log(`   💬 ${issue.message}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} WARNINGS:`);
    warnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. ${warning.type} - ${warning.severity}`);
      console.log(`   📁 File: ${warning.file}`);
      if (warning.line) console.log(`   📍 Line: ${warning.line}`);
      console.log(`   💬 ${warning.message}`);
    });
  }
}

console.log('\n═══════════════════════════════════════════════════════');
console.log('🔧 RECOMMENDED ACTIONS');
console.log('═══════════════════════════════════════════════════════');

if (issues.length > 0) {
  console.log('1. Fix the critical issues listed above');
  console.log('2. Run this diagnostic script again');
  console.log('3. Try building again with: npm run build');
} else {
  console.log('1. Clear Next.js cache: rm -rf .next');
  console.log('2. Reinstall dependencies: npm ci');
  console.log('3. Try building again: npm run build');
}

console.log('\n🏁 Diagnostic complete!');
