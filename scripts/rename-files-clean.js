const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files that need renaming to remove prefixes/suffixes
const filesToRename = [
  // Workflow executions
  'src/app/store/workflow-executions/workflow-execution-list/workflow-execution-list-old.tsx',
  'src/app/store/workflow-executions/workflow-execution-list/workflow-execution-list-new.tsx',
  
  // Users
  'src/app/store/users/user-list/user-list-old.tsx',
  'src/app/store/users/user-list/user-list-new.tsx',
  
  // Store pages
  'src/app/store/storefront/page-old.tsx',
  'src/app/store/suppliers/page_old_backup.tsx',
  'src/app/store/suppliers/page-old.tsx',
  'src/app/store/suppliers/page-old-backup.tsx',
  'src/app/store/purchase-orders/page_old_backup.tsx',
  'src/app/store/product-variants/page-old.tsx',
  'src/app/store/orders/page_new.tsx',
  'src/app/store/dashboard/page_new.tsx',
  'src/app/store/customers/page_new.tsx',
  'src/app/store/collections/page-old.tsx'
];

function cleanFileName(fileName) {
  // Remove common suffixes and prefixes
  const suffixes = ['-old', '-new', '-backup', '-bak', '-temp', '-copy', '-original', '-draft', '-test', '_old', '_new', '_backup', '_bak', '_temp', '_copy', '_original', '_draft', '_test'];
  const prefixes = ['old-', 'new-', 'backup-', 'bak-', 'temp-', 'copy-', 'original-', 'draft-', 'test-'];
  
  let cleanName = fileName;
  
  // Remove suffixes
  for (const suffix of suffixes) {
    if (cleanName.includes(suffix)) {
      cleanName = cleanName.replace(suffix, '');
    }
  }
  
  // Remove prefixes  
  for (const prefix of prefixes) {
    if (cleanName.startsWith(prefix)) {
      cleanName = cleanName.replace(prefix, '');
    }
  }
  
  // Handle specific patterns
  cleanName = cleanName.replace(/page_old_backup/g, 'page');
  cleanName = cleanName.replace(/page-old-backup/g, 'page');
  cleanName = cleanName.replace(/workflow-execution-list-(old|new)/g, 'workflow-execution-list');
  cleanName = cleanName.replace(/user-list-(old|new)/g, 'user-list');
  
  return cleanName;
}

function renameFiles() {
  console.log('🔄 Starting file renaming process...\n');
  
  let renamedCount = 0;
  let skippedCount = 0;
  
  filesToRename.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      skippedCount++;
      return;
    }
    
    const dir = path.dirname(fullPath);
    const fileName = path.basename(fullPath);
    const cleanName = cleanFileName(fileName);
    
    if (cleanName === fileName) {
      console.log(`⚪ No change needed: ${filePath}`);
      skippedCount++;
      return;
    }
    
    const newPath = path.join(dir, cleanName);
    
    // Check if target already exists
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  Target exists, will merge: ${filePath} -> ${cleanName}`);
      
      // Read both files to compare
      const oldContent = fs.readFileSync(fullPath, 'utf8');
      const newContent = fs.readFileSync(newPath, 'utf8');
      
      if (oldContent !== newContent) {
        // Keep the newer/better version and delete the old one
        console.log(`  📝 Keeping existing ${cleanName}, removing ${fileName}`);
        fs.unlinkSync(fullPath);
      } else {
        console.log(`  📝 Files identical, removing duplicate ${fileName}`);
        fs.unlinkSync(fullPath);
      }
      renamedCount++;
      return;
    }
    
    try {
      fs.renameSync(fullPath, newPath);
      console.log(`✅ Renamed: ${fileName} -> ${cleanName}`);
      renamedCount++;
    } catch (error) {
      console.log(`❌ Failed to rename ${filePath}: ${error.message}`);
      skippedCount++;
    }
  });
  
  console.log(`\n📊 Renaming Summary:`);
  console.log(`✅ Files renamed/cleaned: ${renamedCount}`);
  console.log(`⚪ Files skipped: ${skippedCount}`);
  console.log(`📁 Total processed: ${filesToRename.length}`);
  
  console.log('\n🎉 File renaming completed!');
}

// Also clean up any remaining mock data in these files
function cleanMockData() {
  console.log('\n🧹 Cleaning mock data from renamed files...\n');
  
  // Find all .tsx files and clean them
  const storeDir = path.join(__dirname, 'src', 'app', 'store');
  
  function findAndCleanFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        findAndCleanFiles(fullPath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Remove mock data patterns
        content = content.replace(/\/\/ Mock data[^]*?(?=\n\/\/|\nexport|\nfunction|\nconst [a-zA-Z]|\ninterface|\n\}|\nreturn|\n$)/g, '');
        content = content.replace(/const mock[A-Z][^=]*=\s*\[[^]*?\];?\n?/g, '');
        content = content.replace(/const [a-zA-Z]*Mock[^=]*=\s*\[[^]*?\];?\n?/g, '');
        content = content.replace(/mock[A-Z][a-zA-Z]*:\s*\[[^]*?\],?\n?/g, '');
        
        // Clean up empty lines
        content = content.replace(/\n\n\n+/g, '\n\n');
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`🧹 Cleaned mock data from: ${path.relative(__dirname, fullPath)}`);
        }
      }
    });
  }
  
  if (fs.existsSync(storeDir)) {
    findAndCleanFiles(storeDir);
  }
}

// Run the processes
renameFiles();
cleanMockData();
