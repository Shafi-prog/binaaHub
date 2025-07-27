/**
 * TARGETED DUPLICATE CHECKER - CORE vs MARKETPLACE DIRECTORIES
 * Specifically checks for duplicates between:
 * - src/core/shared/hooks/
 * - src/domains/marketplace/storefront/store/
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 CHECKING DUPLICATES BETWEEN CORE AND MARKETPLACE DIRECTORIES');
console.log('Target directories:');
console.log('  📁 src/core/shared/hooks/');
console.log('  📁 src/domains/marketplace/storefront/store/\n');

const coreDir = 'src/core/shared/hooks';
const marketplaceDir = 'src/domains/marketplace/storefront/store';

// Get all files from both directories
function getAllFiles(dir, basePath = '') {
    const files = [];
    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
            files.push(...getAllFiles(fullPath, relativePath));
        } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
            files.push({
                name: item,
                path: fullPath,
                relativePath,
                size: fs.statSync(fullPath).size
            });
        }
    }
    
    return files;
}

// Get content hash for comparison
function getContentHash(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
        return null;
    }
}

// Get files from both directories
const coreFiles = getAllFiles(coreDir);
const marketplaceFiles = getAllFiles(marketplaceDir);

console.log(`📊 DIRECTORY SCAN RESULTS:`);
console.log(`   Core files found: ${coreFiles.length}`);
console.log(`   Marketplace files found: ${marketplaceFiles.length}\n`);

// Check for exact name matches
const nameMatches = [];
const contentMatches = [];
const similarContent = [];

console.log('🔍 ANALYZING FILE MATCHES...\n');

for (const coreFile of coreFiles) {
    for (const marketplaceFile of marketplaceFiles) {
        // Check for exact filename matches
        if (coreFile.name === marketplaceFile.name) {
            const coreHash = getContentHash(coreFile.path);
            const marketplaceHash = getContentHash(marketplaceFile.path);
            
            const match = {
                filename: coreFile.name,
                coreFile: coreFile.path,
                marketplaceFile: marketplaceFile.path,
                coreSize: (coreFile.size / 1024).toFixed(1) + 'KB',
                marketplaceSize: (marketplaceFile.size / 1024).toFixed(1) + 'KB',
                identical: coreHash === marketplaceHash,
                coreHash,
                marketplaceHash
            };
            
            nameMatches.push(match);
            
            if (coreHash === marketplaceHash) {
                contentMatches.push(match);
            } else if (coreHash && marketplaceHash) {
                // Check for similar content (different but related)
                similarContent.push(match);
            }
        }
    }
}

// Display results
console.log('📋 DUPLICATE ANALYSIS RESULTS');
console.log('='.repeat(60));

if (nameMatches.length === 0) {
    console.log('✅ No files with identical names found between directories');
} else {
    console.log(`📁 FILES WITH IDENTICAL NAMES: ${nameMatches.length}`);
    console.log('-'.repeat(40));
    
    nameMatches.forEach(match => {
        const status = match.identical ? '🔄 IDENTICAL CONTENT' : '⚠️  DIFFERENT CONTENT';
        console.log(`\n${status}: ${match.filename}`);
        console.log(`   📁 Core: ${match.coreFile} (${match.coreSize})`);
        console.log(`   📁 Marketplace: ${match.marketplaceFile} (${match.marketplaceSize})`);
        
        if (match.identical) {
            console.log('   ✅ Content is identical - candidate for removal');
        } else {
            console.log('   🔍 Content differs - requires manual review');
        }
    });
}

console.log('\n📊 SUMMARY:');
console.log(`   Total name matches: ${nameMatches.length}`);
console.log(`   Identical content: ${contentMatches.length}`);
console.log(`   Different content: ${similarContent.length}`);

if (contentMatches.length > 0) {
    console.log('\n🎯 CLEANUP RECOMMENDATIONS:');
    console.log('✅ SAFE TO REMOVE (identical content):');
    contentMatches.forEach(match => {
        console.log(`   🗑️  Consider removing: ${match.coreFile}`);
        console.log(`   ✅ Keep: ${match.marketplaceFile}`);
    });
}

if (similarContent.length > 0) {
    console.log('\n⚠️  REQUIRES MANUAL REVIEW (different content):');
    similarContent.forEach(match => {
        console.log(`   🔍 ${match.filename} - Check which version to keep`);
    });
}

console.log('\n🛡️  SAFETY NOTE:');
console.log('   Always verify Medusa imports before removing any files');
console.log('   Check for @medusajs imports and HttpTypes usage');
