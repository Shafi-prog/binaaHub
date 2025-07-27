/**
 * ORGANIZED FOLDERS CLEANUP ANALYZER
 * Analyzes scripts/, docs/, database/, reports/, backup/ folders for unnecessary files
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANALYZING ORGANIZED FOLDERS FOR CLEANUP OPPORTUNITIES');
console.log('Checking for outdated, redundant, or unnecessary files...\n');

// Define analysis patterns
const ANALYSIS_PATTERNS = {
    // Scripts that might be outdated or redundant
    OUTDATED_SCRIPTS: [
        /old|legacy|backup|temp|test-.*old|.*-old/i,
        /v1|v2|v3|version/i,
        /deprecated|obsolete|unused/i,
        /quick-fix|temp-fix|simple-fix/i
    ],
    
    // Documentation that might be redundant
    REDUNDANT_DOCS: [
        /step_\d+|phase_\d+/i,
        /temp|temporary|quick|draft/i,
        /old|legacy|backup/i,
        /_old|_backup|_temp/i
    ],
    
    // Database files that might be outdated
    OUTDATED_DB: [
        /old|legacy|temp|backup/i,
        /test|sample|mock/i,
        /quick|simple|draft/i
    ],
    
    // Report files that might be obsolete
    OBSOLETE_REPORTS: [
        /temp|temporary|draft/i,
        /old|legacy|backup/i,
        /test|sample/i
    ]
};

// File categories for analysis
const FOLDERS_TO_ANALYZE = {
    'scripts/': {
        patterns: ANALYSIS_PATTERNS.OUTDATED_SCRIPTS,
        description: 'Automation and utility scripts'
    },
    'docs/reports/': {
        patterns: ANALYSIS_PATTERNS.REDUNDANT_DOCS,
        description: 'Documentation and reports'
    },
    'database/': {
        patterns: ANALYSIS_PATTERNS.OUTDATED_DB,
        description: 'SQL and database files'
    },
    'reports/json/': {
        patterns: ANALYSIS_PATTERNS.OBSOLETE_REPORTS,
        description: 'JSON analysis files'
    },
    'backup/': {
        patterns: [/.*/], // All backup files might be candidates for cleanup
        description: 'Backup and archived files'
    }
};

// Get all files from a directory
function getAllFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            files.push(...getAllFiles(fullPath));
        } else {
            files.push({
                name: item,
                path: fullPath,
                size: stat.size,
                modified: stat.mtime,
                directory: path.dirname(fullPath)
            });
        }
    }
    
    return files;
}

// Check if file matches cleanup patterns
function matchesCleanupPattern(filename, patterns) {
    return patterns.some(pattern => pattern.test(filename));
}

