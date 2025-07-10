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

// Function to check if a file uses auth (directly or through components)
function usesAuth(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for direct useAuth usage
    if (content.includes('useAuth')) {
      return true;
    }
    
    // Check for components that might use auth
    const authComponents = [
      'LayoutProvider',
      'Navbar',
      'AuthGuard',
      'CustomerDashboard',
      'StorefrontPage'
    ];
    
    return authComponents.some(component => content.includes(component));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return false;
  }
}

// Function to add dynamic export to a page file
function addDynamicExport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if dynamic export already exists
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`Dynamic export already exists in ${filePath}`);
      return;
    }
    
    // Find 'use client' directive and add dynamic export after imports
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
      lines.splice(insertIndex, 0, '', "// Force dynamic rendering for this page to avoid SSG issues with auth context", "export const dynamic = 'force-dynamic'");
      
      content = lines.join('\n');
      fs.writeFileSync(filePath, content);
      console.log(`Added dynamic export to ${filePath}`);
    } else {
      console.log(`Could not find suitable insertion point in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Main execution
const appDir = path.join(__dirname, '..', 'src', 'app');
const pageFiles = findPageFiles(appDir);

console.log(`Found ${pageFiles.length} page files`);

let authPagesFixed = 0;

for (const pageFile of pageFiles) {
  const relativePath = path.relative(process.cwd(), pageFile);
  
  if (usesAuth(pageFile)) {
    console.log(`\n📄 Processing: ${relativePath}`);
    addDynamicExport(pageFile);
    authPagesFixed++;
  }
}

console.log(`\n✅ Processed ${authPagesFixed} pages that use auth`);
console.log('🔧 All pages that might cause auth context issues should now have dynamic export!');
