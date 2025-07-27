const fs = require('fs');
const path = require('path');

console.log('🔍 MEDUSA FILES SAFETY CHECK\n');
console.log('Analyzing "use-" files to identify Medusa imports...\n');

class MedusaFileAnalyzer {
  constructor() {
    this.medusaFiles = [];
    this.nonMedusaFiles = [];
    this.duplicateFiles = [];
  }

  analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(__dirname, filePath);
      
      // Check for Medusa indicators
      const medusaIndicators = [
        /@medusajs\//,
        /HttpTypes.*medusa/,
        /from\s+["']@medusajs/,
        /import.*@medusajs/,
        /MedusaRequest/,
        /MedusaResponse/,
        /RegionCountryDTO/,
        /@\/lib\/config/,
        /@\/lib\/util/,
        /useAdminCustom/,
        /AdminCustom/
      ];

      const isMedusaFile = medusaIndicators.some(pattern => pattern.test(content));
      
      const fileInfo = {
        path: relativePath,
        fullPath: filePath,
        size: fs.statSync(filePath).size,
        isMedusa: isMedusaFile,
        medusaImports: this.extractMedusaImports(content),
        lastModified: fs.statSync(filePath).mtime
      };

      if (isMedusaFile) {
        this.medusaFiles.push(fileInfo);
      } else {
        this.nonMedusaFiles.push(fileInfo);
      }

      return fileInfo;
    } catch (error) {
      console.log(`❌ Error analyzing ${filePath}: ${error.message}`);
      return null;
    }
  }

  extractMedusaImports(content) {
    const medusaImports = [];
    
    // Find Medusa imports
    const importMatches = content.match(/@medusajs\/[^'"]+/g);
    if (importMatches) {
      medusaImports.push(...importMatches);
    }

    // Find Medusa types
    const typeMatches = content.match(/HttpTypes\.\w+/g);
    if (typeMatches) {
      medusaImports.push(...typeMatches);
    }

    return [...new Set(medusaImports)]; // Remove duplicates
  }

  findDuplicatePatterns() {
    // Group files by similar names (ignoring version suffixes)
    const groups = {};
    
    [...this.medusaFiles, ...this.nonMedusaFiles].forEach(file => {
      const basename = path.basename(file.path).replace(/-v\d+/, '');
      if (!groups[basename]) groups[basename] = [];
      groups[basename].push(file);
    });

    Object.entries(groups).forEach(([basename, files]) => {
      if (files.length > 1) {
        this.duplicateFiles.push({ basename, files });
      }
    });
  }

  generateReport() {
    console.log('📋 MEDUSA FILE ANALYSIS REPORT\n');
    console.log('=' .repeat(60) + '\n');

    console.log(`📊 SUMMARY:`);
    console.log(`   Medusa files: ${this.medusaFiles.length}`);
    console.log(`   Non-Medusa files: ${this.nonMedusaFiles.length}`);
    console.log(`   Duplicate groups: ${this.duplicateFiles.length}\n`);

    if (this.medusaFiles.length > 0) {
      console.log('🛡️  PROTECTED MEDUSA FILES (DO NOT DELETE):');
      this.medusaFiles.forEach(file => {
        console.log(`   ✅ ${file.path}`);
        if (file.medusaImports.length > 0) {
          console.log(`      📦 Medusa imports: ${file.medusaImports.slice(0, 3).join(', ')}${file.medusaImports.length > 3 ? '...' : ''}`);
        }
      });
      console.log('');
    }

    if (this.duplicateFiles.length > 0) {
      console.log('⚠️  DUPLICATE GROUPS ANALYSIS:');
      this.duplicateFiles.forEach(group => {
        console.log(`\n📁 ${group.basename}:`);
        
        const medusaFiles = group.files.filter(f => f.isMedusa);
        const nonMedusaFiles = group.files.filter(f => !f.isMedusa);
        
        if (medusaFiles.length > 0) {
          console.log(`   🛡️  Medusa files (PROTECT):`);
          medusaFiles.forEach(file => {
            console.log(`      ✅ ${file.path} (${(file.size/1024).toFixed(1)}KB)`);
          });
        }
        
        if (nonMedusaFiles.length > 0) {
          console.log(`   🧹 Non-Medusa files (can review for cleanup):`);
          nonMedusaFiles.forEach(file => {
            console.log(`      ⚠️  ${file.path} (${(file.size/1024).toFixed(1)}KB)`);
          });
        }
      });
    }

    if (this.nonMedusaFiles.length > 0) {
      console.log('\n🔍 NON-MEDUSA FILES (safe to review for duplicates):');
      this.nonMedusaFiles.forEach(file => {
        console.log(`   📄 ${file.path} (${(file.size/1024).toFixed(1)}KB)`);
      });
    }

    this.generateSafeCleanupRecommendations();
  }

  generateSafeCleanupRecommendations() {
    console.log('\n🎯 SAFE CLEANUP RECOMMENDATIONS:\n');

    const safeToRemove = [];
    const requiresReview = [];

    this.duplicateFiles.forEach(group => {
      const medusaFiles = group.files.filter(f => f.isMedusa);
      const nonMedusaFiles = group.files.filter(f => !f.isMedusa);
      
      if (medusaFiles.length > 0 && nonMedusaFiles.length > 0) {
        // Non-Medusa duplicates can potentially be removed
        nonMedusaFiles.forEach(file => {
          safeToRemove.push(file);
        });
      } else if (nonMedusaFiles.length > 1) {
        // Multiple non-Medusa files with same pattern
        const sortedByDate = nonMedusaFiles.sort((a, b) => b.lastModified - a.lastModified);
        // Keep newest, mark others for review
        sortedByDate.slice(1).forEach(file => {
          requiresReview.push(file);
        });
      }
    });

    if (safeToRemove.length > 0) {
      console.log('✅ SAFE TO REMOVE (non-Medusa duplicates):');
      safeToRemove.forEach(file => {
        console.log(`   🗑️  ${file.path}`);
      });
      console.log('');
    }

    if (requiresReview.length > 0) {
      console.log('⚠️  REQUIRES MANUAL REVIEW:');
      requiresReview.forEach(file => {
        console.log(`   🔍 ${file.path}`);
      });
      console.log('');
    }

    console.log('🛡️  CRITICAL SAFETY RULES:');
    console.log('1. ✅ NEVER delete files with @medusajs imports');
    console.log('2. ✅ NEVER delete files with HttpTypes from Medusa');
    console.log('3. ✅ NEVER delete files with Medusa-specific patterns');
    console.log('4. ✅ ALWAYS check file content before deletion');
    console.log('5. ✅ Keep files that are actively used by Medusa integration');

    console.log('\n🚀 NEXT STEPS:');
    console.log('1. 📋 Review the safe-to-remove list');
    console.log('2. 🧪 Test Medusa integration after any changes');
    console.log('3. 📝 Update imports if removing any files');
    console.log('4. 🔄 Commit changes incrementally');
  }
}

// Analyze all "use-" files
const analyzer = new MedusaFileAnalyzer();

function scanUseFiles(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist', 'redundancy-cleanup-backup'].includes(item)) {
          scanUseFiles(fullPath);
        }
      } else if (/^use-.*\.(ts|tsx|js|jsx)$/.test(item)) {
        analyzer.analyzeFile(fullPath);
      }
    });
  } catch (error) {
    // Skip directories we can't read
  }
}

console.log('🔍 Scanning for "use-" files...\n');
scanUseFiles(path.join(__dirname, 'src'));

analyzer.findDuplicatePatterns();
analyzer.generateReport();