// Get file age in days
function getFileAge(modifiedDate) {
    const now = new Date();
    const diffTime = Math.abs(now - modifiedDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Analyze content for relevance (basic check)
function analyzeFileRelevance(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const indicators = {
            hasImports: content.includes('import') || content.includes('require'),
            hasExports: content.includes('export') || content.includes('module.exports'),
            hasComments: content.includes('//') || content.includes('/*'),
            lineCount: content.split('\n').length,
            size: content.length,
            hasCompletionMarker: content.toLowerCase().includes('complete') || content.toLowerCase().includes('success'),
            hasErrorHandling: content.includes('try') || content.includes('catch') || content.includes('error')
        };
        
        // Calculate relevance score
        let score = 0;
        if (indicators.hasImports) score += 2;
        if (indicators.hasExports) score += 2;
        if (indicators.hasErrorHandling) score += 1;
        if (indicators.lineCount > 50) score += 1;
        if (indicators.lineCount > 100) score += 1;
        
        return {
            score,
            indicators,
            category: score >= 5 ? 'active' : score >= 3 ? 'moderate' : 'minimal'
        };
    } catch (error) {
        return { score: 0, indicators: {}, category: 'unreadable' };
    }
}

// Main analysis
const analysis = {
    candidates: [],
    keep: [],
    unsure: []
};

console.log('📂 ANALYZING EACH FOLDER...\n');

for (const [folder, config] of Object.entries(FOLDERS_TO_ANALYZE)) {
    console.log(`📁 Analyzing ${folder} (${config.description})`);
    
    const files = getAllFiles(folder);
    console.log(`   Found ${files.length} files`);
    
    for (const file of files) {
        const age = getFileAge(file.modified);
        const matchesPattern = matchesCleanupPattern(file.name, config.patterns);
        const relevance = analyzeFileRelevance(file.path);
        
        const fileAnalysis = {
            ...file,
            age,
            matchesPattern,
            relevance,
            folder,
            sizeKB: (file.size / 1024).toFixed(1)
        };
        
        // Categorize based on analysis
        if (matchesPattern && relevance.category === 'minimal' && age > 7) {
            analysis.candidates.push(fileAnalysis);
        } else if (relevance.category === 'active' || age < 7) {
            analysis.keep.push(fileAnalysis);
        } else {
            analysis.unsure.push(fileAnalysis);
        }
    }
    
    console.log('   ✅ Analysis complete\n');
}

// Display results
console.log('📋 CLEANUP ANALYSIS RESULTS');
console.log('='.repeat(60));

console.log(`\n🗑️  DELETION CANDIDATES (${analysis.candidates.length} files):`);
console.log('Files that appear outdated or unnecessary:\n');

if (analysis.candidates.length === 0) {
    console.log('   ✅ No obvious candidates for deletion found');
} else {
    analysis.candidates.forEach(file => {
        console.log(`   🔍 ${file.name}`);
        console.log(`      📁 Location: ${file.folder}`);
        console.log(`      📊 Size: ${file.sizeKB}KB | Age: ${file.age} days | Relevance: ${file.relevance.category}`);
        console.log(`      🎯 Reason: ${file.matchesPattern ? 'Matches cleanup pattern' : ''} ${file.relevance.category === 'minimal' ? 'Minimal code' : ''}`);
        console.log('');
    });
}

console.log(`\n⚠️  REQUIRES REVIEW (${analysis.unsure.length} files):`);
console.log('Files that need manual review:\n');

if (analysis.unsure.length === 0) {
    console.log('   ✅ No files require manual review');
} else {
    analysis.unsure.slice(0, 10).forEach(file => { // Show first 10
        console.log(`   🔍 ${file.name}`);
        console.log(`      📁 ${file.folder} | Size: ${file.sizeKB}KB | Age: ${file.age} days | Relevance: ${file.relevance.category}`);
    });
    
    if (analysis.unsure.length > 10) {
        console.log(`   ... and ${analysis.unsure.length - 10} more files`);
    }
}

console.log(`\n✅ KEEP (${analysis.keep.length} files):`);
console.log('Files that appear to be actively used or important');

// Special analysis for backup folder
const backupFiles = getAllFiles('backup/');
if (backupFiles.length > 0) {
    console.log(`\n🗂️  BACKUP FOLDER ANALYSIS:`);
    console.log(`   Found ${backupFiles.length} files in backup folders`);
    console.log('   💡 Backup files older than 30 days could be archived or removed');
    
    const oldBackups = backupFiles.filter(file => getFileAge(file.modified) > 30);
    if (oldBackups.length > 0) {
        console.log(`   🗑️  ${oldBackups.length} backup files are older than 30 days`);
    }
}

console.log('\n📊 SUMMARY:');
console.log(`   🗑️  Deletion candidates: ${analysis.candidates.length}`);
console.log(`   ⚠️  Require review: ${analysis.unsure.length}`);
console.log(`   ✅ Keep: ${analysis.keep.length}`);
console.log(`   📁 Total files analyzed: ${analysis.candidates.length + analysis.unsure.length + analysis.keep.length}`);

// Recommendations
console.log('\n🎯 RECOMMENDATIONS:');
if (analysis.candidates.length > 0) {
    console.log('   1. ✅ Safe to delete: Files marked as deletion candidates');
    console.log('   2. 🔍 Review manually: Files marked for review');
    console.log('   3. 🗂️  Archive old backups: Files in backup/ older than 30 days');
} else {
    console.log('   🎉 Your organized folders are already well-optimized!');
    console.log('   📝 Consider reviewing backup/ folder for old files');
}

console.log('\n💡 NEXT STEPS:');
console.log('   1. Review the deletion candidates list above');
console.log('   2. Check file contents before deletion');
console.log('   3. Create a final backup before cleanup');
console.log('   4. Run cleanup in phases for safety');
