const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getAllTsxFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (!['node_modules', '.next', 'backups', 'temp'].includes(file)) {
        results = results.concat(getAllTsxFiles(filePath));
      }
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  
  return results;
}

function fixDynamicExportPlacement(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already has dynamic export
    if (!content.includes("export const dynamic = 'force-dynamic'")) {
      return false; // Skip files without dynamic export
    }
    
    console.log(`\nProcessing: ${filePath}`);
    
    // Split content into lines
    const lines = content.split('\n');
    
    // Find all import statements and the dynamic export
    let lastImportIndex = -1;
    let dynamicExportIndex = -1;
    let hasUseClient = false;
    let useClientIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for 'use client' directive
      if (line === "'use client'" || line === '"use client"') {
        hasUseClient = true;
        useClientIndex = i;
      }
      
      // Check for import statements (but not dynamic import() calls)
      if (line.startsWith('import ') && !line.includes('import(')) {
        lastImportIndex = i;
      }
      
      // Check for dynamic export
      if (line.includes("export const dynamic = 'force-dynamic'")) {
        dynamicExportIndex = i;
      }
    }
    
    // If no imports found, but has use client, place after use client
    if (lastImportIndex === -1 && hasUseClient) {
      lastImportIndex = useClientIndex;
    }
    
    // If dynamic export is found and not in the correct position
    if (dynamicExportIndex !== -1) {
      // Remove the current dynamic export line
      const dynamicExportLine = lines[dynamicExportIndex];
      lines.splice(dynamicExportIndex, 1);
      
      // Find the correct position (after last import or after 'use client')
      let insertIndex = lastImportIndex + 1;
      
      // Skip empty lines after imports
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
      
      // Insert the dynamic export at the correct position
      lines.splice(insertIndex, 0, '', dynamicExportLine);
      
      // Reconstruct content
      const newContent = lines.join('\n');
      
      // Only write if content actually changed
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✓ Fixed dynamic export placement in ${filePath}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing dynamic export placement in all TSX files...');
  
  const appDir = path.resolve('./src/app');
  
  if (!fs.existsSync(appDir)) {
    console.error('src/app directory not found');
    return;
  }
  
  const tsxFiles = getAllTsxFiles(appDir);
  console.log(`Found ${tsxFiles.length} TSX files to check`);
  
  let fixedCount = 0;
  
  for (const file of tsxFiles) {
    if (fixDynamicExportPlacement(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✅ Fixed dynamic export placement in ${fixedCount} files`);
  
  // Also check for any files that use useAuth but don't have dynamic export
  console.log('\n🔍 Checking for files that use useAuth but missing dynamic export...');
  
  for (const file of tsxFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('useAuth') && !content.includes("export const dynamic = 'force-dynamic'")) {
        console.log(`⚠️  File uses useAuth but missing dynamic export: ${file}`);
        
        // Add dynamic export to these files
        const lines = content.split('\n');
        
        // Find position after imports
        let lastImportIndex = -1;
        let useClientIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (line === "'use client'" || line === '"use client"') {
            useClientIndex = i;
          }
          
          if (line.startsWith('import ') && !line.includes('import(')) {
            lastImportIndex = i;
          }
        }
        
        let insertIndex = Math.max(lastImportIndex, useClientIndex) + 1;
        
        // Skip empty lines
        while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
          insertIndex++;
        }
        
        lines.splice(insertIndex, 0, '', "export const dynamic = 'force-dynamic'");
        
        fs.writeFileSync(file, lines.join('\n'));
        console.log(`✓ Added dynamic export to ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error checking ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Total fixes applied: ${fixedCount}`);
}

main();
