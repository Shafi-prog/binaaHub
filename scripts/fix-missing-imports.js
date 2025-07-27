#!/usr/bin/env node

/**
 * Fix Missing Imports Script
 * Adds missing createClientComponentClient and useEffect imports to store pages
 */

const fs = require('fs');
const path = require('path');

const STORE_PAGES_DIR = 'src/app/store';

class ImportFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
  }

  fixFileImports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      let hasChanges = false;

      // Check if file uses createClientComponentClient but doesn't import it
      if (content.includes('createClientComponentClient()') && 
          !content.includes("import { createClientComponentClient }")) {
        
        // Find the line after 'use client' or the first import
        const lines = content.split('\n');
        let insertIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("'use client'") || lines[i].includes('"use client"')) {
            insertIndex = i + 1;
            break;
          } else if (lines[i].startsWith('import ') && insertIndex === -1) {
            insertIndex = i;
            break;
          }
        }
        
        if (insertIndex !== -1) {
          // Insert blank line and import
          lines.splice(insertIndex, 0, '');
          lines.splice(insertIndex + 1, 0, "import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';");
          hasChanges = true;
        }
      }

      // Check if file uses useEffect but doesn't import it
      if (content.includes('useEffect(') && 
          !content.includes('useEffect') && 
          content.includes('import React, { useState }')) {
        
        // Replace useState import to include useEffect
        newContent = newContent.replace(
          'import React, { useState }',
          'import React, { useState, useEffect }'
        );
        hasChanges = true;
      } else if (content.includes('useEffect(') && 
                 !content.includes('useEffect') &&
                 content.includes('from "react"')) {
        
        // Add useEffect to existing react import
        newContent = newContent.replace(
          /import { ([^}]+) } from "react"/,
          (match, imports) => {
            if (!imports.includes('useEffect')) {
              return `import { ${imports}, useEffect } from "react"`;
            }
            return match;
          }
        );
        hasChanges = true;
      }

      if (hasChanges) {
        if (lines.length > 0) {
          newContent = lines.join('\n');
        }
        fs.writeFileSync(filePath, newContent);
        this.fixedFiles.push(filePath);
        console.log(`✅ Fixed imports in: ${path.relative(process.cwd(), filePath)}`);
      }

    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.log(`❌ Error fixing: ${path.relative(process.cwd(), filePath)} - ${error.message}`);
    }
  }

  fixAllFiles(dirPath = STORE_PAGES_DIR) {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist`);
      return;
    }

    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.fixAllFiles(itemPath);
      } else if (item.endsWith('page.tsx')) {
        this.fixFileImports(itemPath);
      }
    });
  }

  // Fix specific known problematic files
  fixKnownFiles() {
    const problematicFiles = [
      'src/app/store/barcode-scanner/page.tsx', // Has duplicate supabase declaration
      'src/app/storefront/[id]/page.tsx' // Has null params issue
    ];

    problematicFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Fix barcode scanner duplicate supabase
          if (filePath.includes('barcode-scanner')) {
            // Remove duplicate supabase declaration
            const lines = content.split('\n');
            const filteredLines = [];
            let hasSupabaseDeclaration = false;
            
            for (const line of lines) {
              if (line.includes('const supabase = createClientComponentClient')) {
                if (!hasSupabaseDeclaration) {
                  filteredLines.push(line);
                  hasSupabaseDeclaration = true;
                }
                // Skip duplicate declarations
              } else {
                filteredLines.push(line);
              }
            }
            
            content = filteredLines.join('\n');
          }
          
          // Fix storefront params null issue
          if (filePath.includes('storefront/[id]')) {
            content = content.replace(
              'const storeId = params.id as string;',
              'const storeId = params?.id as string;'
            );
          }
          
          fs.writeFileSync(filePath, content);
          this.fixedFiles.push(filePath);
          console.log(`✅ Fixed specific issues in: ${path.relative(process.cwd(), filePath)}`);
          
        } catch (error) {
          this.errors.push({ file: filePath, error: error.message });
          console.log(`❌ Error fixing specific file: ${filePath} - ${error.message}`);
        }
      }
    });
  }

  run() {
    console.log('🔧 Fixing missing imports in store pages...');
    
    this.fixAllFiles();
    this.fixKnownFiles();
    
    console.log(`\n📊 Import Fix Results:`);
    console.log(`Fixed Files: ${this.fixedFiles.length}`);
    console.log(`Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  - ${path.relative(process.cwd(), file)}: ${error}`);
      });
    }
    
    if (this.fixedFiles.length > 0) {
      console.log('\n✅ Successfully fixed imports in:');
      this.fixedFiles.forEach(file => {
        console.log(`  - ${path.relative(process.cwd(), file)}`);
      });
    }
    
    return { fixedFiles: this.fixedFiles.length, errors: this.errors.length };
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new ImportFixer();
  fixer.run();
}

module.exports = ImportFixer;
