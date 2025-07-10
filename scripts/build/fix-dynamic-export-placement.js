const fs = require('fs');
const path = require('path');

// Function to fix dynamic export placement in a file
function fixDynamicExportPlacement(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if we need to fix placement
    if (!content.includes("export const dynamic = 'force-dynamic'")) {
      return false; // No dynamic export to fix
    }
    
    // Remove existing dynamic export and comment
    content = content.replace(/\n\/\/ Force dynamic rendering to avoid SSG auth context issues\nexport const dynamic = 'force-dynamic'/g, '');
    content = content.replace(/\nexport const dynamic = 'force-dynamic'/g, '');
    
    const lines = content.split('\n');
    let insertIndex = -1;
    let inMultilineImport = false;
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track multiline imports
      if (line.includes('import') && line.includes('{') && !line.includes('}')) {
        inMultilineImport = true;
      }
      
      if (inMultilineImport && line.includes('}')) {
        inMultilineImport = false;
        lastImportIndex = i;
        continue;
      }
      
      // Single line import
      if (line.startsWith('import ') && line.includes(';')) {
        lastImportIndex = i;
        continue;
      }
      
      // Skip if we're in a multiline import
      if (inMultilineImport) {
        continue;
      }
      
      // Find first non-import, non-comment, non-directive line after imports are done
      if (lastImportIndex >= 0 && 
          !line.startsWith('import ') && 
          !line.startsWith('//') && 
          !line.startsWith("'use") && 
          !line.startsWith('"use') &&
          !line.includes('export const dynamic') &&
          line !== '') {
        insertIndex = i;
        break;
      }
    }
    
    // If we found imports, insert after them
    if (lastImportIndex >= 0) {
      insertIndex = lastImportIndex + 1;
    } else {
      // If no imports found, find after 'use client'
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes("'use client'") || line.includes('"use client"')) {
          insertIndex = i + 2; // After 'use client' and empty line
          break;
        }
      }
    }
    
    if (insertIndex >= 0) {
      // Insert the dynamic export
      lines.splice(insertIndex, 0, '', "// Force dynamic rendering to avoid SSG auth context issues", "export const dynamic = 'force-dynamic'");
      
      content = lines.join('\n');
      fs.writeFileSync(filePath, content);
      return true; // Successfully fixed
    }
    
    return false; // Could not fix
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all page.tsx files in the app directory
function findPageFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findPageFiles(fullPath, files);
    } else if (item === 'page.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const appDir = path.join(__dirname, '..', 'src', 'app');
const pageFiles = findPageFiles(appDir);

console.log(`Found ${pageFiles.length} page files`);

let filesFixed = 0;

for (const pageFile of pageFiles) {
  const relativePath = path.relative(process.cwd(), pageFile);
  
  const wasFixed = fixDynamicExportPlacement(pageFile);
  if (wasFixed) {
    console.log(`✅ Fixed dynamic export placement in: ${relativePath}`);
    filesFixed++;
  }
}

console.log(`\n📊 Fixed ${filesFixed} files with dynamic export placement issues`);
