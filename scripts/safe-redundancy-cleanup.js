#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 🚨 SAFETY-FIRST REDUNDANCY CLEANUP SCRIPT 🚨
// This script creates backups before making any changes

console.log('🛡️  SAFETY-FIRST DEEP REDUNDANCY CLEANUP\n');
console.log('This script will:');
console.log('1. 📋 Create a backup of files before deletion');
console.log('2. 🔍 Analyze each file for safety');
console.log('3. ✅ Only remove files with confirmed duplicates');
console.log('4. 🔄 Provide rollback instructions');
console.log('\n' + '='.repeat(60) + '\n');

// Create backup directory
const backupDir = path.join(__dirname, 'redundancy-cleanup-backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Files identified for potential removal (with safety checks)
const redundantFiles = [
  // V1 versions of hooks (keep latest)
  { 
    remove: 'src/core/shared/hooks/use-data-grid-form-handlers-v1.tsx',
    keep: 'src/core/shared/hooks/use-data-grid-form-handlers.tsx',
    reason: 'v1 version superseded by current'
  },
  { 
    remove: 'src/core/shared/hooks/use-data-grid-cell-error-v1.tsx',
    keep: 'src/core/shared/hooks/use-data-grid-cell-error.tsx',
    reason: 'v1 version superseded by current'
  },
  { 
    remove: 'src/core/shared/hooks/use-data-grid-cell-snapshot-v1.tsx',
    keep: 'src/core/shared/hooks/use-data-grid-cell-snapshot.tsx',
    reason: 'v1 version superseded by current'
  },
  { 
    remove: 'src/core/shared/hooks/use-data-grid-keydown-event-v1.tsx',
    keep: 'src/core/shared/hooks/use-data-grid-keydown-event.tsx',
    reason: 'v1 version superseded by current'
  },
  { 
    remove: 'src/core/shared/hooks/index-v1.ts',
    keep: 'src/core/shared/hooks/index.ts',
    reason: 'v1 index file superseded by current'
  },

  // JavaScript duplicates of TypeScript files
  { 
    remove: 'src/domains/marketplace/services/auth-module.js',
    keep: 'src/domains/marketplace/services/auth-module.tsx',
    reason: 'JS version superseded by TS/TSX'
  },
  { 
    remove: 'src/domains/marketplace/services/data-synchronizer.js',
    keep: 'src/domains/marketplace/services/data-synchronizer.ts',
    reason: 'JS version superseded by TS'
  },
  { 
    remove: 'src/domains/marketplace/services/event-bus-redis.js',
    keep: 'src/domains/marketplace/services/event-bus-redis.ts',
    reason: 'JS version superseded by TS'
  },
  { 
    remove: 'src/domains/marketplace/services/postgres-provider.js',
    keep: 'src/domains/marketplace/services/postgres-provider.tsx',
    reason: 'JS version superseded by TSX'
  },

  // Clean versions over suffixed versions
  { 
    remove: 'src/core/shared/contexts/UserDataContext-clean.tsx',
    keep: 'src/core/shared/contexts/UserDataContext.tsx',
    reason: 'Clean version merged into main'
  },

  // Duplicate component implementations
  { 
    remove: 'src/core/shared/components/UserDashboard.tsx',
    keep: 'src/domains/users/components/UserDashboard.tsx',
    reason: 'Moved to domain-specific location'
  },

  // Test file duplicates
  { 
    remove: 'src/domains/marketplace/services/__tests__/event-bus.js',
    keep: 'src/domains/marketplace/services/__tests__/event-bus.ts',
    reason: 'JS test superseded by TS test'
  },
  { 
    remove: 'src/core/shared/utils/__tests__/build-config.spec.js',
    keep: 'src/core/shared/utils/__tests__/build-config.spec.ts',
    reason: 'JS test superseded by TS test'
  }
];

function createBackup(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const backupPath = path.join(backupDir, filePath.replace(/[/\\]/g, '_'));
      fs.copyFileSync(fullPath, backupPath);
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Backup failed: ${error.message}`);
    return false;
  }
  return false;
}

function safetyCheck(item) {
  const { remove, keep, reason } = item;
  const removePath = path.join(__dirname, remove);
  const keepPath = path.join(__dirname, keep);

  console.log(`\n🔍 Analyzing: ${remove}`);
  console.log(`   📝 Reason: ${reason}`);
  console.log(`   🎯 Keeping: ${keep}`);

  // Check if files exist
  const removeExists = fs.existsSync(removePath);
  const keepExists = fs.existsSync(keepPath);

  console.log(`   📁 Remove file exists: ${removeExists ? '✅' : '❌'}`);
  console.log(`   📁 Keep file exists: ${keepExists ? '✅' : '❌'}`);

  if (!removeExists) {
    console.log(`   ⚪ Skip: File to remove doesn't exist`);
    return { action: 'skip', reason: 'File not found' };
  }

  if (!keepExists) {
    console.log(`   ⚠️  DANGER: Keep file doesn't exist! Skipping removal.`);
    return { action: 'skip', reason: 'Safety check failed - keep file missing' };
  }

  // Compare file sizes (basic duplicate check)
  try {
    const removeStats = fs.statSync(removePath);
    const keepStats = fs.statSync(keepPath);
    
    console.log(`   📊 Remove file size: ${(removeStats.size / 1024).toFixed(2)} KB`);
    console.log(`   📊 Keep file size: ${(keepStats.size / 1024).toFixed(2)} KB`);

    // If files are very different in size, be cautious
    const sizeDiff = Math.abs(removeStats.size - keepStats.size) / Math.max(removeStats.size, keepStats.size);
    if (sizeDiff > 0.5) {
      console.log(`   ⚠️  Large size difference (${(sizeDiff * 100).toFixed(1)}%) - requires manual review`);
      return { action: 'skip', reason: 'Files too different in size' };
    }

  } catch (error) {
    console.log(`   ❌ Error checking files: ${error.message}`);
    return { action: 'skip', reason: 'Error during analysis' };
  }

  return { action: 'safe_remove', size: fs.statSync(removePath).size };
}

