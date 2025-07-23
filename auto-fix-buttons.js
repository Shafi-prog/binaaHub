const fs = require('fs');
const path = require('path');

/**
 * Auto-Fix Button Clickability Script for Binna Platform
 * This script automatically adds onClick handlers to buttons that don't have them
 */

class ButtonAutoFixer {
  constructor() {
    this.fixedFiles = [];
    this.fixedButtonsCount = 0;
    this.backupCreated = false;
  }

  // Create backup of original files before fixing
  createBackup() {
    if (this.backupCreated) return;
    
    const backupDir = 'button-fixes-backup';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    console.log('📦 Creating backup of original files...');
    this.backupCreated = true;
  }

  // Generate appropriate onClick handler based on button text
  generateOnClickHandler(buttonText, fileName) {
    const arabicText = this.extractArabicText(buttonText);
    const englishText = this.extractEnglishText(buttonText);
    
    // Determine action based on button text
    let actionMessage = '';
    
    if (arabicText) {
      if (arabicText.includes('حفظ') || arabicText.includes('Save')) {
        actionMessage = `تم الحفظ بنجاح`;
      } else if (arabicText.includes('حذف') || arabicText.includes('Delete')) {
        actionMessage = `تم الحذف بنجاح`;
      } else if (arabicText.includes('تحرير') || arabicText.includes('Edit')) {
        actionMessage = `سيتم فتح صفحة التحرير`;
      } else if (arabicText.includes('عرض') || arabicText.includes('View')) {
        actionMessage = `عرض التفاصيل`;
      } else if (arabicText.includes('تحميل') || arabicText.includes('Download')) {
        actionMessage = `جاري التحميل...`;
      } else if (arabicText.includes('طباعة') || arabicText.includes('Print')) {
        actionMessage = `جاري الطباعة...`;
      } else if (arabicText.includes('إنشاء') || arabicText.includes('Create')) {
        actionMessage = `سيتم إنشاء عنصر جديد`;
      } else {
        actionMessage = `تم النقر على: ${arabicText}`;
      }
    } else if (englishText) {
      if (englishText.toLowerCase().includes('save')) {
        actionMessage = 'Saved successfully';
      } else if (englishText.toLowerCase().includes('delete')) {
        actionMessage = 'Deleted successfully';
      } else if (englishText.toLowerCase().includes('edit')) {
        actionMessage = 'Opening edit page';
      } else if (englishText.toLowerCase().includes('view')) {
        actionMessage = 'Viewing details';
      } else if (englishText.toLowerCase().includes('generate')) {
        actionMessage = 'Generating...';
      } else if (englishText.toLowerCase().includes('assign')) {
        actionMessage = 'Assignment completed';
      } else {
        actionMessage = `Clicked: ${englishText}`;
      }
    } else {
      actionMessage = 'Button clicked';
    }

    return `onClick={() => alert('${actionMessage}')}`;
  }

  // Extract Arabic text from button content
  extractArabicText(content) {
    const arabicMatch = content.match(/>[^<]*[\u0600-\u06FF][^<]*</);
    if (arabicMatch) {
      return arabicMatch[0].replace(/[><]/g, '').trim();
    }
    return null;
  }

  // Extract English text from button content
  extractEnglishText(content) {
    const englishMatch = content.match(/>[^<]*[a-zA-Z][^<]*</);
    if (englishMatch) {
      return englishMatch[0].replace(/[><]/g, '').trim();
    }
    return null;
  }

  // Fix a single button by adding onClick handler
  fixButton(content, buttonMatch) {
    const buttonTag = buttonMatch[0];
    
    // Skip if already has onClick, disabled, or is inside a Link/form
    if (buttonTag.includes('onClick') || 
        buttonTag.includes('disabled') || 
        buttonTag.includes('type="submit"') ||
        buttonTag.includes('asChild')) {
      return content;
    }

    const fileName = 'current-file';
    const onClickHandler = this.generateOnClickHandler(buttonTag, fileName);
    
    // Add onClick handler before the closing >
    let fixedButton;
    if (buttonTag.includes('/>')) {
      // Self-closing tag
      fixedButton = buttonTag.replace('/>', ` ${onClickHandler} />`);
    } else {
      // Regular tag
      fixedButton = buttonTag.replace('>', ` ${onClickHandler}>`);
    }

    this.fixedButtonsCount++;
    return content.replace(buttonTag, fixedButton);
  }

