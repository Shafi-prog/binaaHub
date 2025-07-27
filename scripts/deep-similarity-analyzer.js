const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 DEEP SIMILARITY ANALYSIS - FUNCTIONAL DUPLICATES\n');
console.log('Analyzing code content, not just names...\n');

class DeepSimilarityAnalyzer {
  constructor() {
    this.files = [];
    this.functionSignatures = new Map();
    this.componentStructures = new Map();
    this.contentHashes = new Map();
    this.duplicateGroups = [];
  }

  // Collect all TypeScript/JavaScript files
  collectFiles(dirPath, relativePath = '') {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', '.git', '.next', 'dist', 'redundancy-cleanup-backup'].includes(item)) {
            this.collectFiles(fullPath, itemRelativePath);
          }
        } else if (/\.(ts|tsx|js|jsx)$/.test(item) && !item.includes('.test.') && !item.includes('.spec.')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            this.files.push({
              fullPath,
              relativePath: itemRelativePath,
              name: item,
              content,
              size: fs.statSync(fullPath).size,
              extension: path.extname(item)
            });
          } catch (error) {
            // Skip files we can't read
          }
        }
      });
    } catch (error) {
      // Skip directories we can't access
    }
  }

  // Extract function signatures and patterns
  extractFunctionSignatures(file) {
    const patterns = {
      functions: /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*=>\s*{|async\s*\([^)]*\)\s*=>))/g,
      exports: /export\s+(?:default\s+)?(?:function\s+(\w+)|const\s+(\w+)|class\s+(\w+))/g,
      hooks: /use[A-Z]\w*/g,
      components: /(?:function\s+([A-Z]\w*)|const\s+([A-Z]\w*)\s*=.*(?:React\.FC|React\.Component|\(\s*\)\s*=>|\([^)]*\)\s*=>))/g,
      imports: /import\s+.*from\s+['"][^'"]*['"]/g,
      jsxElements: /<([A-Z]\w*)/g
    };

    const signatures = {
      functions: [],
      exports: [],
      hooks: [],
      components: [],
      imports: [],
      jsxElements: []
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      let match;
      while ((match = pattern.exec(file.content)) !== null) {
        signatures[key].push(match[0]);
      }
    });

    return signatures;
  }

  // Calculate content similarity using various metrics
  calculateSimilarity(file1, file2) {
    // 1. Exact content hash
    const hash1 = crypto.createHash('md5').update(file1.content).digest('hex');
    const hash2 = crypto.createHash('md5').update(file2.content).digest('hex');
    
    if (hash1 === hash2) {
      return { type: 'identical', score: 1.0 };
    }

    // 2. Normalized content (remove whitespace, comments)
    const normalize = (content) => {
      return content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/['"`]/g, '"') // Normalize quotes
        .trim();
    };

    const norm1 = normalize(file1.content);
    const norm2 = normalize(file2.content);
    
    if (norm1 === norm2) {
      return { type: 'whitespace_diff', score: 0.95 };
    }

    // 3. Function signature similarity
    const sig1 = this.extractFunctionSignatures(file1);
    const sig2 = this.extractFunctionSignatures(file2);
    
    let sigSimilarity = 0;
    let totalSigs = 0;
    
    Object.keys(sig1).forEach(key => {
      const set1 = new Set(sig1[key]);
      const set2 = new Set(sig2[key]);
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      
      if (union.size > 0) {
        sigSimilarity += intersection.size / union.size;
        totalSigs++;
      }
    });
    
    const avgSigSimilarity = totalSigs > 0 ? sigSimilarity / totalSigs : 0;

    // 4. Line-by-line similarity
    const lines1 = file1.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const lines2 = file2.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const commonLines = lines1.filter(line => lines2.includes(line)).length;
    const totalLines = Math.max(lines1.length, lines2.length);
    const lineSimilarity = totalLines > 0 ? commonLines / totalLines : 0;

    // 5. Structure similarity (imports, exports, main patterns)
    const structureSimilarity = this.calculateStructureSimilarity(file1, file2);

    // Combined score
    const combinedScore = (avgSigSimilarity * 0.3 + lineSimilarity * 0.4 + structureSimilarity * 0.3);

    if (combinedScore > 0.8) return { type: 'very_similar', score: combinedScore };
    if (combinedScore > 0.6) return { type: 'similar', score: combinedScore };
    if (combinedScore > 0.4) return { type: 'somewhat_similar', score: combinedScore };
    
    return { type: 'different', score: combinedScore };
  }

  calculateStructureSimilarity(file1, file2) {
    // Compare structural patterns
    const patterns = [
      /export\s+default/g,
      /import.*from/g,
      /interface\s+\w+/g,
      /type\s+\w+/g,
      /const\s+\w+.*=/g,
      /function\s+\w+/g,
      /class\s+\w+/g,
      /useEffect/g,
      /useState/g,
      /return\s*\(/g
    ];

    let totalMatches = 0;
    let commonMatches = 0;

    patterns.forEach(pattern => {
      const matches1 = (file1.content.match(pattern) || []).length;
      const matches2 = (file2.content.match(pattern) || []).length;
      
      totalMatches += Math.max(matches1, matches2);
      commonMatches += Math.min(matches1, matches2);
    });

    return totalMatches > 0 ? commonMatches / totalMatches : 0;
  }

  // Find duplicate groups
  findDuplicates() {
    console.log(`📊 Analyzing ${this.files.length} files for deep similarities...\n`);
    
    const duplicateGroups = new Map();
    let identicalCount = 0;
    let similarCount = 0;

    for (let i = 0; i < this.files.length; i++) {
      for (let j = i + 1; j < this.files.length; j++) {
        const file1 = this.files[i];
        const file2 = this.files[j];
        
        // Skip if same file name (already handled)
        if (file1.name === file2.name) continue;
        
        // Skip if very different sizes (likely different functionality)
        const sizeDiff = Math.abs(file1.size - file2.size) / Math.max(file1.size, file2.size);
        if (sizeDiff > 0.8) continue;

        const similarity = this.calculateSimilarity(file1, file2);
        
        if (similarity.score > 0.6) {
          const key = `${similarity.type}_${similarity.score.toFixed(2)}`;
          if (!duplicateGroups.has(key)) {
            duplicateGroups.set(key, []);
          }
          
          duplicateGroups.get(key).push({
            file1: file1.relativePath,
            file2: file2.relativePath,
            similarity: similarity.score,
            type: similarity.type,
            size1: file1.size,
            size2: file2.size
          });

          if (similarity.type === 'identical' || similarity.type === 'whitespace_diff') {
            identicalCount++;
          } else {
            similarCount++;
          }
        }
      }
    }

    return { duplicateGroups, identicalCount, similarCount };
  }

  // Analyze functional patterns
  analyzeFunctionalPatterns() {
    console.log('🎯 Analyzing functional patterns...\n');
    
    const functionalGroups = {
      forms: [],
      lists: [],
      dashboards: [],
      modals: [],
      tables: [],
      authentication: [],
      api_calls: [],
      hooks: [],
      utilities: []
    };

    this.files.forEach(file => {
      const content = file.content.toLowerCase();
      const relativePath = file.relativePath.toLowerCase();
      
      // Categorize by functionality
      if (content.includes('form') || content.includes('input') || content.includes('submit') || content.includes('validation')) {
        functionalGroups.forms.push(file);
      }
      
      if (content.includes('map(') || content.includes('list') || content.includes('foreach') || relativePath.includes('/list')) {
        functionalGroups.lists.push(file);
      }
      
      if (content.includes('dashboard') || content.includes('overview') || content.includes('summary')) {
        functionalGroups.dashboards.push(file);
      }
      
      if (content.includes('modal') || content.includes('dialog') || content.includes('popup')) {
        functionalGroups.modals.push(file);
      }
      
      if (content.includes('table') || content.includes('datagrid') || content.includes('column')) {
        functionalGroups.tables.push(file);
      }
      
      if (content.includes('login') || content.includes('auth') || content.includes('signin') || content.includes('signup')) {
        functionalGroups.authentication.push(file);
      }
      
      if (content.includes('fetch') || content.includes('axios') || content.includes('api') || content.includes('endpoint')) {
        functionalGroups.api_calls.push(file);
      }
      
      if (relativePath.includes('/hooks/') || file.name.startsWith('use')) {
        functionalGroups.hooks.push(file);
      }
      
      if (relativePath.includes('/utils/') || relativePath.includes('/helpers/')) {
        functionalGroups.utilities.push(file);
      }
    });

    return functionalGroups;
  }

  // Generate comprehensive report
  generateReport() {
    console.log('📋 DEEP SIMILARITY ANALYSIS REPORT\n');
    console.log('=' .repeat(60) + '\n');

    const { duplicateGroups, identicalCount, similarCount } = this.findDuplicates();
    const functionalGroups = this.analyzeFunctionalPatterns();

    // Report duplicates
    if (duplicateGroups.size > 0) {
      console.log('🚨 CONTENT SIMILARITIES FOUND:\n');
      
      duplicateGroups.forEach((group, key) => {
        console.log(`📁 ${key.toUpperCase().replace('_', ' ')} GROUP:`);
        group.forEach(item => {
          console.log(`   ${item.file1} ↔ ${item.file2}`);
          console.log(`   Similarity: ${(item.similarity * 100).toFixed(1)}% | Sizes: ${(item.size1/1024).toFixed(1)}KB ↔ ${(item.size2/1024).toFixed(1)}KB`);
          console.log('');
        });
      });
    } else {
      console.log('✅ NO SIGNIFICANT CONTENT DUPLICATES FOUND\n');
    }

    // Report functional patterns
    console.log('🎯 FUNCTIONAL PATTERN ANALYSIS:\n');
    Object.entries(functionalGroups).forEach(([category, files]) => {
      if (files.length > 1) {
        console.log(`📂 ${category.toUpperCase()} (${files.length} files):`);
        
        // Group by directory to find potential duplicates
        const byDirectory = {};
        files.forEach(file => {
          const dir = path.dirname(file.relativePath);
          if (!byDirectory[dir]) byDirectory[dir] = [];
          byDirectory[dir].push(file);
        });
        
        Object.entries(byDirectory).forEach(([dir, dirFiles]) => {
          if (dirFiles.length > 1) {
            console.log(`   ⚠️  Multiple ${category} files in ${dir}:`);
            dirFiles.forEach(file => {
              console.log(`      - ${file.name} (${(file.size/1024).toFixed(1)}KB)`);
            });
          } else {
            console.log(`   ✅ ${dirFiles[0].relativePath}`);
          }
        });
        console.log('');
      }
    });

    // Summary
    console.log('📊 FINAL SUMMARY:');
    console.log(`   Files analyzed: ${this.files.length}`);
    console.log(`   Identical/near-identical pairs: ${identicalCount}`);
    console.log(`   Similar pairs: ${similarCount}`);
    console.log(`   Total similarity groups: ${duplicateGroups.size}`);
    
    if (duplicateGroups.size === 0) {
      console.log('\n🎉 EXCELLENT! No significant functional duplicates found!');
      console.log('✅ Your codebase has unique, distinct functionality in each file');
      console.log('✅ No hidden content duplicates detected');
    } else {
      console.log('\n🔧 RECOMMENDATIONS:');
      console.log('1. Review identical/near-identical files for consolidation');
      console.log('2. Check if similar files can share common utilities');
      console.log('3. Consider abstracting common patterns into reusable components');
    }
  }
}

// Run the analysis
const analyzer = new DeepSimilarityAnalyzer();
analyzer.collectFiles(path.join(__dirname, 'src'));
analyzer.generateReport();
