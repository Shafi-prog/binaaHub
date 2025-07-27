/**
 * CONTENT SIMILARITY CHECKER - CORE vs MARKETPLACE HOOKS
 * Checks for functional similarities between hook files even with different names
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 CHECKING CONTENT SIMILARITY BETWEEN CORE AND MARKETPLACE HOOKS');
console.log('Looking for functionally similar hooks with different names...\n');

const coreDir = 'src/core/shared/hooks';
const marketplaceDir = 'src/domains/marketplace/storefront/store';

// Get all hook files
function getHookFiles(dir, basePath = '') {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            files.push(...getHookFiles(fullPath, path.join(basePath, item)));
        } else if (item.startsWith('use-') && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
            files.push({
                name: item,
                path: fullPath,
                size: fs.statSync(fullPath).size
            });
        }
    }
    return files;
}

// Get normalized content for comparison
function getNormalizedContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/import.*from.*['"]/g, '') // Remove import statements
            .replace(/export.*{/g, '{') // Normalize exports
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    } catch (error) {
        return '';
    }
}

// Get simplified function signature
function getFunctionSignature(content) {
    const functionMatch = content.match(/export\s+(?:const|function)\s+(\w+)\s*[=\(]/);
    const paramMatch = content.match(/\(([^)]*)\)/);
    const returnMatch = content.match(/return\s*{([^}]*)}/);
    
    return {
        name: functionMatch ? functionMatch[1] : '',
        params: paramMatch ? paramMatch[1].replace(/\s+/g, ' ').trim() : '',
        returns: returnMatch ? returnMatch[1].replace(/\s+/g, ' ').trim() : ''
    };
}

// Calculate similarity score
function calculateSimilarity(content1, content2) {
    if (!content1 || !content2) return 0;
    
    const len1 = content1.length;
    const len2 = content2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1;
    
    // Simple character-based similarity
    let matches = 0;
    const minLen = Math.min(len1, len2);
    
    for (let i = 0; i < minLen; i++) {
        if (content1[i] === content2[i]) matches++;
    }
    
    return matches / maxLen;
}

// Check for Medusa imports
function hasMedusaImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes('@medusajs') || content.includes('HttpTypes');
    } catch (error) {
        return false;
    }
}

const coreFiles = getHookFiles(coreDir);
const marketplaceFiles = getHookFiles(marketplaceDir);

console.log(`📊 FILES TO ANALYZE:`);
console.log(`   Core hooks: ${coreFiles.length}`);
console.log(`   Marketplace hooks: ${marketplaceFiles.length}\n`);

const similarities = [];

console.log('🔍 ANALYZING CONTENT SIMILARITIES...\n');

// Compare all core files with all marketplace files
for (const coreFile of coreFiles) {
    const coreContent = getNormalizedContent(coreFile.path);
    const coreSignature = getFunctionSignature(fs.readFileSync(coreFile.path, 'utf8'));
    const coreHasMedusa = hasMedusaImports(coreFile.path);
    
    for (const marketplaceFile of marketplaceFiles) {
        const marketplaceContent = getNormalizedContent(marketplaceFile.path);
        const marketplaceSignature = getFunctionSignature(fs.readFileSync(marketplaceFile.path, 'utf8'));
        const marketplaceHasMedusa = hasMedusaImports(marketplaceFile.path);
        
        const similarity = calculateSimilarity(coreContent, marketplaceContent);
        
        // Only report high similarities (>60%) for different file names
        if (similarity > 0.6 && coreFile.name !== marketplaceFile.name) {
            similarities.push({
                coreFile: coreFile.name,
                corePath: coreFile.path,
                coreSize: (coreFile.size / 1024).toFixed(1) + 'KB',
                coreSignature,
                coreHasMedusa,
                marketplaceFile: marketplaceFile.name,
                marketplacePath: marketplaceFile.path,
                marketplaceSize: (marketplaceFile.size / 1024).toFixed(1) + 'KB',
                marketplaceSignature,
                marketplaceHasMedusa,
                similarity: (similarity * 100).toFixed(1) + '%'
            });
        }
    }
}

// Sort by similarity
similarities.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

console.log('📋 HIGH SIMILARITY MATCHES (>60%)');
console.log('='.repeat(60));

if (similarities.length === 0) {
    console.log('✅ No high-similarity content found between different hook files');
} else {
    console.log(`Found ${similarities.length} high-similarity matches:\n`);
    
    similarities.forEach(match => {
        const medusaWarning = match.coreHasMedusa || match.marketplaceHasMedusa ? ' 🛡️ MEDUSA' : '';
        console.log(`🔄 ${match.similarity} similarity${medusaWarning}`);
        console.log(`   📁 Core: ${match.coreFile} (${match.coreSize})`);
        console.log(`   📁 Marketplace: ${match.marketplaceFile} (${match.marketplaceSize})`);
        console.log(`   🔍 Function signatures:`);
        console.log(`      Core: ${match.coreSignature.name}(${match.coreSignature.params})`);
        console.log(`      Marketplace: ${match.marketplaceSignature.name}(${match.marketplaceSignature.params})`);
        console.log('');
    });
}

// Check for exact same function names with different content
console.log('🎯 FUNCTION NAME ANALYSIS');
console.log('-'.repeat(40));

const functionNames = new Map();

for (const file of [...coreFiles, ...marketplaceFiles]) {
    const content = fs.readFileSync(file.path, 'utf8');
    const signature = getFunctionSignature(content);
    if (signature.name) {
        if (!functionNames.has(signature.name)) {
            functionNames.set(signature.name, []);
        }
        functionNames.get(signature.name).push({
            file: file.name,
            path: file.path,
            signature,
            hasMedusa: hasMedusaImports(file.path)
        });
    }
}

// Find functions with same name in different files
for (const [funcName, instances] of functionNames) {
    if (instances.length > 1) {
        console.log(`\n⚠️  Function "${funcName}" found in multiple files:`);
        instances.forEach(instance => {
            const medusa = instance.hasMedusa ? ' 🛡️ MEDUSA' : '';
            console.log(`   📄 ${instance.file}${medusa}`);
        });
    }
}

console.log('\n🛡️  SAFETY REMINDERS:');
console.log('   🔒 Files with 🛡️ MEDUSA contain @medusajs imports - handle with care');
console.log('   📝 High similarity doesn\'t always mean duplication');
console.log('   🧪 Always test after any changes');
