#!/usr/bin/env node

/**
 * Script to resolve all git merge conflicts automatically
 * This will fix the build failure on Vercel
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 FIXING GIT MERGE CONFLICTS...');
console.log('═══════════════════════════════════════════════════════');

// Get all files with merge conflicts
let conflictFiles = [];
try {
  const output = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' }).trim();
  if (output) {
    conflictFiles = output.split('\n');
  }
} catch (error) {
  // No unmerged files found, let's search for conflict markers manually
  console.log('⚠️ No unmerged files found in git, searching for conflict markers...');
}

// Search for files with conflict markers
const searchForConflicts = () => {
  try {
    const result = execSync('git grep -l "<<<<<<< Updated upstream"', { encoding: 'utf8' }).trim();
    if (result) {
      return result.split('\n');
    }
  } catch (error) {
    console.log('No conflict markers found with git grep, searching manually...');
  }
  return [];
};

if (conflictFiles.length === 0) {
  conflictFiles = searchForConflicts();
}

console.log(`📁 Found ${conflictFiles.length} files with merge conflicts`);

let fixedCount = 0;
let errorCount = 0;

const fixMergeConflicts = (filePath) => {
  try {
    console.log(`🔧 Fixing: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ❌ File not found: ${filePath}`);
      errorCount++;
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has conflict markers
    if (!content.includes('<<<<<<< Updated upstream')) {
      console.log(`  ⚪ No conflicts in: ${filePath}`);
      return;
    }
    
    // Remove conflict markers and choose the "Stashed changes" version
    // This preserves our work from the stash
    const lines = content.split('\n');
    const cleanedLines = [];
    let inConflict = false;
    let inStashedSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('<<<<<<< Updated upstream')) {
        inConflict = true;
        continue;
      }
      
      if (line.startsWith('=======')) {
        inStashedSection = true;
        continue;
      }
      
      if (line.startsWith('>>>>>>> Stashed changes')) {
        inConflict = false;
        inStashedSection = false;
        continue;
      }
      
      // Keep lines that are not in conflict or are in the stashed section
      if (!inConflict || inStashedSection) {
        cleanedLines.push(line);
      }
    }
    
    const cleanedContent = cleanedLines.join('\n');
    
    // Write the cleaned content back
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    
    console.log(`  ✅ Fixed conflicts in: ${filePath}`);
    fixedCount++;
    
  } catch (error) {
    console.log(`  ❌ Error fixing ${filePath}: ${error.message}`);
    errorCount++;
  }
};

// Fix each file
conflictFiles.forEach(filePath => {
  fixMergeConflicts(filePath);
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('📊 MERGE CONFLICT RESOLUTION SUMMARY');
console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Files Fixed: ${fixedCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`📁 Total Files Processed: ${conflictFiles.length}`);

if (fixedCount > 0) {
  console.log('\n🎉 Successfully resolved all merge conflicts!');
  console.log('📝 All conflicts resolved in favor of "Stashed changes" (your work)');
  console.log('\n💡 Next steps:');
  console.log('   1. Run "npm run build" to test the build');
  console.log('   2. Commit the resolved conflicts');
  console.log('   3. Push to trigger a new Vercel deployment');
} else {
  console.log('\n⚠️ No merge conflicts were found or fixed.');
}

console.log('\n🔍 Run "npm run build" to test if the build works now.');
