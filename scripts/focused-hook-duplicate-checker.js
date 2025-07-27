/**
 * FOCUSED HOOK DUPLICATE CHECKER - CORE vs MARKETPLACE
 * Specifically checks for use-*.tsx hook files between:
 * - src/core/shared/hooks/
 * - src/domains/marketplace/storefront/store/
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 CHECKING USE-* HOOK DUPLICATES BETWEEN CORE AND MARKETPLACE');
console.log('Target directories:');
console.log('  📁 src/core/shared/hooks/');
console.log('  📁 src/domains/marketplace/storefront/store/\n');

const coreDir = 'src/core/shared/hooks';
const marketplaceDir = 'src/domains/marketplace/storefront/store';

// Get all hook files (use-*.tsx) from both directories
function getHookFiles(dir, basePath = '') {
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
            files.push(...getHookFiles(fullPath, relativePath));
        } else if (item.startsWith('use-') && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
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

// Get content for comparison (normalized)
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

// Get content for detailed comparison
function getContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return null;
    }
}

// Check for Medusa imports
function hasMedusaImports(content) {
    if (!content) return false;
    return content.includes('@medusajs') || content.includes('HttpTypes');
}

// Get files from both directories
const coreFiles = getHookFiles(coreDir);
const marketplaceFiles = getHookFiles(marketplaceDir);

console.log(`📊 HOOK FILES SCAN RESULTS:`);
console.log(`   Core hook files: ${coreFiles.length}`);
console.log(`   Marketplace hook files: ${marketplaceFiles.length}\n`);

// Check for exact name matches
const nameMatches = [];
const contentMatches = [];
const similarContent = [];

console.log('🔍 ANALYZING HOOK FILE MATCHES...\n');

for (const coreFile of coreFiles) {
    for (const marketplaceFile of marketplaceFiles) {
        // Check for exact filename matches
        if (coreFile.name === marketplaceFile.name) {
            const coreContent = getContent(coreFile.path);
            const marketplaceContent = getContent(marketplaceFile.path);
            const coreHash = getContentHash(coreFile.path);
            const marketplaceHash = getContentHash(marketplaceFile.path);
            
            const match = {
                filename: coreFile.name,
                coreFile: coreFile.path,
                marketplaceFile: marketplaceFile.path,
                coreSize: (coreFile.size / 1024).toFixed(1) + 'KB',
                marketplaceSize: (marketplaceFile.size / 1024).toFixed(1) + 'KB',
                identical: coreHash === marketplaceHash,
                coreHasMedusa: hasMedusaImports(coreContent),
                marketplaceHasMedusa: hasMedusaImports(marketplaceContent),
                coreContent: coreContent,
                marketplaceContent: marketplaceContent
            };
            
            nameMatches.push(match);
            
            if (coreHash === marketplaceHash) {
                contentMatches.push(match);
            } else if (coreHash && marketplaceHash) {
                similarContent.push(match);
            }
        }
    }
}

// Display results
console.log('📋 HOOK DUPLICATE ANALYSIS RESULTS');
console.log('='.repeat(60));

if (nameMatches.length === 0) {
    console.log('✅ No hook files with identical names found between directories');
} else {
    console.log(`📁 HOOK FILES WITH IDENTICAL NAMES: ${nameMatches.length}`);
    console.log('-'.repeat(40));
    
    nameMatches.forEach(match => {
        const status = match.identical ? '🔄 IDENTICAL CONTENT' : '⚠️  DIFFERENT CONTENT';
        const medusaInfo = match.coreHasMedusa || match.marketplaceHasMedusa ? 
            ` 🛡️ [MEDUSA: Core=${match.coreHasMedusa}, Marketplace=${match.marketplaceHasMedusa}]` : '';
        
        console.log(`\n${status}: ${match.filename}${medusaInfo}`);
        console.log(`   📁 Core: ${match.coreFile} (${match.coreSize})`);
        console.log(`   📁 Marketplace: ${match.marketplaceFile} (${match.marketplaceSize})`);
        
        if (match.identical) {
            console.log('   ✅ Content is identical - candidate for removal');
        } else {
            console.log('   🔍 Content differs - requires manual review');
            
            // Show first few lines of each for comparison
            if (match.coreContent && match.marketplaceContent) {
                const coreLines = match.coreContent.split('\n').slice(0, 3);
                const marketplaceLines = match.marketplaceContent.split('\n').slice(0, 3);
                console.log('   📄 Core preview:');
                coreLines.forEach(line => console.log(`      ${line}`));
                console.log('   📄 Marketplace preview:');
                marketplaceLines.forEach(line => console.log(`      ${line}`));
            }
        }
    });
}

console.log('\n📊 SUMMARY:');
console.log(`   Total hook name matches: ${nameMatches.length}`);
console.log(`   Identical content: ${contentMatches.length}`);
console.log(`   Different content: ${similarContent.length}`);

if (contentMatches.length > 0) {
    console.log('\n🎯 CLEANUP RECOMMENDATIONS:');
    console.log('✅ SAFE TO REMOVE (identical content):');
    contentMatches.forEach(match => {
        if (!match.coreHasMedusa && !match.marketplaceHasMedusa) {
            console.log(`   🗑️  Consider removing: ${match.coreFile}`);
            console.log(`   ✅ Keep: ${match.marketplaceFile}`);
        } else {
            console.log(`   🛡️  MEDUSA PROTECTED: ${match.filename} - manual review needed`);
        }
    });
}

if (similarContent.length > 0) {
    console.log('\n⚠️  REQUIRES MANUAL REVIEW (different content):');
    similarContent.forEach(match => {
        const protection = match.coreHasMedusa || match.marketplaceHasMedusa ? ' 🛡️ MEDUSA' : '';
        console.log(`   🔍 ${match.filename}${protection} - Check which version to keep`);
    });
}

console.log('\n🛡️  SAFETY NOTE:');
console.log('   Always verify Medusa imports before removing any files');
console.log('   Files with @medusajs imports or HttpTypes are protected');
