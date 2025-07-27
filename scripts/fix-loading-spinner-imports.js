// @ts-nocheck
const fs = require('fs');
const path = require('path');

const fixLoadingSpinnerImports = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules, .git, and backup directories
      if (!['node_modules', '.git', 'backups'].includes(file.name)) {
        fixLoadingSpinnerImports(fullPath);
      }
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      // Read file content
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Fix LoadingSpinner named imports to default imports
      const patterns = [
        // Named import with loading-spinner path
        {
          from: /import\s*{\s*LoadingSpinner\s*}\s*from\s*['"]@\/core\/shared\/components\/ui\/loading-spinner['"];?/g,
          to: "import LoadingSpinner from '@/core/shared/components/ui/loading-spinner';"
        },
        // Named import with LoadingSpinner capitalized path
        {
          from: /import\s*{\s*LoadingSpinner\s*}\s*from\s*['"]@\/core\/shared\/components\/ui\/LoadingSpinner['"];?/g,
          to: "import LoadingSpinner from '@/core/shared/components/ui/loading-spinner';"
        },
        // Other variations
        {
          from: /import\s*{\s*LoadingSpinner\s*}\s*from\s*['"]@\/core\/shared\/components\/ui['"];?/g,
          to: "import LoadingSpinner from '@/core/shared/components/ui/loading-spinner';"
        }
      ];
      
      // Apply all fixes
      patterns.forEach(({ from, to }) => {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      });
      
      // Write back if changed
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed LoadingSpinner imports in: ${fullPath}`);
      }
    }
  }
};

console.log('🔄 Starting LoadingSpinner import fix...');
fixLoadingSpinnerImports('./src');
console.log('✨ LoadingSpinner import fix complete!');
