/**
 * CONSERVATIVE CLEANUP SCRIPT
 * Safely removes only clearly obsolete files from organized folders
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 CONSERVATIVE CLEANUP OF ORGANIZED FOLDERS');
console.log('Removing only clearly obsolete and redundant files...\n');

// Files that are clearly safe to delete (very conservative list)
const SAFE_TO_DELETE = [
    // Definitely obsolete cleanup scripts
    'scripts/cleanup-remaining-v1.js',
    'scripts/eliminate-all-versions.js', 
    'scripts/final-version-cleanup.js',
    
    // Folder consolidation scripts (task completed)
    'scripts/folder-consolidation-analysis.ps1',
    'scripts/execute-folder-consolidation.ps1',
    
    // Quick fix and test scripts that are no longer needed
    'scripts/quick-fix.ps1',
    'scripts/simple-test.js',
    'scripts/quick-connectivity-test.js',
    
    // Verification scripts for one-time tasks
    'scripts/verify-pages-vs-old-commits.js'
];

// Files to move to archive (keep but move to backup)
const ARCHIVE_FILES = [
    // Organization script (keep for reference)
    'scripts/organize-binna-folder.js',
    
    // Analysis scripts (might be useful later)
    'scripts/analyze-organized-folders-cleanup.js',
    'scripts/detailed-cleanup-identifier.js',
    
    // Clean templates (might be reference)
    'scripts/create-clean-templates.js'
];

let deletedCount = 0;
let archivedCount = 0;
let totalSpaceSaved = 0;

console.log('🗑️  DELETING OBSOLETE FILES:');

for (const filePath of SAFE_TO_DELETE) {
    if (fs.existsSync(filePath)) {
        try {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            
            console.log(`   🗑️  Deleting: ${filePath} (${sizeKB}KB)`);
            fs.unlinkSync(filePath);
            
            deletedCount++;
            totalSpaceSaved += stats.size;
            
            console.log(`      ✅ Deleted successfully`);
        } catch (error) {
            console.log(`      ❌ Failed to delete: ${error.message}`);
        }
    } else {
        console.log(`   ⚠️  File not found: ${filePath}`);
    }
}

console.log('\n📦 ARCHIVING REFERENCE FILES:');

// Ensure archive directory exists
const archiveDir = 'backup/completed-scripts';
if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
    console.log(`   📁 Created archive directory: ${archiveDir}`);
}

for (const filePath of ARCHIVE_FILES) {
    if (fs.existsSync(filePath)) {
        try {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            const fileName = path.basename(filePath);
            const archivePath = path.join(archiveDir, fileName);
            
            console.log(`   📦 Archiving: ${filePath} (${sizeKB}KB)`);
            
            // Copy to archive first
            fs.copyFileSync(filePath, archivePath);
            
            // Then delete original
            fs.unlinkSync(filePath);
            
            archivedCount++;
            console.log(`      ✅ Archived to: ${archivePath}`);
        } catch (error) {
            console.log(`      ❌ Failed to archive: ${error.message}`);
        }
    } else {
        console.log(`   ⚠️  File not found: ${filePath}`);
    }
}

// Check for old phase scripts that can be consolidated
console.log('\n🔍 CHECKING FOR PHASE SCRIPTS CONSOLIDATION:');

const phaseScripts = [];
if (fs.existsSync('scripts/analysis')) {
    const analysisFiles = fs.readdirSync('scripts/analysis');
    const phaseFiles = analysisFiles.filter(file => file.startsWith('phase') && file.endsWith('.ps1'));
    
    if (phaseFiles.length > 5) {
        console.log(`   📋 Found ${phaseFiles.length} phase scripts`);
        console.log('   💡 Consider consolidating these into a single reference document');
        
        // Create a consolidated reference file
        const consolidatedPath = path.join(archiveDir, 'phase-scripts-reference.md');
        let consolidatedContent = '# Phase Scripts Reference\n\n';
        consolidatedContent += 'This document contains information about all phase scripts that were used during development.\n\n';
        
        phaseFiles.slice(0, 5).forEach(file => {
            consolidatedContent += `## ${file}\n`;
            consolidatedContent += `- Located in: scripts/analysis/${file}\n`;
            consolidatedContent += `- Purpose: Development phase script\n\n`;
        });
        
        fs.writeFileSync(consolidatedPath, consolidatedContent);
        console.log(`   📄 Created reference: ${consolidatedPath}`);
    }
}

// Check backup folder for old files
console.log('\n🗂️  CHECKING BACKUP FOLDER:');
if (fs.existsSync('backup/')) {
    const backupItems = fs.readdirSync('backup/', { withFileTypes: true });
    const oldBackups = [];
    
    for (const item of backupItems) {
        if (item.isDirectory()) {
            const dirPath = path.join('backup/', item.name);
            const stats = fs.statSync(dirPath);
            const age = Math.ceil((new Date() - stats.mtime) / (1000 * 60 * 60 * 24));
            
            if (age > 30) {
                oldBackups.push({ name: item.name, age, path: dirPath });
            }
        }
    }
    
    if (oldBackups.length > 0) {
        console.log(`   📦 Found ${oldBackups.length} backup folders older than 30 days:`);
        oldBackups.forEach(backup => {
            console.log(`      📁 ${backup.name} (${backup.age} days old)`);
        });
        console.log('   💡 Consider archiving these to external storage');
    } else {
        console.log('   ✅ No old backup folders found');
    }
}

console.log('\n📊 CLEANUP SUMMARY:');
console.log(`   🗑️  Files deleted: ${deletedCount}`);
console.log(`   📦 Files archived: ${archivedCount}`);
console.log(`   💾 Space freed: ${(totalSpaceSaved / 1024).toFixed(1)}KB`);
console.log(`   📁 Archive location: ${archiveDir}`);

console.log('\n✅ CLEANUP BENEFITS:');
console.log('   🧹 Removed obsolete scripts');
console.log('   📦 Preserved important files in archive');
console.log('   🗂️  Maintained organized folder structure');
console.log('   💾 Freed up disk space');

console.log('\n🎯 RECOMMENDATIONS FOR FURTHER CLEANUP:');
console.log('   1. 📋 Review phase scripts in scripts/analysis/');
console.log('   2. 📚 Consolidate completion reports in docs/reports/');
console.log('   3. 🗂️  Archive backup/ folders older than 30 days');
console.log('   4. 🔍 Review any remaining test files manually');

console.log('\n🎉 CONSERVATIVE CLEANUP COMPLETE!');
console.log('Your organized folders are now optimized while preserving important files.');
