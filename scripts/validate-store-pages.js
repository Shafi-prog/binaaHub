/**
 * Store Pages Validation and Arabic Localization Script
 * Checks for errors, missing translations, and English text in store pages
 */

const fs = require('fs');
const path = require('path');

class StorePageValidator {
  constructor() {
    this.storeDir = './src/app/store';
    this.errors = [];
    this.englishTexts = [];
    this.missingTranslations = [];
    this.componentIssues = [];
  }

  async validateAllPages() {
    console.log('🔍 Starting Store Pages Validation...\n');
    
    try {
      await this.scanDirectory(this.storeDir);
      await this.generateReport();
      await this.generateFixScript();
    } catch (error) {
      console.error('❌ Validation failed:', error);
    }
  }

  async scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.')) {
        await this.scanDirectory(fullPath);
      } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
        await this.analyzeFile(fullPath);
      }
    }
  }

  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative('.', filePath);
      
      console.log(`📄 Analyzing: ${relativePath}`);
      
      // Check for common errors
      this.checkForErrors(content, relativePath);
      
      // Check for English text in UI elements
      this.checkForEnglishText(content, relativePath);
      
      // Check for missing Arabic translations
      this.checkForMissingTranslations(content, relativePath);
      
      // Check component issues
      this.checkComponentIssues(content, relativePath);
      
    } catch (error) {
      this.errors.push({
        file: filePath,
        type: 'File Read Error',
        message: error.message
      });
    }
  }

  checkForErrors(content, filePath) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for console.error calls
      if (line.includes('console.error') && !line.includes('//')) {
        this.errors.push({
          file: filePath,
          line: lineNumber,
          type: 'Console Error',
          content: line.trim(),
          severity: 'medium'
        });
      }
      
      // Check for TODO/FIXME comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        this.errors.push({
          file: filePath,
          line: lineNumber,
          type: 'TODO/FIXME',
          content: line.trim(),
          severity: 'low'
        });
      }
      
      // Check for @ts-ignore or @ts-nocheck
      if (line.includes('@ts-ignore') || line.includes('@ts-nocheck')) {
        this.errors.push({
          file: filePath,
          line: lineNumber,
          type: 'TypeScript Suppression',
          content: line.trim(),
          severity: 'medium'
        });
      }
      
      // Check for missing error handling
      if (line.includes('async') && line.includes('function') && !content.includes('try') && !content.includes('catch')) {
        this.errors.push({
          file: filePath,
          line: lineNumber,
          type: 'Missing Error Handling',
          content: 'Async function without try-catch',
          severity: 'high'
        });
      }
    });
  }

  checkForEnglishText(content, filePath) {
    const lines = content.split('\n');
    
    // Common English button texts and labels that should be Arabic
    const englishPatterns = [
      /["']Add[^"']*["']/g,
      /["']Edit[^"']*["']/g,
      /["']Delete[^"']*["']/g,
      /["']Save[^"']*["']/g,
      /["']Cancel[^"']*["']/g,
      /["']Create[^"']*["']/g,
      /["']Update[^"']*["']/g,
      /["']Submit[^"']*["']/g,
      /["']Search[^"']*["']/g,
      /["']Filter[^"']*["']/g,
      /["']Export[^"']*["']/g,
      /["']Import[^"']*["']/g,
      /["']Download[^"']*["']/g,
      /["']Upload[^"']*["']/g,
      /["']View[^"']*["']/g,
      /["']Details[^"']*["']/g,
      /["']Settings[^"']*["']/g,
      /["']Back[^"']*["']/g,
      /["']Next[^"']*["']/g,
      /["']Previous[^"']*["']/g,
      /["']Load More[^"']*["']/g,
      /["']Select[^"']*["']/g,
      /["']Choose[^"']*["']/g,
      /["']Browse[^"']*["']/g,
      /["']Open[^"']*["']/g,
      /["']Close[^"']*["']/g,
      /["']Actions[^"']*["']/g,
      /["']Options[^"']*["']/g
    ];
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      englishPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Skip if it's in a comment or import
            if (!line.trim().startsWith('//') && !line.includes('import') && !line.includes('from')) {
              this.englishTexts.push({
                file: filePath,
                line: lineNumber,
                englishText: match,
                context: line.trim(),
                priority: 'high'
              });
            }
          });
        }
      });
      
      // Check for placeholder English text
      if (line.includes('placeholder=') && /placeholder=["'][^"']*[a-zA-Z][^"']*["']/.test(line)) {
        const match = line.match(/placeholder=["']([^"']+)["']/);
        if (match && /^[a-zA-Z\s]+$/.test(match[1])) {
          this.englishTexts.push({
            file: filePath,
            line: lineNumber,
            englishText: match[1],
            context: line.trim(),
            priority: 'medium',
            type: 'placeholder'
          });
        }
      }
    });
  }

  checkForMissingTranslations(content, filePath) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for hardcoded strings that should be translatable
      const hardcodedPatterns = [
        /<h[1-6][^>]*>[^<]*[a-zA-Z][^<]*<\/h[1-6]>/g,
        /<p[^>]*>[^<]*[a-zA-Z][^<]*<\/p>/g,
        /<span[^>]*>[^<]*[a-zA-Z][^<]*<\/span>/g,
        /<div[^>]*title=["'][^"']*[a-zA-Z][^"']*["']/g
      ];
      
      hardcodedPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Skip Arabic text, imports, and comments
            if (!/[\u0600-\u06FF]/.test(match) && !line.includes('import') && !line.trim().startsWith('//')) {
              this.missingTranslations.push({
                file: filePath,
                line: lineNumber,
                content: match,
                context: line.trim()
              });
            }
          });
        }
      });
    });
  }

  checkComponentIssues(content, filePath) {
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for Select components (hydration issues)
      if (line.includes('<Select') || line.includes('Select>')) {
        this.componentIssues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Select Component - Potential Hydration Issue',
          suggestion: 'Consider using native HTML select element',
          content: line.trim(),
          severity: 'medium'
        });
      }
      
      // Check for missing key props in maps
      if (line.includes('.map(') && !content.slice(content.indexOf(line)).split('\n').slice(0, 5).join('\n').includes('key=')) {
        this.componentIssues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Missing key prop in map',
          suggestion: 'Add unique key prop to mapped elements',
          content: line.trim(),
          severity: 'high'
        });
      }
      
      // Check for missing loading states
      if (line.includes('async') && line.includes('function') && !content.includes('loading') && !content.includes('Loading')) {
        this.componentIssues.push({
          file: filePath,
          line: lineNumber,
          issue: 'Missing loading state',
          suggestion: 'Add loading state for async operations',
          content: line.trim(),
          severity: 'medium'
        });
      }
    });
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: this.errors.length,
        totalEnglishTexts: this.englishTexts.length,
        totalMissingTranslations: this.missingTranslations.length,
        totalComponentIssues: this.componentIssues.length
      },
      errors: this.errors,
      englishTexts: this.englishTexts,
      missingTranslations: this.missingTranslations,
      componentIssues: this.componentIssues
    };
    
    // Write detailed report
    fs.writeFileSync('./store-validation-report.json', JSON.stringify(report, null, 2));
    
    // Generate summary
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('=====================');
    console.log(`🚨 Errors Found: ${this.errors.length}`);
    console.log(`🔤 English Texts: ${this.englishTexts.length}`);
    console.log(`📝 Missing Translations: ${this.missingTranslations.length}`);
    console.log(`⚛️ Component Issues: ${this.componentIssues.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ TOP ERRORS:');
      this.errors.slice(0, 5).forEach(error => {
        console.log(`  • ${error.file}:${error.line} - ${error.type}: ${error.content}`);
      });
    }
    
    if (this.englishTexts.length > 0) {
      console.log('\n🔤 TOP ENGLISH TEXTS TO TRANSLATE:');
      this.englishTexts.slice(0, 5).forEach(item => {
        console.log(`  • ${item.file}:${item.line} - "${item.englishText}"`);
      });
    }
    
    console.log(`\n📄 Full report saved to: store-validation-report.json`);
  }

  async generateFixScript() {
    let fixScript = `#!/usr/bin/env node
/**
 * Auto-generated script to fix store page issues
 * Generated on: ${new Date().toISOString()}
 */

const fs = require('fs');

console.log('🔧 Starting automatic fixes...');

// Arabic translations for common English texts
const translations = {
  'Add': 'إضافة',
  'Edit': 'تعديل',
  'Delete': 'حذف',
  'Save': 'حفظ',
  'Cancel': 'إلغاء',
  'Create': 'إنشاء',
  'Update': 'تحديث',
  'Submit': 'إرسال',
  'Search': 'بحث',
  'Filter': 'تصفية',
  'Export': 'تصدير',
  'Import': 'استيراد',
  'Download': 'تنزيل',
  'Upload': 'رفع',
  'View': 'عرض',
  'Details': 'التفاصيل',
  'Settings': 'الإعدادات',
  'Back': 'رجوع',
  'Next': 'التالي',
  'Previous': 'السابق',
  'Load More': 'تحميل المزيد',
  'Select': 'اختيار',
  'Choose': 'اختر',
  'Browse': 'تصفح',
  'Open': 'فتح',
  'Close': 'إغلاق',
  'Actions': 'الإجراءات',
  'Options': 'الخيارات',
  'Remove': 'إزالة',
  'Clear': 'مسح',
  'Reset': 'إعادة تعيين',
  'Apply': 'تطبيق',
  'Confirm': 'تأكيد'
};

`;

    // Add specific fixes for English texts found
    if (this.englishTexts.length > 0) {
      fixScript += `
// Fix English button texts
const englishTextFixes = [
`;
      
      this.englishTexts.forEach(item => {
        const englishWord = item.englishText.replace(/['"]/g, '');
        const arabicTranslation = this.getArabicTranslation(englishWord);
        
        fixScript += `
  {
    file: '${item.file}',
    line: ${item.line},
    search: ${item.englishText},
    replace: '${arabicTranslation}',
    context: '${item.context.replace(/'/g, "\\'")}'
  },`;
      });
      
      fixScript += `
];

