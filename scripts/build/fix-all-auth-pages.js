const fs = require('fs');
const path = require('path');

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

// Function to check if a file is a client component
function isClientComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes("'use client'") || content.includes('"use client"');
  } catch (error) {
    return false;
  }
}

// Function to add dynamic export to a page file
function addDynamicExport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if dynamic export already exists
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      return false; // Already has it
    }
    
    const lines = content.split('\n');
    let insertIndex = -1;
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Find last import statement
      if (line.startsWith('import ')) {
        lastImportIndex = i;
      }
      
      // Find first non-import, non-comment, non-directive line
      if (lastImportIndex >= 0 && 
          !line.startsWith('import ') && 
          !line.startsWith('//') && 
          !line.startsWith("'use") && 
          !line.startsWith('"use') &&
          !line.startsWith('export const dynamic') &&
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
      return true; // Successfully added
    }
    
    return false; // Could not add
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const appDir = path.join(__dirname, '..', 'src', 'app');
const pageFiles = findPageFiles(appDir);

console.log(`Found ${pageFiles.length} page files`);

let clientPagesFixed = 0;
let alreadyFixed = 0;

for (const pageFile of pageFiles) {
  const relativePath = path.relative(process.cwd(), pageFile);
  
  if (isClientComponent(pageFile)) {
    const wasAdded = addDynamicExport(pageFile);
    if (wasAdded) {
      console.log(`✅ Added dynamic export to: ${relativePath}`);
      clientPagesFixed++;
    } else {
      alreadyFixed++;
    }
  }
}

console.log(`\n📊 Summary:`);
console.log(`- Client pages processed: ${clientPagesFixed + alreadyFixed}`);
console.log(`- Dynamic exports added: ${clientPagesFixed}`);
console.log(`- Already had dynamic export: ${alreadyFixed}`);
console.log(`\n🚀 All client-side pages should now have dynamic rendering to prevent SSG auth context issues!`);