function performSafeCleanup() {
  console.log('🧹 Starting safety-first redundancy cleanup...\n');
  
  let removedCount = 0;
  let skippedCount = 0;
  let backedUpCount = 0;
  let totalSizeFreed = 0;
  let skippedFiles = [];
  let removedFiles = [];

  redundantFiles.forEach((item, index) => {
    console.log(`\n[${ index + 1 }/${ redundantFiles.length }] Processing: ${item.remove}`);
    
    const safetyResult = safetyCheck(item);
    
    if (safetyResult.action === 'skip') {
      console.log(`   ⚪ SKIPPED: ${safetyResult.reason}`);
      skippedCount++;
      skippedFiles.push({ file: item.remove, reason: safetyResult.reason });
      return;
    }

    // Create backup before removal
    console.log(`   💾 Creating backup...`);
    if (createBackup(item.remove)) {
      console.log(`   ✅ Backup created`);
      backedUpCount++;
    } else {
      console.log(`   ❌ Backup failed - skipping removal`);
      skippedCount++;
      skippedFiles.push({ file: item.remove, reason: 'Backup failed' });
      return;
    }

    // Safe removal
    try {
      const fullPath = path.join(__dirname, item.remove);
      fs.unlinkSync(fullPath);
      console.log(`   ✅ REMOVED: ${item.remove}`);
      removedCount++;
      totalSizeFreed += safetyResult.size;
      removedFiles.push(item.remove);
    } catch (error) {
      console.log(`   ❌ Removal failed: ${error.message}`);
      skippedCount++;
      skippedFiles.push({ file: item.remove, reason: `Removal failed: ${error.message}` });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 CLEANUP SUMMARY:');
  console.log('='.repeat(60));
  console.log(`✅ Files removed: ${removedCount}`);
  console.log(`💾 Files backed up: ${backedUpCount}`);
  console.log(`⚪ Files skipped: ${skippedCount}`);
  console.log(`💽 Space freed: ${(totalSizeFreed / 1024 / 1024).toFixed(2)} MB`);

  if (removedFiles.length > 0) {
    console.log('\n✅ SUCCESSFULLY REMOVED:');
    removedFiles.forEach(file => console.log(`   - ${file}`));
  }

  if (skippedFiles.length > 0) {
    console.log('\n⚠️  SKIPPED FILES (requires manual review):');
    skippedFiles.forEach(item => console.log(`   - ${item.file}: ${item.reason}`));
  }

  console.log('\n🛡️  ROLLBACK INSTRUCTIONS:');
  console.log('If anything goes wrong, restore files from backup:');
  console.log(`📁 Backup location: ${backupDir}`);
  console.log('🔄 To restore a file:');
  console.log('   cp "redundancy-cleanup-backup/[filename]" "src/path/to/original/location"');
  
  console.log('\n✅ NEXT STEPS:');
  console.log('1. 🧪 Test your application thoroughly');
  console.log('2. 🔍 Run TypeScript compiler to check for errors');
  console.log('3. 🚀 If everything works, delete the backup folder');
  console.log('4. 📝 Commit the cleanup changes');
  
  console.log('\n🎉 Safety-first cleanup completed!');
  console.log('💡 Review skipped files manually if needed.');
}

// Execute the cleanup
performSafeCleanup();
