// @ts-nocheck
const fs = require('fs');
const path = require('path');

const fixImports = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules, .git, and backup directories
      if (!['node_modules', '.git', 'backups'].includes(file.name)) {
        fixImports(fullPath);
      }
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      // Read file content
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Fix UI component imports
      const uiImportFixes = [
        ['@/domains/shared/components/ui/card', '@/core/shared/components/ui/card'],
        ['@/domains/shared/components/ui/button', '@/core/shared/components/ui/button'],
        ['@/domains/shared/components/ui/badge', '@/core/shared/components/ui/badge'],
        ['@/domains/shared/components/ui/input', '@/core/shared/components/ui/input'],
        ['@/domains/shared/components/ui/tabs', '@/core/shared/components/ui/tabs'],
        ['@/domains/shared/components/ui/progress', '@/core/shared/components/ui/progress'],
        ['@/domains/shared/components/ui/loading-spinner', '@/core/shared/components/ui/loading-spinner'],
        ['@/domains/shared/components/ui', '@/core/shared/components/ui'],
      ];
      
      // Fix service imports
      const serviceImportFixes = [
        ['@/domains/shared/services/auth-recovery', '@/core/shared/services/auth-recovery'],
        ['@/domains/shared/services/logout', '@/core/shared/services/logout'],
        ['@/domains/shared/services/markets/gcc-market-manager', '@/core/shared/services/markets/gcc-market-manager'],
        ['@/domains/shared/services/markets/uae-market-manager', '@/core/shared/services/markets/uae-market-manager'],
        ['@/domains/shared/services/markets/kuwait-market-manager', '@/core/shared/services/markets/kuwait-market-manager'],
        ['@/domains/shared/services/markets/qatar-market-manager', '@/core/shared/services/markets/qatar-market-manager'],
        ['@/domains/shared/services/construction/construction-ecosystem-manager', '@/core/shared/services/construction/construction-ecosystem-manager'],
      ];
      
      // Apply all fixes
      [...uiImportFixes, ...serviceImportFixes].forEach(([oldPath, newPath]) => {
        if (content.includes(oldPath)) {
          content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
          changed = true;
        }
      });
      
      // Write back if changed
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed imports in: ${fullPath}`);
      }
    }
  }
};

console.log('🔄 Starting comprehensive import fix...');
fixImports('./src');
console.log('✨ Import fix complete!');