// Apply English text fixes
englishTextFixes.forEach(fix => {
  try {
    const content = fs.readFileSync(fix.file, 'utf8');
    const newContent = content.replace(fix.search, fix.replace);
    if (content !== newContent) {
      fs.writeFileSync(fix.file, newContent);
      console.log(\`✅ Fixed English text in \${fix.file}: \${fix.search} → \${fix.replace}\`);
    }
  } catch (error) {
    console.error(\`❌ Error fixing \${fix.file}:\`, error.message);
  }
});
`;
    }

    // Add component fixes
    if (this.componentIssues.length > 0) {
      fixScript += `
// Component fixes
const componentFixes = [
`;
      
      this.componentIssues.forEach(issue => {
        if (issue.issue.includes('Select Component')) {
          fixScript += `
  {
    file: '${issue.file}',
    description: 'Convert Select to native HTML select',
    // Manual intervention required for Select components
  },`;
        }
      });
      
      fixScript += `
];

console.log('⚠️  Component fixes require manual intervention. See componentFixes array above.');
`;
    }

    fixScript += `
console.log('✅ Automatic fixes completed!');
console.log('📋 Manual review recommended for complex changes.');
`;

    fs.writeFileSync('./fix-store-pages.js', fixScript);
    console.log(`🔧 Fix script generated: fix-store-pages.js`);
  }

  getArabicTranslation(englishText) {
    const translations = {
      'Add': 'إضافة',
      'Edit': 'تعديل', 
      'Delete': 'حذف',
      'Save': 'حفظ',
      'Cancel': 'إلغاء',
      'Create': 'إنشاء',
      'Update': 'تحديث',
      'Submit': 'إرسال',
      'Search': 'بحث',
      'Filter': 'تصفية',
      'Export': 'تصدير',
      'Import': 'استيراد',
      'Download': 'تنزيل',
      'Upload': 'رفع',
      'View': 'عرض',
      'Details': 'التفاصيل',
      'Settings': 'الإعدادات',
      'Back': 'رجوع',
      'Next': 'التالي',
      'Previous': 'السابق',
      'Load More': 'تحميل المزيد',
      'Select': 'اختيار',
      'Choose': 'اختر',
      'Browse': 'تصفح',
      'Open': 'فتح',
      'Close': 'إغلاق',
      'Actions': 'الإجراءات',
      'Options': 'الخيارات'
    };
    
    return translations[englishText] || englishText;
  }
}

// Run validation
if (require.main === module) {
  const validator = new StorePageValidator();
  validator.validateAllPages();
}

module.exports = StorePageValidator;
