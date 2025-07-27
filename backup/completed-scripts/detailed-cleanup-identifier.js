/**
 * DETAILED CLEANUP CANDIDATES IDENTIFIER
 * Provides specific recommendations for files that can be safely deleted
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DETAILED CLEANUP ANALYSIS');
console.log('Identifying specific files that can be safely removed...\n');

// Define specific cleanup categories
const SPECIFIC_CLEANUP_PATTERNS = {
    // Definitely safe to remove
    SAFE_TO_DELETE: {
        patterns: [
            // Old test files
            /test.*old|.*old.*test/i,
            /temp.*test|test.*temp/i,
            /simple.*test|quick.*test/i,
            
            // Backup and temporary scripts
            /backup.*\.js$|.*backup\.js$/i,
            /temp.*\.js$|.*temp\.js$/i,
            /old.*\.js$|.*old\.js$/i,
            
            // Version-specific files
            /v1\.js$|v2\.js$|v3\.js$/i,
            /version.*\.js$/i,
            
            // Quick fixes that are likely obsolete
            /quick-fix|simple-fix|temp-fix/i,
            
            // Specific known obsolete patterns
            /folder-consolidation|restructur/i
        ],
        description: 'Files that are clearly outdated or temporary'
    },
    
    // Need careful review
    REVIEW_CAREFULLY: {
        patterns: [
            // Phase/step files might be documentation
            /phase\d+|step\d+/i,
            
            // Server files might be important
            /server\.js$/i,
            
            // Analysis files might contain useful data
            /analyz.*\.js$/i,
            
            // Validation files might be needed
            /validat.*\.js$/i
        ],
        description: 'Files that need manual inspection'
    },
    
    // Database cleanup
    DATABASE_CLEANUP: {
        patterns: [
            // Old SQL files
            /old.*\.sql$|.*old\.sql$/i,
            /temp.*\.sql$|.*temp\.sql$/i,
            /backup.*\.sql$|.*backup\.sql$/i,
            /test.*\.sql$|.*test\.sql$/i,
            
            // Version-specific SQL
            /v1\.sql$|v2\.sql$|v3\.sql$/i
        ],
        description: 'Database files that might be obsolete'
    },
    
    // Documentation cleanup
    DOCS_CLEANUP: {
        patterns: [
            // Temporary documentation
            /temp.*\.md$|.*temp\.md$/i,
            /draft.*\.md$|.*draft\.md$/i,
            /old.*\.md$|.*old\.md$/i,
            
            // Specific completion reports that might be consolidated
            /STEP_\d+.*\.md$/i,
            /_COMPLETION_REPORT\.md$/i
        ],
        description: 'Documentation that might be redundant'
    }
};

// Check specific directories for cleanup
function analyzeSpecificDirectory(dirPath, patterns) {
    const results = {
        safeToDelete: [],
        needReview: [],
        totalFiles: 0
    };
    
    if (!fs.existsSync(dirPath)) {
        return results;
    }
    
    function scanDirectory(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            } else {
                results.totalFiles++;
                
                // Check against patterns
                const fileInfo = {
                    name: item,
                    path: fullPath,
                    size: (stat.size / 1024).toFixed(1) + 'KB',
                    modified: stat.mtime,
                    age: Math.ceil((new Date() - stat.mtime) / (1000 * 60 * 60 * 24))
                };
                
                // Check if file matches safe-to-delete patterns
                const matchesSafeDelete = SPECIFIC_CLEANUP_PATTERNS.SAFE_TO_DELETE.patterns.some(pattern => 
                    pattern.test(item)
                );
                
                const matchesReview = SPECIFIC_CLEANUP_PATTERNS.REVIEW_CAREFULLY.patterns.some(pattern => 
                    pattern.test(item)
                );
                
                if (matchesSafeDelete) {
                    results.safeToDelete.push(fileInfo);
                } else if (matchesReview || fileInfo.age > 21) {
                    results.needReview.push(fileInfo);
                }
            }
        }
    }
    
    scanDirectory(dirPath);
    return results;
}

// Analyze each directory
const directories = ['scripts/', 'docs/reports/', 'database/', 'reports/json/', 'backup/'];
const overallResults = {
    safeToDelete: [],
    needReview: [],
    totalAnalyzed: 0
};

console.log('📂 DIRECTORY-SPECIFIC ANALYSIS:\n');

for (const dir of directories) {
    console.log(`📁 Analyzing ${dir}...`);
    const results = analyzeSpecificDirectory(dir, SPECIFIC_CLEANUP_PATTERNS);
    
    console.log(`   📊 Total files: ${results.totalFiles}`);
    console.log(`   🗑️  Safe to delete: ${results.safeToDelete.length}`);
    console.log(`   ⚠️  Need review: ${results.needReview.length}`);
    
    overallResults.safeToDelete.push(...results.safeToDelete);
    overallResults.needReview.push(...results.needReview);
    overallResults.totalAnalyzed += results.totalFiles;
    
    console.log('');
}

// Display detailed results
console.log('🎯 DETAILED CLEANUP RECOMMENDATIONS');
console.log('='.repeat(50));

console.log(`\n🗑️  SAFE TO DELETE (${overallResults.safeToDelete.length} files):`);
if (overallResults.safeToDelete.length === 0) {
    console.log('   ✅ No files identified as obviously safe to delete');
} else {
    overallResults.safeToDelete.forEach(file => {
        console.log(`   📄 ${file.name}`);
        console.log(`      📁 ${path.dirname(file.path)}`);
        console.log(`      📊 ${file.size} | ${file.age} days old`);
        console.log('');
    });
}

console.log(`\n⚠️  NEED MANUAL REVIEW (${overallResults.needReview.slice(0, 15).length} shown):`);
overallResults.needReview.slice(0, 15).forEach(file => {
    console.log(`   📄 ${file.name}`);
    console.log(`      📁 ${path.dirname(file.path)} | ${file.size} | ${file.age} days old`);
});

if (overallResults.needReview.length > 15) {
    console.log(`   ... and ${overallResults.needReview.length - 15} more files`);
}

// Special recommendations
console.log('\n💡 SPECIAL RECOMMENDATIONS:');

// Check for duplicate documentation
const completionReports = overallResults.needReview.filter(file => 
    file.name.includes('COMPLETION_REPORT') || file.name.includes('SUCCESS_REPORT')
);

if (completionReports.length > 10) {
    console.log(`   📚 Consider consolidating ${completionReports.length} completion reports`);
    console.log('      into a single comprehensive project history document');
}

// Check for old test files
const testFiles = overallResults.needReview.filter(file => 
    file.name.toLowerCase().includes('test') && file.age > 14
);

if (testFiles.length > 0) {
    console.log(`   🧪 Review ${testFiles.length} test files older than 2 weeks`);
}

// Check backup folder specifically
const backupSize = fs.existsSync('backup/') ? 
    fs.readdirSync('backup/', { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .reduce((total, file) => {
          const stats = fs.statSync(path.join('backup/', file.name));
          return total + stats.size;
      }, 0) : 0;

if (backupSize > 0) {
    console.log(`   💾 Backup folder contains ${(backupSize / 1024 / 1024).toFixed(1)}MB of data`);
    console.log('      Consider archiving to external storage if older than 30 days');
}

console.log('\n📊 CLEANUP SUMMARY:');
console.log(`   📁 Directories analyzed: ${directories.length}`);
console.log(`   📄 Total files: ${overallResults.totalAnalyzed}`);
console.log(`   🗑️  Safe deletions identified: ${overallResults.safeToDelete.length}`);
console.log(`   ⚠️  Files needing review: ${overallResults.needReview.length}`);

const potentialSpaceSaved = overallResults.safeToDelete.reduce((total, file) => {
    return total + parseFloat(file.size);
}, 0);

console.log(`   💾 Potential space savings: ${potentialSpaceSaved.toFixed(1)}KB`);

console.log('\n🚀 NEXT ACTIONS:');
if (overallResults.safeToDelete.length > 0) {
    console.log('   1. 🗑️  Delete the files marked as "safe to delete"');
} else {
    console.log('   1. ✅ No obvious safe deletions found');
}
console.log('   2. 🔍 Manually review files older than 21 days');
console.log('   3. 📚 Consider consolidating multiple completion reports');
console.log('   4. 💾 Archive backup/ folder contents if older than 30 days');
console.log('   5. 🧹 Run this analysis monthly for maintenance');