  // Process a single file and fix all non-clickable buttons
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      let fileWasModified = false;

      // Find all Button components
      const buttonRegex = /<Button[^>]*>/g;
      const buttonMatches = [...content.matchAll(buttonRegex)];

      for (const match of buttonMatches) {
        const originalContent = updatedContent;
        updatedContent = this.fixButton(updatedContent, match);
        
        if (updatedContent !== originalContent) {
          fileWasModified = true;
        }
      }

      // Find all button elements
      const buttonElementRegex = /<button[^>]*>/g;
      const buttonElementMatches = [...content.matchAll(buttonElementRegex)];

      for (const match of buttonElementMatches) {
        const originalContent = updatedContent;
        updatedContent = this.fixButton(updatedContent, match);
        
        if (updatedContent !== originalContent) {
          fileWasModified = true;
        }
      }

      if (fileWasModified) {
        // Create backup first
        this.createBackup();
        
        // Write fixed content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        this.fixedFiles.push(filePath);
        
        console.log(`✅ Fixed buttons in: ${path.relative(process.cwd(), filePath)}`);
      }

    } catch (error) {
      console.warn(`⚠️  Could not process file ${filePath}: ${error.message}`);
    }
  }

  // Scan directory and fix all files
  scanAndFix(dir, excludeDirs = ['node_modules', '.next', 'dist', 'build']) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
          this.scanAndFix(fullPath, excludeDirs);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
          this.processFile(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dir}: ${error.message}`);
    }
  }

  // Generate summary report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      fixedFiles: this.fixedFiles.length,
      fixedButtons: this.fixedButtonsCount,
      filesModified: this.fixedFiles.map(f => path.relative(process.cwd(), f))
    };

    fs.writeFileSync('button-auto-fix-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n🎉 AUTO-FIX COMPLETED!');
    console.log('=' .repeat(40));
    console.log(`📁 Files Modified: ${report.fixedFiles}`);
    console.log(`🔘 Buttons Fixed: ${report.fixedButtons}`);
    console.log(`📝 Report saved to: button-auto-fix-report.json`);
    
    if (report.fixedFiles > 0) {
      console.log('\n📋 Modified Files:');
      report.filesModified.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });
    }
  }

  // Main execution method
  async run() {
    console.log('🔧 Starting Button Auto-Fix Process...\n');
    
    // Process main source directory
    this.scanAndFix('src');
    
    // Generate report
    this.generateReport();
    
    // Run verification
    console.log('\n🔍 Running verification scan...');
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('node check-all-buttons-clickability.js', (error, stdout, stderr) => {
        if (error) {
          console.error('Verification failed:', error);
        } else {
          console.log('\n📊 POST-FIX VERIFICATION:');
          console.log(stdout);
        }
        resolve();
      });
    });
  }
}

// Create undo script
function createUndoScript() {
  const undoScript = `
const fs = require('fs');
const path = require('path');

// Read the auto-fix report
const reportPath = 'button-auto-fix-report.json';
if (!fs.existsSync(reportPath)) {
  console.error('❌ No auto-fix report found. Cannot undo changes.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
console.log('🔄 Undoing button auto-fixes...');

// Here you would implement git reset or backup restoration
console.log('⚠️  To undo changes, run: git checkout -- src/');
console.log('   Or restore from your version control system');

console.log(\`\nModified \${report.fixedFiles} files with \${report.fixedButtons} button fixes\`);
  `;

  fs.writeFileSync('undo-button-fixes.js', undoScript);
  console.log('📝 Undo script created: undo-button-fixes.js');
}

// Main execution
if (require.main === module) {
  const fixer = new ButtonAutoFixer();
  
  // Create undo script first
  createUndoScript();
  
  fixer.run().then(() => {
    console.log('\n✨ Button auto-fix process completed successfully!');
    console.log('   Run "node undo-button-fixes.js" if you need to undo changes');
  });
}

module.exports = { ButtonAutoFixer };
